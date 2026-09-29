import { createClient } from "redis";
import { RedisJobQueue } from "./job_queue.js";

const REDIS_URL = process.env.REDIS_URL

export default async function main(cloudinaryUrl: string, userId: string, activityId: string) {
    const client = createClient({ url: REDIS_URL });
    try {
        await client
        .connect()
        .then(()=>{// console.log("Connection with redis successful")});
        const queue = new RedisJobQueue({ redisClient: client, visibilityMs: 5000 });
        await queue.enqueue({
            type: "video_analysis",
            videoUrl: cloudinaryUrl,
            userId: userId,
            activityId: activityId,
        });
        
    }
    catch (error) {
        // console.log("Not able to establish connection");
        return
    }
}

