import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

// Only lets trusted services (the worker) call /api/internal routes.
// The worker must send the shared INTERNAL_API_KEY in the "x-internal-key" header.
export default function internalAuth(req: Request, res: Response, next: NextFunction) {
    const expected = process.env.INTERNAL_API_KEY;
    if (!expected) {
        console.error("[internal] INTERNAL_API_KEY is not set; rejecting internal request");
        return res.status(503).json({ message: "Internal API is not configured" });
    }

    const provided = req.get("x-internal-key") ?? "";
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}
