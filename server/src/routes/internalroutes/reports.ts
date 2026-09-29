import { Router } from "express";
import { generateAndStoreActivityReportController } from "../../controllers/internal/activityReport.js";

const router: Router = Router();

router.post("/reports/activity", generateAndStoreActivityReportController);

export default router;
