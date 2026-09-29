import { createClient } from "redis";
import { RedisJobQueue } from "./redis/job_queue.ts";
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getBodyParts } from "./helper.ts";
import http from "http";

const execAsync = promisify(exec);

const REDIS_URL = process.env.REDIS_URL;
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:5001";
const POSE_SERVICE_URL = process.env.POSE_SERVICE_URL || "http://pose-service:8000";
// Frames are written here and read by pose-service, so both must see the same folder
const SHARED_DIR = process.env.SHARED_DIR || "/shared/videos";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "";
// How long a claimed job stays invisible to other workers before it is reclaimed
const JOB_VISIBILITY_MS = Number(process.env.JOB_VISIBILITY_MS) || 10 * 60 * 1000;
// dummy HTTP server just to satisfy Render's port requirement
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("worker alive");
}).listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Dummy health-check server listening on port ${PORT}`);
});



// Create temp directory for job
function createJobTempDir(jobId: string): string {
    const tempDir = path.join(SHARED_DIR, jobId);
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    return tempDir;
}

function calculateAngle(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) {
    const ab = {
        x: a.x - b.x,
        y: a.y - b.y,
    };

    const cb = {
        x: c.x - b.x,
        y: c.y - b.y,
    };

    const dot =
        ab.x * cb.x +
        ab.y * cb.y;

    const magAB = Math.sqrt(
        ab.x * ab.x +
        ab.y * ab.y
    );

    const magCB = Math.sqrt(
        cb.x * cb.x +
        cb.y * cb.y
    );

    const angle =
        Math.acos(
            dot / (magAB * magCB)
        );

    return angle * 180 / Math.PI;
}

type AngleKey =
    | "leftElbow"
    | "rightElbow"
    | "leftShoulder"
    | "rightShoulder"
    | "leftHip"
    | "rightHip"
    | "leftKnee"
    | "rightKnee";

function buildAnalysisSummary(analysisFrames: Array<{ frameNumber: number; angles: Record<AngleKey, number> }>, totalFrames: number) {
    const allAngles: Record<AngleKey, number[]> = {
        leftElbow: [],
        rightElbow: [],
        leftShoulder: [],
        rightShoulder: [],
        leftHip: [],
        rightHip: [],
        leftKnee: [],
        rightKnee: [],
    };

    for (const frame of analysisFrames) {
        for (const key of Object.keys(allAngles) as AngleKey[]) {
            const angle = frame.angles?.[key];
            if (typeof angle === "number" && Number.isFinite(angle)) {
                allAngles[key].push(angle);
            }
        }
    }

    const averageAngles = Object.fromEntries(
        (Object.keys(allAngles) as AngleKey[]).map((key) => {
            const values = allAngles[key];
            const average = values.length
                ? values.reduce((sum, value) => sum + value, 0) / values.length
                : null;

            return [key, average];
        })
    );

    const minAngles = Object.fromEntries(
        (Object.keys(allAngles) as AngleKey[]).map((key) => {
            const values = allAngles[key];
            return [key, values.length ? Math.min(...values) : null];
        })
    );

    const maxAngles = Object.fromEntries(
        (Object.keys(allAngles) as AngleKey[]).map((key) => {
            const values = allAngles[key];
            return [key, values.length ? Math.max(...values) : null];
        })
    );


    return {
        totalFrames,
        detectedFrames: analysisFrames.length,
        missingFrames: Math.max(totalFrames - analysisFrames.length, 0),
        detectionRate: totalFrames > 0 ? analysisFrames.length / totalFrames : 0,
        averageAngles,
        minAngles,
        maxAngles,
    };
}

async function storeGeneratedReport(payload: {
    activityId: string;
    userId: string;
    analysisSummary: Record<string, unknown>;
    analysisFrames: Array<Record<string, unknown>>;
    videoUrl?: string;
}) {
    const response = await axios.post(
        `${BACKEND_URL}/api/internal/reports/activity`,
        payload,
        {
            headers: {
                "Content-Type": "application/json",
                "x-internal-key": INTERNAL_API_KEY,
            },
            timeout: 300000,
        }
    );
    // console.log("✅ Report stored:", response.data);
    // console.log("✅ Report stored:", response.data?.report?.Id ?? payload.activityId);
}

async function waitForPoseService() {
    while (true) {
        try {
            const response = await axios.get(
                `${POSE_SERVICE_URL}/health`
            );

            // console.log("✅ Pose service ready");
            // console.log(response.data);

            return;
        } catch (err) {
            // console.log("⏳ Waiting for pose service...");
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
}
// Download video from URL
async function downloadVideo(videoUrl: string, jobId: string): Promise<string> {
    // console.log("Downloading video")
    const tempDir = createJobTempDir(jobId);
    const videoPath = path.join(tempDir, 'video.mp4');

    // console.log(`📥 Downloading video to: ${videoPath}`);

    const response = await axios({
        url: videoUrl,
        method: 'GET',
        responseType: 'stream',
        timeout: 300000, // 5 minutes timeout
    });

    const writer = fs.createWriteStream(videoPath);
    response.data.pipe(writer);
    // console.log("Downloaded video path:-", videoPath)
    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            // console.log(`✅ Video downloaded: ${videoPath}`);
            resolve(videoPath);
        });
        writer.on('error', reject);
    });

}

// Extract frames using FFmpeg
async function extractFrames(videoPath: string, jobId: string): Promise<string[]> {
    // console.log("Extracting frames")
    const tempDir = createJobTempDir(jobId);
    const outputPattern = path.join(tempDir, 'frame_%03d.png');

    // console.log(`🎬 Extracting frames from: ${videoPath}`);

    await execAsync(
        `ffmpeg -i "${videoPath}" -vf "fps=1" -qscale:v 2 "${outputPattern}"`
    );

    // Get list of frame files
    const frames = fs.readdirSync(tempDir)
        .filter(f => f.startsWith('frame_') && f.endsWith('.png'))
        .map(f => path.join(tempDir, f));

    // console.log(`✨ Extracted ${frames.length} frames`);
    return frames;
}

// Cleanup temp files
async function cleanupTempDir(jobId: string): Promise<void> {

    const tempDir = path.join(SHARED_DIR, jobId);
    try {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
            // console.log(`🗑️ Cleaned up temp dir: ${tempDir}`);
        }
    } catch (err) {
        console.error(`❌ Cleanup error:`, err);
    }
}

export async function worker() {
    await waitForPoseService();
    const response = await axios.get(
        `${POSE_SERVICE_URL}/health`
    );

    // console.log("Response from pose service:", response.data);
    const client = createClient({ url: REDIS_URL });

    client.on("error", (err) => {
        console.error("Redis error from worker:", err);
    });

    await client.connect();
    // console.log("✅ Redis connected");

    const queue = new RedisJobQueue({
        redisClient: client,
        visibilityMs: JOB_VISIBILITY_MS,
    });

    // console.log("🚀 Worker started... waiting for jobs");

    while (true) {
        try {
            const job = await queue.claim(2000);

            if (!job) continue;

            // console.log("📦 Job received:", job.id);

            const { videoUrl, userId, activityId } = job.payload;
            // console.log("🎥 Processing video:", videoUrl);

            let videoPath = '';
            let frames: string[] = [];

            try {
                // Step 1: Download video
                videoPath = await downloadVideo(videoUrl, job.id);

                // Step 2: Extract frames
                frames = await extractFrames(videoPath, job.id);
                // console.log("Frames:-", frames)
                const response = await axios.post(
                    `${POSE_SERVICE_URL}/detect-pose-batch`,
                    null,
                    {
                        params: {
                            frames_dir: path.join(SHARED_DIR, job.id)
                        }
                    }
                );
                const poseData = response.data;
                const analysisFrames: Array<{
                    frameNumber: number;
                    body: Record<string, unknown>;
                    angles: Record<AngleKey, number>;
                }> = [];

                for (const frame of poseData.pose_data) {

                    if (!frame.landmarks?.length) {
                        continue;
                    }

                    const body = getBodyParts(frame.landmarks);

                    const angles = {
                        leftElbow: calculateAngle(
                            body.leftShoulder,
                            body.leftElbow,
                            body.leftWrist
                        ),

                        rightElbow: calculateAngle(
                            body.rightShoulder,
                            body.rightElbow,
                            body.rightWrist
                        ),

                        leftShoulder: calculateAngle(
                            body.leftElbow,
                            body.leftShoulder,
                            body.leftHip
                        ),

                        rightShoulder: calculateAngle(
                            body.rightElbow,
                            body.rightShoulder,
                            body.rightHip
                        ),

                        leftHip: calculateAngle(
                            body.leftShoulder,
                            body.leftHip,
                            body.leftKnee
                        ),

                        rightHip: calculateAngle(
                            body.rightShoulder,
                            body.rightHip,
                            body.rightKnee
                        ),

                        leftKnee: calculateAngle(
                            body.leftHip,
                            body.leftKnee,
                            body.leftAnkle
                        ),

                        rightKnee: calculateAngle(
                            body.rightHip,
                            body.rightKnee,
                            body.rightAnkle
                        )
                    };

                    analysisFrames.push({
                        frameNumber: frame.frame_number,
                        body,
                        angles
                    });

                    console.log(
                        `Frame ${frame.frame_number}`,
                        body,
                        angles
                    );
                }
                const analysisSummary = buildAnalysisSummary(analysisFrames, poseData.total_frames ?? frames.length);

                await storeGeneratedReport({
                    activityId,
                    userId,
                    analysisSummary,
                    analysisFrames,
                    videoUrl,
                });
                await queue.complete(job, { activityId });
                console.log("✅ Job completed:", job.id);
            } catch (err) {
                console.error("❌ Job processing error:", err);
                // Puts the job back for a retry, or marks it failed after maxAttempts
                await queue.fail(job, err instanceof Error ? err.message : String(err));
            } finally {
                // Step 6: Cleanup (delete temp files)
                await cleanupTempDir(job.id);
            }
        } catch (err) {
            console.error("❌ Worker error:", err);
        }
    }
}

worker().catch(console.error);