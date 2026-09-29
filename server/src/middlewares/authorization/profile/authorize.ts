import {Request,Response,NextFunction} from "express";
import { verifyToken } from "../../../service/auth/auth.js";
async function authorize(req:Request,res:Response,next:NextFunction){
    const userUid= req.cookies?.uid;
    const user = verifyToken(userUid);
    const {username} = req.params;
    const lowercaseUsername = (typeof username === 'string' ? username : username[0]).toLowerCase();
    if(user.Username.toLowerCase() !== lowercaseUsername){
        return res.status(403).json({message: "Unauthorized: You do not have permission to access this resource."});
    }
    if(!user){
        return res.status(401).json({message: "Unauthenticated: Please log in to access this resource."});
    }
    next();

}
export default authorize;
