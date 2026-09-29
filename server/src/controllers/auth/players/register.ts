import type { Request, Response } from 'express';
import { db } from "../../../db/kysely/kysely.js";
import bycrypt from "bcrypt";
// import { Database } from "../../kysely/types.js";
import { RegisterSchema } from "../../../zod-validation-schema/schema.js";

const authcontroller = async (req: Request<typeof RegisterSchema>, res: Response) => {
    const { Username, Email, Password } = req.body ?? {};
    try {
        const validationResult = RegisterSchema.safeParse({ Username, Email, Password });
        if (!validationResult.success) {
            return res.status(400).json({ message: 'Validation failed', errors: validationResult.error });
        }
        const hashedpassword = bycrypt.hashSync(Password, 10);
        const existingByUsername = await db.selectFrom('User')
            .select('Username')
            .where('Username', '=', Username)
            .executeTakeFirst();
        if (existingByUsername) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const userId = crypto.randomUUID();
        await db.insertInto('User')
            .values({
                Id: userId,
                Role: "PLAYER",
                Username: Username,
                Email: Email,
                Password: hashedpassword
            })
            .executeTakeFirst();
        await db.insertInto("Streak").values({
            Id: crypto.randomUUID(),
            CreatedBy: userId,
            CurrentStreak: 0,
            LongestStreak: 0,
            // LastUploadDate: new Date()
        }).execute();

        await db.insertInto("XP").values({
            Id: crypto.randomUUID(),
            UserId: userId,
            SportsCategory: "GENERAL", 
            IncrementBy: "Initial Registration",
            TotalXP: 0,
            CreatedAt: new Date()
        }).execute();
        await db.insertInto("Profile").values({
            Id: crypto.randomUUID(),
            UserId: userId,
            CreatedAt: new Date(),
        }).execute();
        return res.json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default authcontroller;
