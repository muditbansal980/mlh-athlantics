import { Router } from "express";
import { db } from "../../db/kysely/kysely.js"
// import {updateUserRole} from "../../controllers/user/updateRole.js";
const router: Router = Router();

router.get("/", (req, res) => {
    const userId = req.user?.Id;
    // console.log("Fetching user data for user ID:", userId);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    db.selectFrom("User").select(["Id","Username","Role","AccessibleRoles"]).where("Id", "=", userId).execute()
        .then((userdata) => {   
            if (userdata.length === 0) return res.status(404).json({ error: "User not found" });
            // console.log("User data retrieved from database:", userdata[0]);
            return res.json({ User: userdata[0] });
        })
        .catch((err) => {
            console.error("Error fetching user data:", err);
            return res.status(500).json({ error: "Internal server error" });
        });
});

// router.patch("/updateRole", updateUserRole);

export default router;