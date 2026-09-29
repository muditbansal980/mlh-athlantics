import { Router } from "express";
const router: Router = Router();
// import { runAgent } from "../../llm/main.js";
router.post("/agent",async (req, res) => {
    try {
        return res.status(200).json({ message: "Agent route is under progress" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
export default router;
