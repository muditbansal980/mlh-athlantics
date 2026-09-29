import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../../services/auth/auth.js";
async function authorize(req: Request, res: Response, next: NextFunction) {
    const usercookie = req.cookies?.uid;
    const user = verifyToken(usercookie);
    const { ownerId } = req.params;
    // console.log("Owner ID from request params:", ownerId);
    // console.log("User ID from token:", user?.Id);
    if(user.Role !== "ADMIN" && user.Id !== ownerId){
        return res.status(403).json({ message: "Forbidden: You don't have permission to access this resource." });
    }
    next();
}

export default authorize;