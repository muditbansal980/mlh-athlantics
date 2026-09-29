import type { Request, Response, NextFunction } from "express";

function authorize(...allowedRoles: string[]) {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const user = req.user;
        // console.log("Request for updating is reached till authorization middleware ");
        if (!user) {
            return res.status(401).json({
                message: "Unauthenticated"
            });
        }

        if (!allowedRoles.includes(user.Role)) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
        // console.log("Authorization successful for user with role:");
        next();

    };
}

export default authorize;