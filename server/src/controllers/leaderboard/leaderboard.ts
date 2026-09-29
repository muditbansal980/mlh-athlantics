import { Request, Response } from "express";
import { db } from "../../db/kysely/kysely.js";

export async function getLeaderboard(req: Request, res: Response) {
    // Default to 'ALL' if no category is provided or if it's 'all' / 'AllSports'
    const category = (req.query.category as string) || "AllSports";
    const correctformofcategory = category.toUpperCase();
    
    // console.log("Received request for leaderboard with category:", correctformofcategory);

    try {
        // Base query joining XP and User tables
        let query = db
            .selectFrom("XP")
            .innerJoin("User", "User.Id", "XP.UserId")
            .select([
                "XP.Id as xpId",
                "XP.TotalXP as score",
                "XP.SportsCategory as category",
                "User.Username as username",
                "User.Role as role"
            ])
            // Filter out admin users from showing up on the leaderboard
            .where("User.Role", "!=", "ADMIN") 
            .orderBy("XP.TotalXP", "desc");

        // Apply sports category filter if it's not looking for everything
        if (correctformofcategory !== "ALL" && correctformofcategory !== "ALLSPORTS") {
            // Making sure it matches your DB schema enum casing (e.g., "FOOTBALL")
            query = query.where("XP.SportsCategory", "=", correctformofcategory);
        }

        const leaderboard = await query.execute();

        // Map an explicit rank index to each user before sending it to the frontend
        const rankedLeaderboard = leaderboard.map((entry, index) => ({
            Rank: index + 1,
            ...entry,
        }));

        return res.status(200).json(rankedLeaderboard);

    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}