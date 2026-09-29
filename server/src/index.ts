import "dotenv/config";
import express, { type Express, type Request, type Response } from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes/apiRoutes.js";
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./config/db.js";

const app: Express = express();
const PORT = Number(process.env.PORT) || 5000;
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser());

// Mount API routes
app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);

// Root informational endpoint
app.get("/", (_req: Request, res: Response) => {
  res.json({
    name: "Hackathon Starter API",
    message: "Official hackathon boilerplate server active. See /api/health for system status.",
    docs: "/api/health",
  });
});

// Health ping — keeps the deployed backend URL alive by hitting it every 10 minutes.
// Only runs when HEALTH_PING_URL is set.
const HEALTH_PING_URL = process.env.HEALTH_PING_URL;
const INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

function scheduleHealthPing(url: string): void {
  const ping = async (): Promise<void> => {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok) {
        console.log(`[health-ping] server responded OK (${res.status})`);
      } else {
        console.warn(`[health-ping] server responded ${res.status}`);
      }
    } catch (err) {
      console.error("[health-ping] failed to ping server:", err);
    }
  };

  ping();
  setInterval(ping, INTERVAL_MS);
}

async function startServer(): Promise<void> {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`[Server] Listening at http://localhost:${PORT}`);
    console.log(`[Server] Health check available at http://localhost:${PORT}/api/health`);
    if (HEALTH_PING_URL) scheduleHealthPing(HEALTH_PING_URL);
  });
}

startServer();
