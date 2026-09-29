import { authorizeContestUpdate } from "../../../services/contest/authorization/auth.js";
import {db} from "../../../db/kysely/kysely.js";
import { Request, Response } from "express";
type ContestParams = {
    ContestId: string;
};
export async function updateContest(req:Request<ContestParams>,res:Response){
    const {ContestId} = req.params; // assuming contest ID is passed as a URL parameter
    const user = req.user; // assuming user is attached to the request object
    if (!user) {
        return res.status(401).json({ message: "Unauthenticated" });
    }
    try{
        await authorizeContestUpdate(ContestId, user);
        // console.log("Got data for contest update:", req.body);
        // If authorization is successful, proceed with the update logic
        const data = req.body; // assuming the updated contest data is sent in the request body
        await db.updateTable("Contest").set(data).where("Id","=",ContestId).execute();
        return res.json({ message: "Contest updated successfully" });
    } catch (error) {
        return res.status(403).json({ message: (error as Error).message });
    }
}