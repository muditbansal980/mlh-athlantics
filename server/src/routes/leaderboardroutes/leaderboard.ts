import { Router } from "express";
const router: Router = Router();
import { getLeaderboard } from "../../controllers/leaderboard/leaderboard.js";
router.get("/getLeaderboard", getLeaderboard);
export default router;