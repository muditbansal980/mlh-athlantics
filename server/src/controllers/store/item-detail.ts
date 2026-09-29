import {db} from "../../db/kysely/kysely.js"
import { Request, Response } from "express";
export async function getItemDetails(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const item = await db.selectFrom("Store").selectAll().where("Id", "=", id).executeTakeFirst();
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json(item);
    } catch (error) {
        console.error("Error fetching item details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getSelfItems(req: Request, res: Response) {
    const { ownerid } = req.params;
    try {
        const items = await db.selectFrom("Store").selectAll().where("CreatedBy", "=", ownerid).execute();
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching user's items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}