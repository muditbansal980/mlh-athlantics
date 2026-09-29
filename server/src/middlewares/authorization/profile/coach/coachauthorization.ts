import { Request, Response, NextFunction } from "express";
import { db } from "../../../../db/kysely/kysely.js";
import { verifyToken } from "../../../../service/auth/auth.js";
async function authorize(req: Request, res: Response, next: NextFunction) {
    const userUid = req.cookies?.uid;
    const user = verifyToken(userUid);
    const userCoachId = await db.selectFrom("Coach").select("Id").where("AppliedBy", "=", user?.Id).executeTakeFirst(); //logged in user coachId
    if (!user) {
        return res.status(401).json({ message: "Unauthenticated: Please log in to access this resource." });
    }
    const { coachId } = req.params; // coachId from the request params whose profile is being accessed
    if (userCoachId?.Id !== coachId && user?.Role !== "ADMIN") {
        return res.status(403).json({ message: "Unauthorized: You do not have permission to access this resource." });
    }
    // console.log("Authorization successful for user:", user?.Id, "to access coach profile:", coachId);
    next();
}
export default authorize;
