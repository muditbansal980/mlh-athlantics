// Middleware to check if the user is an admin
import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../service/auth/auth.js";
import { verify } from "node:crypto";
async function authorize(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.uid;
    const user = verifyToken(token);
    // console.log("User from cookie in authorization middleware:", user.Role);
    if(user?.Role !== "ADMIN"){
        // console.log("Authorization failed: User is not an admin");
        return res.status(403).json({ message: "Forbidden: Admins only" });
        
    }
    // console.log("Authorization successful for user:", user);
    next();
}
export default authorize;