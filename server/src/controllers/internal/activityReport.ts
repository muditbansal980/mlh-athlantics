import type { Request, Response } from "express";
import { db } from "../../db/kysely/kysely.js";
import { saveActivityReport } from "../../llm/main.js";

// Called by the worker once pose analysis is done: generates the LLM report and stores it
export async function generateAndStoreActivityReportController(req: Request, res: Response) {
    const { activityId, userId, analysisSummary, analysisFrames, videoUrl } = req.body ?? {};

    if (!activityId || !userId || !analysisSummary || !Array.isArray(analysisFrames)) {
        return res.status(400).json({
            message: "activityId, userId, analysisSummary, and analysisFrames are required.",
        });
    }

    try {
        const activity = await db
            .selectFrom("Activity")
            .select("Id")
            .where("Id", "=", activityId)
            .where("UserId", "=", userId)
            .executeTakeFirst();
        if (!activity) {
            return res.status(404).json({ message: "Activity not found for this user." });
        }

        const report = await saveActivityReport({
            activityId,
            userId,
            analysisSummary,
            analysisFrames,
            videoUrl,
        });
        return res.status(200).json({ success: true, report });
    } catch (error) {
        console.error("Error generating activity report:", error);
        return res.status(500).json({ message: "Failed to generate activity report." });
    }
}
