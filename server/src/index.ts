import "dotenv/config";
import express, { type Express } from "express";
import http from "http";
import cors from "cors";
import router from "./routes/routes.js";
import cookieParser from "cookie-parser";



const app: Express = express();
const PORT = process.env.PORT;
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use("/", router);

// Health ping — keeps the backend URL alive by hitting it every 10 minutes
const HEALTH_PING_URL = "https://api.athlantics.dpdns.org";
const INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

function scheduleHealthPing() {
  const ping = async () => {
    try {
      const res = await fetch(HEALTH_PING_URL, { method: "GET" });
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

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  scheduleHealthPing();
});

// tools
