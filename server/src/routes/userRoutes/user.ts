import {Router} from "express";
const router :Router = Router();
import getallUsers from "../../controllers/admin/users/users.js"
import RoleUpdate from "../../controllers/admin/users/roleupdate.js"
router.get("/all",getallUsers);
router.patch("/update/role/:id",RoleUpdate);
export default router;