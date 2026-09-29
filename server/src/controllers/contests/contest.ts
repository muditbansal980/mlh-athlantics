import { Request,Response } from "express";
import {db} from "../../db/kysely/kysely.js";
import { getallcontests } from "../../controllersServices/contests/getallcontests.js";
export async function contestcontroller(req: Request, res: Response) {
    const contests = await getallcontests();
    // console.log("Contests retrieved from database:", contests);
    if(!contests){
        return res.status(404).json({message:"No contests found"});
    }
    return res.json(contests);
}

// getting details of a particular contest by id, this will be used in contest details page
export async function contestdetail(req: Request, res: Response) {
    const {id} = req.params;
    // console.log("Contest ID from request params:", id);
    const contest = await db.selectFrom("Contest").selectAll().where("Id","=",id).executeTakeFirst();
    if(!contest){
        res.status(404).json({message:"Contest not found"});
        return;
    }
    // console.log("Contest details retrieved from database:", contest);
    res.json(contest);
    return ;
}   
export async function contestorganizedbyrespective(req: Request, res: Response) {
    // console.log("Fetching contests organized by respective user:", req.user);
    try{
        const user = req.user;
        if(!user){
            return res.status(401).json({message:"Unauthorized"});
        }
        const contests = await db.selectFrom("Contest").selectAll().where("CreatedById","=",user.Id).execute();
        // console.log("Contests organized by respective user:", contests);
        return res.json(contests);
    }
    catch(err){
        console.error("Error fetching contests organized by respective:", (err as Error).message);
        return res.status(500).json({message:"Internal server error"});
    }
}