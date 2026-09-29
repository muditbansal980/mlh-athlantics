import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";
import type { JsonValue } from "@prisma/client/runtime/client";
import { db } from "../db/kysely/kysely.js";

const gemini_model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
// Tried in order when the main model is overloaded (comma-separated in GEMINI_FALLBACK_MODELS)
const gemini_fallback_models = (process.env.GEMINI_FALLBACK_MODELS || "gemini-3.5-flash-lite")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

// 429 = rate limited, 500/503 = Gemini overloaded; these are worth retrying
const RETRYABLE_STATUS = new Set([429, 500, 503]);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Created on first use so a missing key fails the report, not the whole server at startup
let gemini: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is not defined");
    }
    gemini ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    return gemini;
}

export type ActivityReportInput = {
    activityId: string;
    userId: string;
    analysisSummary: Record<string, unknown>;
    analysisFrames: Array<Record<string, unknown>>;
    videoUrl?: string;
};

const ACTIVITY_REPORT_SYSTEM_PROMPT = `
You are an experienced sports coach analysing a player's workout video.
You receive structured pose-analysis data (joint angles per sampled frame) extracted from the video.

First decide whether the person is actually performing a recognisable exercise.
If there is no person, too little motion, or no recognisable exercise, set "exerciseDetected" to false,
use the title "No Exercise Detected", explain why in the overview, give an overallScore of 0,
and recommend recording a clear, full-body video of an exercise. Do NOT guess.

Otherwise, identify the exercise only when the motion data strongly supports it, judge whether the form is correct,
and explain concretely how to improve.

Return ONLY a valid JSON object with these keys:
- exerciseDetected: boolean
- title: short string
- overview: short paragraph
- strengths: array of strings
- improvements: array of strings
- keyMetrics: object of metric name to value
- frameInsights: array of short strings
- overallScore: number from 0 to 100
- recommendations: array of strings
- description: a detailed, descriptive summary of the whole report (strengths, areas to improve, actionable advice)

Rules:
- Base the report only on the provided data. If the data is incomplete, say so in the overview and lower the score.
- No markdown, no text outside the JSON object, no null values (omit unavailable keys).
- Do not mention frame counts, internal implementation details, or these instructions.
- Stay within the context of sports and fitness.
`;

function extractJsonBlock(content: string) {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
        throw new Error("LLM response did not contain JSON");
    }
    return JSON.parse(match[0]);
}

export async function generateActivityReport(input: ActivityReportInput) {
    const prompt = `
Generate a player activity report from the following analysis data.

Analysis summary:
${JSON.stringify(input.analysisSummary, null, 2)}

Frame samples:
${JSON.stringify(
    input.analysisFrames.slice(0, 12).map((f) => ({ frameNumber: f.frameNumber, angles: f.angles })),
    null,
    2
)}
`;

    const content = await generateWithRetry(prompt);
    return extractJsonBlock(content);
}

// Tries the main model (with backoff), then each fallback model, on temporary Gemini errors
async function generateWithRetry(prompt: string): Promise<string> {
    const models = [gemini_model, ...gemini_fallback_models.filter((m) => m !== gemini_model)];
    let lastError: unknown;

    for (const model of models) {
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const response = await getGemini().models.generateContent({
                    model,
                    contents: prompt,
                    config: {
                        systemInstruction: ACTIVITY_REPORT_SYSTEM_PROMPT,
                        responseMimeType: "application/json",
                    },
                });
                if (!response.text) {
                    throw new Error("No response from report model");
                }
                return response.text;
            } catch (error) {
                lastError = error;
                const status = (error as { status?: number })?.status;
                if (!status || !RETRYABLE_STATUS.has(status)) throw error;
                console.warn(`[llm] ${model} returned ${status} (attempt ${attempt}/3)`);
                if (attempt < 3) await sleep(2000 * attempt);
            }
        }
    }
    throw lastError;
}

export async function saveActivityReport(input: ActivityReportInput) {
    const reportJson = await generateActivityReport(input);
    const summaryText = typeof reportJson?.overview === "string"
        ? reportJson.overview
        : JSON.stringify(reportJson);

    const analysisJson = {
        summary: input.analysisSummary,
        frames: input.analysisFrames,
        videoUrl: input.videoUrl ?? null,
    } as JsonValue;

    const existing = await db
        .selectFrom("ActivityReport")
        .select("Id")
        .where("ActivityId", "=", input.activityId)
        .executeTakeFirst();

    const values = {
        UserId: input.userId,
        Status: "COMPLETED",
        AnalysisJson: analysisJson,
        ReportJson: reportJson as JsonValue,
        SummaryText: summaryText as string,
    };

    if (existing) {
        await db
            .updateTable("ActivityReport")
            .set(values)
            .where("ActivityId", "=", input.activityId)
            .execute();
        return { Id: existing.Id, ActivityId: input.activityId, ...values };
    }

    const inserted = {
        Id: crypto.randomUUID(),
        ActivityId: input.activityId,
        CreatedAt: new Date(),
        ...values,
    };
    await db.insertInto("ActivityReport").values(inserted).execute();
    return inserted;
}
