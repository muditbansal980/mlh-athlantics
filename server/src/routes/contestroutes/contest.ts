import { Router } from "express";
const router: Router = Router();
import addcontestcontroller from "../../controllers/contests/addcontest.js";
import { contestcontroller,contestdetail,contestorganizedbyrespective } from "../../controllers/contests/contest.js";
import {updateContest} from "../../controllers/contests/crudoncontests/crud.js";
import authorize from "../../middlewares/authorization/AdminOrg.js";
import authorizeOwnerAdmin from "../../middlewares/authorization/store/AdminOwner.js";
import generalAuthorize from "../../middlewares/authorization/generalauthorization/authorization.js";
import getRegistrationsForContest from "../../controllers/contests/getregistrationsforcontest.js";
import {registerforContest} from "../../controllers/contests/registerforcontest.js";
import { get } from "node:http";
router.post("/add", authorize, addcontestcontroller);
router.get("/getall", contestcontroller);
router.get("/:id", contestdetail);
router.get("/get/organizedbyrespective", authorizeOwnerAdmin,contestorganizedbyrespective);
// crud operations for contests can be added here (update, delete, etc.) with appropriate authorization middlewares
router.patch("/update/:ContestId", generalAuthorize("ADMIN", "ORGANIZATION"), updateContest);

router.post("/register/:ContestId",registerforContest);

router.get("/registrations/:ContestId", generalAuthorize("ADMIN", "ORGANIZATION"), getRegistrationsForContest);
export default router;