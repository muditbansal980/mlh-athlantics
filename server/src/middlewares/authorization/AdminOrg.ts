import type { Request, Response, NextFunction } from "express";
async function authorize(req: Request, res: Response, next: NextFunction) {
    const user = req?.user;
    if(!user) {
        // console.log("No user information found in request");
        return res.status(401).json({ message: "Unauthenticated" });
    }
    // console.log("Authorizing user with role:", user?.Role);
    if(user.Role !== "ADMIN" && user.Role !== "ORGANIZATION" ){
        return res.status(403).json({ message: "Forbidden: Admins and approved organizations only", isAdminOrg: false });
    }
    next();
}
export default authorize;