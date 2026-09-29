import { db } from "../../db/kysely/kysely.js";
import { Request, Response } from "express";
export async function streakcontroller(req: Request, res: Response) {
    const user = req.user
    let currentstreak;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    // console.log("User data from request:", user);
    const userId = user.Id;
    // console.log("Fetching streak data for user:", userId);
    try {
        const streak = await db.selectFrom("Streak").selectAll().where("CreatedBy", "=", userId).executeTakeFirst();
        if (streak) {
            if(streak.LastUploadDate === null){
                currentstreak = 0 ;
                return res.json({ Streak: { ...streak, CurrentStreak: currentstreak } });
            }
            if((((new Date().getTime())-streak?.LastUploadDate!.getTime())>86400000)){
                 currentstreak = 0 ;
                 return res.json({ Streak: { ...streak, CurrentStreak: currentstreak } });
            }
            return res.json({ Streak: streak });
        } else {
            await db.insertInto("Streak").values({
                Id: crypto.randomUUID(),
                CreatedBy: userId,
                CurrentStreak: 0,
                LongestStreak: 0,
            }).executeTakeFirst();
            return res.json({
                Streak: {
                    Id: null,
                    CreatedBy: userId,
                    CurrentStreak: 0,
                    LongestStreak: 0,
                }
            });
        }
    }
    catch (error) {
        console.error("Error fetching streak data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}