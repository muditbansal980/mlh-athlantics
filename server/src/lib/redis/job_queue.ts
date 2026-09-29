// Source :- https://github.com/redis/docs/blob/main/content/develop/use-cases/job-queue/nodejs/job_queue.js

"use strict";

import crypto from "crypto";
import type { RedisClientType } from "redis";

/**
 * -----------------------------
 * Types
 * -----------------------------
 */

export type JobStatus =
    | "pending"
    | "processing"
    | "completed"
    | "failed";

export interface JobPayload {
    [key: string]: any;
}

export interface QueueOptions {
    redisClient: RedisClientType;
    queueName?: string;
    visibilityMs?: number;
    completedTtl?: number;
    completedHistory?: number;
    maxAttempts?: number;
}

export interface JobMeta {
    id: string;
    payload: JobPayload;
    status: JobStatus;
    attempts: number;
    enqueued_at_ms: number;
    claimed_at_ms?: number;
    claim_token: string;
    result?: any;
}

/**
 * -----------------------------
 * Claimed Job
 * -----------------------------
 */

export const COMPLETE_SCRIPT = `
local meta_key = KEYS[1] .. ARGV[1]
local current_token = redis.call('HGET', meta_key, 'claim_token')
if current_token ~= ARGV[2] then
  return 0
end
redis.call('LREM', KEYS[2], 1, ARGV[1])
redis.call('HSET', meta_key,
  'status', ARGV[3],
  'completed_at_ms', ARGV[4],
  'result', ARGV[5])
redis.call('EXPIRE', meta_key, ARGV[6])
redis.call('LPUSH', KEYS[3], ARGV[1])
redis.call('LTRIM', KEYS[3], 0, ARGV[7] - 1)
return 1
`;

export const FAIL_SCRIPT = `
local meta_key = KEYS[1] .. ARGV[1]
local current_token = redis.call('HGET', meta_key, 'claim_token')
if current_token ~= ARGV[2] then
  return 0
end
redis.call('LREM', KEYS[2], 1, ARGV[1])
if ARGV[7] == '1' then
  redis.call('HSET', meta_key,
    'status', 'pending',
    'last_error', ARGV[3],
    'last_error_at_ms', ARGV[4],
    'claim_token', '',
    'claimed_at_ms', 0)
  redis.call('LPUSH', KEYS[3], ARGV[1])
  return 1
else
  redis.call('HSET', meta_key,
    'status', 'failed',
    'last_error', ARGV[3],
    'last_error_at_ms', ARGV[4],
    'claim_token', '')
  redis.call('LPUSH', KEYS[4], ARGV[1])
  redis.call('LTRIM', KEYS[4], 0, ARGV[6] - 1)
  redis.call('EXPIRE', meta_key, ARGV[5])
  return 2
end
`;

export const RECLAIM_SCRIPT = `
local now_ms = tonumber(ARGV[1])
local visibility_ms = tonumber(ARGV[2])
local processing = redis.call('LRANGE', KEYS[2], 0, -1)
local reclaimed = {}

for _, job_id in ipairs(processing) do
  local meta_key = KEYS[3] .. job_id
  local claimed_at = tonumber(redis.call('HGET', meta_key, 'claimed_at_ms') or '0')
  local enqueued_at = tonumber(redis.call('HGET', meta_key, 'enqueued_at_ms') or '0')

  local stale = false

  if claimed_at > 0 and (now_ms - claimed_at) > visibility_ms then
    stale = true
  elseif claimed_at == 0 and enqueued_at > 0 and (now_ms - enqueued_at) > (visibility_ms * 2) then
    stale = true
  end

  if stale then
    redis.call('LREM', KEYS[2], 1, job_id)
    redis.call('LPUSH', KEYS[1], job_id)
    redis.call('HSET', meta_key,
      'status', 'pending',
      'reclaimed_at_ms', now_ms,
      'claim_token', '',
      'claimed_at_ms', 0)

    table.insert(reclaimed, job_id)
  end
end

return reclaimed
`;

export class ClaimedJob {
    id: string;
    payload: JobPayload;
    attempts: number;
    claimToken: string;

    constructor(
        id: string,
        payload: JobPayload,
        attempts: number,
        claimToken: string
    ) {
        this.id = id;
        this.payload = payload;
        this.attempts = attempts;
        this.claimToken = claimToken;
    }

    toObject() {
        return {
            id: this.id,
            payload: this.payload,
            attempts: this.attempts,
            claim_token: this.claimToken,
        };
    }
}

/**
 * -----------------------------
 * Redis Job Queue
 * -----------------------------
 */
export  class RedisJobQueue {
    private redis: RedisClientType;
    private queueName: string;
    private visibilityMs: number;
    private completedTtl: number;
    private completedHistory: number;
    private maxAttempts: number;

    private pendingKey: string;
    private processingKey: string;
    private completedKey: string;
    private failedKey: string;
    private metaPrefix: string;
    private eventsChannel: string;

    private _completeSha: string | null = null;
    private _failSha: string | null = null;
    private _reclaimSha: string | null = null;
    private _scriptsLoaded = false;

    constructor({
        redisClient,
        queueName = "jobs",
        visibilityMs = 5000,
        completedTtl = 300,
        completedHistory = 50,
        maxAttempts = 3,
    }: QueueOptions) {
        if (!redisClient) {
            throw new Error("RedisJobQueue requires a redisClient");
        }

        this.redis = redisClient;
        this.queueName = queueName;
        this.visibilityMs = visibilityMs;
        this.completedTtl = completedTtl;
        this.completedHistory = completedHistory;
        this.maxAttempts = maxAttempts;



        this.pendingKey = `queue:${queueName}:pending`;
        this.processingKey = `queue:${queueName}:processing`;
        this.completedKey = `queue:${queueName}:completed`;
        this.failedKey = `queue:${queueName}:failed`;
        this.metaPrefix = `queue:${queueName}:job:`;
        this.eventsChannel = `queue:${queueName}:events`;
    }

    private metaKey(jobId: string): string {
        return `${this.metaPrefix}${jobId}`;
    }

    private static nowMs(): number {
        return Date.now();
    }

    /**
     * -----------------------------
     * Enqueue Job
     * -----------------------------
     */
    private async _ensureScriptsLoaded(): Promise<void> {
        if (this._scriptsLoaded) return;

        this._completeSha = await this.redis.scriptLoad(COMPLETE_SCRIPT);
        this._failSha = await this.redis.scriptLoad(FAIL_SCRIPT);
        this._reclaimSha = await this.redis.scriptLoad(RECLAIM_SCRIPT);

        this._scriptsLoaded = true;
    }
    private async _evalScript(
        script: string,
        sha: string | null,
        options: any
    ) {
        if (sha) {
            try {
                return await this.redis.evalSha(sha, options);
            } catch (err: any) {
                if (!err?.message?.includes("NOSCRIPT")) {
                    throw err;
                }
                this._scriptsLoaded = false;
            }
        }

        return this.redis.eval(script, options);
    }

    async enqueue(payload: JobPayload): Promise<string> {
        await this._ensureScriptsLoaded();
        const jobId = crypto.randomBytes(8).toString("hex");
        const nowMS = RedisJobQueue.nowMs();

        await this.redis.hSet(this.metaKey(jobId), {
            id: jobId,
            payload: JSON.stringify(payload),
            status: "pending",
            attempts: "0",
            enqueued_at_ms: String(nowMS),
            claim_token: "",
        });

        await this.redis.lPush(this.pendingKey, jobId);

        return jobId;
    }

    /**
     * -----------------------------
     * Claim Job (Worker)
     * -----------------------------
     */
    async claim(timeoutMs = 1000): Promise<ClaimedJob | null> {
        const timeoutS = Math.max(timeoutMs / 1000, 0.1);

        const jobId = await this.redis.blMove(
            this.pendingKey,
            this.processingKey,
            "RIGHT",
            "LEFT",
            timeoutS
        );

        if (!jobId) return null;

        const token = crypto.randomBytes(8).toString("hex");
        const now = RedisJobQueue.nowMs();
        const metaKey = this.metaKey(jobId);

        await this.redis.hSet(metaKey, {
            status: "processing",
            claimed_at_ms: String(now),
            claim_token: token,
        });

        await this.redis.hIncrBy(metaKey, "attempts", 1);

        const meta = await this.redis.hGetAll(metaKey);

        let payload: JobPayload = {};
        try {
            payload = JSON.parse(meta.payload || "{}");
        } catch {
            payload = {};
        }

        const attempts = Number(meta.attempts || 1);

        return new ClaimedJob(jobId, payload, attempts, token);
    }

    /**
     * -----------------------------
     * Complete Job
     * -----------------------------
     */
    async complete(job: ClaimedJob, result: JobPayload): Promise<boolean> {
        const metaKey = this.metaKey(job.id);

        const currentToken = await this.redis.hGet(metaKey, "claim_token");

        if (currentToken !== job.claimToken) return false;

        await this.redis.lRem(this.processingKey, 1, job.id);

        await this.redis.hSet(metaKey, {
            status: "completed",
            completed_at_ms: String(RedisJobQueue.nowMs()),
            result: JSON.stringify(result),
        });

        await this.redis.lPush(this.completedKey, job.id);

        await this.redis.publish(
            this.eventsChannel,
            JSON.stringify({ id: job.id, status: "completed" })
        );

        return true;
    }

    /**
     * -----------------------------
     * Fail Job
     * -----------------------------
     */
    async fail(job: ClaimedJob, error: string): Promise<boolean> {
        const metaKey = this.metaKey(job.id);

        const currentToken = await this.redis.hGet(metaKey, "claim_token");
        if (currentToken !== job.claimToken) return false;

        const retry = job.attempts < this.maxAttempts;

        await this.redis.lRem(this.processingKey, 1, job.id);

        if (retry) {
            await this.redis.hSet(metaKey, {
                status: "pending",
                last_error: error,
                claim_token: "",
                claimed_at_ms: "0",
            });

            await this.redis.lPush(this.pendingKey, job.id);
        } else {
            await this.redis.hSet(metaKey, {
                status: "failed",
                last_error: error,
                claim_token: "",
            });

            await this.redis.lPush(this.failedKey, job.id);
        }

        await this.redis.publish(
            this.eventsChannel,
            JSON.stringify({
                id: job.id,
                status: retry ? "retry" : "failed",
            })
        );

        return true;
    }
}