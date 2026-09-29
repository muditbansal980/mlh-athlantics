import { db } from "../../db/kysely/kysely.js";
import { Request, Response } from "express";
import cloudinary from "../../config/clodinary.js";
import streamifier from "streamifier";
import RedisQueue from "../../lib/redis/redis.js"
export async function activityvideocontroller(req: Request, res: Response) {
    const user = req.user
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const userId = user.Id;
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No video uploaded" })
        }
        const result: any = await new Promise(
            (resolve, reject) => {

                const stream =
                    cloudinary.uploader.upload_stream(
                        {
                            type: "authenticated",
                            resource_type: "video",
                            folder: "activity-videos",
                        },
                        (error, result) => {

                            if (error) {

                                reject(error);

                            } else {

                                resolve(result);
                            }
                        }
                    );

                streamifier
                    .createReadStream(req.file!.buffer)
                    .pipe(stream);
            }

        );
        // console.log("Video uploaded to Cloudinary:", result);
        const ActivityId = crypto.randomUUID()
        await RedisQueue(result.secure_url, userId, ActivityId);
        await db.insertInto("Activity").values({
            Id: ActivityId,
            VideoUrl: result.secure_url,
            PublicId: result.public_id,
            Duration: result.duration,
            View: "PRIVATE",
            UserId: userId,
            CreatedAt: new Date(),
        }).execute();
        await db.insertInto("ActivityReport").values({
            Id: crypto.randomUUID(),
            ActivityId,
            UserId: userId,
            Status: "PENDING",
            AnalysisJson: {
                summary: null,
                frames: [],
                videoUrl: result.secure_url,
            },
            ReportJson: {
                title: "Report is being generated",
                overview: "The activity analysis is still in progress.",
                strengths: [],
                improvements: [],
                keyMetrics: {},
                frameInsights: [],
                overallScore: 0,
                recommendations: [],
                description: "",
            },
            SummaryText: "Report is being generated.",
            CreatedAt: new Date(),
        }).execute();
        // console.log("✅ Activity analysis job queued for:", ActivityId);
        const streak = await db.selectFrom("Streak").selectAll().where("CreatedBy", "=", userId).executeTakeFirst();
        // console.log("Current streak data:", streak);
        if (streak) {
            // console.log("Last upload date:", streak.LastUploadDate);
            if (streak.LastUploadDate) {
                const LastUploadDate = new Date(streak.LastUploadDate);
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                LastUploadDate.setHours(0, 0, 0, 0);
                const diffTime = currentDate.getTime() - LastUploadDate.getTime(); // in milliseconds
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                // console.log("Difference in days since last upload:", diffDays);
                if (diffDays === 0) {
                    // console.log("Video uploaded on the same day as the last upload, no change in streak");
                    return res.status(200).json({
                        message: "No change in streak"
                    });
                }
                else if (diffDays === 1) {
                    // console.log("Streak continues with a new upload within 1 day of the last upload");
                    const newStreak = streak.CurrentStreak + 1
                    const newLongest = newStreak > (streak?.LongestStreak || 0)
                        ? newStreak
                        : streak.LongestStreak

                    await db.updateTable("Streak").set({
                        CurrentStreak: newStreak,
                        LongestStreak: newLongest,
                        LastUploadDate: new Date(),
                    }).where("Id", "=", streak.Id).execute();
                }
                else {
                    // console.log("Streak reset to 1 since last upload was more than 1 day ago or last upload date is missing");
                    await db.updateTable("Streak").set({
                        CurrentStreak: 1,
                        LastUploadDate: new Date(),
                    }).where("Id", "=", streak.Id).execute();

                }
                if (streak.CurrentStreak + 1 > (streak?.LongestStreak || 0)) {
                    await db.updateTable("Streak").set({
                        LongestStreak: streak.CurrentStreak + 1,
                    }).where("Id", "=", streak.Id).execute();
                }
            }
            if (!streak.LastUploadDate) {
                // console.log("Last upload date is missing, setting current streak to 1 and updating last upload date");
                await db.updateTable("Streak").set({
                    CurrentStreak: 1,
                    LastUploadDate: new Date(),
                }).where("Id", "=", streak.Id).execute();
            }
        } else {
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(200).json({
            message: "Uploaded successfully",
            videoUrl: result.secure_url,
        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Upload failed",
        });
    }
}


export async function getactivitydata(req: Request, res: Response) {
    const user = req.user
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const userId = user.Id;
    try {
        const activities = await db.selectFrom("Activity").selectAll().orderBy("CreatedAt", "desc").where("UserId", "=", userId).execute();
        return res.status(200).json({
            "Activities": activities,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch activity data",
        });
    }
}

export async function updateview(req: Request, res: Response) {
    const user = req.user
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const { activityId, view } = req.body;
    try {
        await db.updateTable("Activity").set({
            View: view,
        }).where("Id", "=", activityId).execute();
        return res.status(200).json({
            message: "Activity view updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to update activity view",
        });
    }
}

export async function activityeditcontroller(req: Request, res: Response) {
    const user = req.user
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const userId = user.Id;
    const { activityId } = req.params;
    const { Title, Description } = req.body;
    try {
        // console.log("Updating activity with ID:", activityId, "for user ID:", userId);
        await db.updateTable("Activity").set({
            Title: Title,
            Description: Description,
        }).where("Id", "=", activityId).where("UserId", "=", userId).execute();
        // console.log("Activity updated successfully for activity ID:", activityId);
        return res.status(200).json({
            message: "Activity updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to update activity",
        });
    }
}