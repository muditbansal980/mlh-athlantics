import {db} from "../../db/kysely/kysely.js"
import { Request, Response } from "express";

export async function getAllItems(req: Request, res: Response) {
    try {
        const items = await db.selectFrom("Store").selectAll().execute();
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}