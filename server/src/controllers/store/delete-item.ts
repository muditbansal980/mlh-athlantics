import { db } from "../../db/kysely/kysely.js"
import { Request,Response } from "express";
export async function deleteItem(req: Request, res: Response){
    const {id} = req.params;
    try{
        await db.deleteFrom("Store").where("Id","=",id).execute();
        await db.deleteFrom("Cart").where("ItemId","=",id).execute();
        res.status(200).json({message:"Item deleted successfully"})
    }catch(error){
        console.error("Error deleting item:",error);
        res.status(500).json({message:"Internal server error"})
    }
}