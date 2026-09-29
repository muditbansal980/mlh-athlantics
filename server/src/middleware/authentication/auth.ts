import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../services/auth/auth.js";
async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.uid;
    
    if (!token) {
        // console.log("No token provided");
        return res.status(401).json({ message: "Unauthenticated" });
    }
    try {
        const decoded = verifyToken(token);
        // console.log("Decoded token:", decoded);
        req.user = decoded;
        
        next();
    } catch (error) {
        console.error("Token verification failed:", error);

        return res.status(401).json({ message: "Invalid token", error: error });
    }
}
export default authMiddleware;