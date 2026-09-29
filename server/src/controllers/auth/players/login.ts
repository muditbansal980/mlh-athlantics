import type { Request, Response } from 'express';
import { db } from "../../../db/kysely/kysely.js";
// import { Database } from "../../kysely/types.js";
import { LoginSchema } from "../../../zod-validation-schema/schema.js";
import {setUser} from "../../../services/auth/auth.js";
import bycrypt from "bcrypt";

const authcontroller = async (req: Request, res: Response) => {
    const { Email, Password } = req.body;
    try {
        const validationResult = LoginSchema.safeParse({ Email, Password });
        if (!validationResult.success) {
            return res.status(400).json({ message: 'Validation failed', errors: validationResult.error });
        }
        const user = await db.selectFrom('User')
            .selectAll()
            .where('Email', '=', Email)
            .executeTakeFirst();
            
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bycrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = setUser(user.Id,user.Email, user.Username, user.Role);
        res.cookie('uid', token, { httpOnly: true, secure: true, sameSite: 'none' }); // changed secure to false for development, set to true in production with HTTPS
        
        res.json({ message: 'Login successful', User:{ Id: user.Id, Email: user.Email, Username: user.Username, Role: user.Role } });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export default authcontroller;
