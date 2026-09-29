import { Router } from "express";
import { dashboardDataController, getPlayerActivityReportController } from "../../../controllers/dashboard/player/player.js";

const router: Router = Router();

router.get("/dashboard/player", dashboardDataController);
router.get("/dashboard/player/report/:activityId", getPlayerActivityReportController);

export default router;
