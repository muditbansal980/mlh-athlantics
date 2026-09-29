import jwt from "jsonwebtoken";
import "dotenv/config";


const SECRET = process.env.JWT_SECRET;
export interface AuthPayload extends jwt.JwtPayload {
    Id: string;
    Email: string;
    Username: string;
    Role: string;
}

function setUser(Id: string, Email: string, Username: string, Role: string) {
    if (!SECRET) {
        throw new Error("JWT_SECRET is not set");
    }
    // console.log("Setting user with id:", Id, "email:", Email, "username:", Username, "role:", Role);
    return jwt.sign({ Id, Email, Username, Role }, SECRET)
}
function verifyToken(token: string): AuthPayload {
    if (!SECRET) {
        throw new Error("JWT_SECRET is not set");
    }
    const decoded = jwt.verify(token, SECRET);
    if (typeof decoded === "string") {
        throw new Error("Invalid token payload");
    }
    return decoded as AuthPayload;
}

function setUserOrg( Email: string, Username: string, Role: string, Status: string) {
    if (!SECRET) {
        throw new Error("JWT_SECRET is not set");
    }
    // console.log("Setting user with id:", Id, "email:", Email, "username:", Username, "role:", Role);
    return jwt.sign({  Email, Username, Role, Status }, SECRET)
}
export { setUser, verifyToken, setUserOrg };
