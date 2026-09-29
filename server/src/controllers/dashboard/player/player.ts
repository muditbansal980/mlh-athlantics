import { db } from "../../../db/kysely/kysely.js";
import { Request, Response } from "express";

export async function dashboardDataController(req: Request, res: Response) {
    const userId = req.user?.Id; // Assuming you have user authentication and the user ID is available in the request object
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized. User ID not found." });
    }
    try {
        
        const Activities = await db.selectFrom("Activity").select(["Id","UserId","Category","Activity.CreatedAt"]).where("UserId", "=", userId).execute();
        // const Contests = await db.selectFrom("Contest").selectAll().execute();
        const Streak = await db.selectFrom("Streak").selectAll().where("CreatedBy", "=", userId).execute();
        const UserTask = await db.selectFrom("UserTask").select(["Id","UserId","TaskStatus","SubmissionStatus"]).where("UserId", "=", userId).execute();
        const Profile = await db.selectFrom("Profile").select(["Id","GlobalRank","Location","TotalActivities","TotalContestsParticipated","TotalContestsWon","TotalPoints","TotalXP"]).where("UserId", "=", userId).execute();
        return res.json({
            Activities: Activities,
            // Contests: Contests,
            UserTasks: UserTask,
            Profile: Profile,
            Streak: Streak
        });
    } catch (err) {
        console.error("Error fetching dashboard data:", (err as Error).message);
        return res.status(500).json({ message: `Could not fetch dashboard data. Please try again. Error: ${(err as Error).message}` });
    }
}

export async function getPlayerActivityReportController(req: Request, res: Response) {
    const userId = req.user?.Id;
    const { activityId } = req.params;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized. User ID not found." });
    }

    if (!activityId) {
        return res.status(400).json({ message: "Activity ID is required." });
    }

    try {
        const report = await db
            .selectFrom("ActivityReport")
            .innerJoin("Activity", "Activity.Id", "ActivityReport.ActivityId")
            .select([
                "ActivityReport.Id",
                "ActivityReport.ActivityId",
                "ActivityReport.UserId",
                "ActivityReport.Status",
                "ActivityReport.AnalysisJson",
                "ActivityReport.ReportJson",
                "ActivityReport.SummaryText",
                "ActivityReport.CreatedAt",
                "ActivityReport.UpdatedAt",
                "Activity.VideoUrl",
                "Activity.View",
                "Activity.Duration",
                "Activity.Title",
                "Activity.Description",
                "Activity.CreatedAt as ActivityCreatedAt",
            ])
            .where("ActivityReport.ActivityId", "=", activityId)
            .where("ActivityReport.UserId", "=", userId)
            .executeTakeFirst();

        if (!report) {
            return res.status(404).json({ message: "Report not found." });
        }

        return res.json({
            success: true,
            report,
        });
    } catch (err) {
        console.error("Error fetching activity report:", (err as Error).message);
        return res.status(500).json({
            message: `Could not fetch activity report. Please try again. Error: ${(err as Error).message}`,
        });
    }
}