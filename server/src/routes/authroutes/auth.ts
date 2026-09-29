import { Router } from "express";
const router: Router = Router();
import logincontroller from "../../controllers/auth/players/login.js";
import registercontroller from "../../controllers/auth/players/register.js";
import authMiddleware from "../../middleware/authentication/auth.js";
import authorize from "../../middleware/generalauthorization/authorization.js";
// TODO: these files don't exist yet — re-enable once they are added
// import googleauthcontroller from "../../controllers/auth/googleauth.js"
// import googlecallbackcontroller from "../../controllers/auth/googlecallback.js"
// import AdminOwnerAuthorization from "../../middleware/authorization/store/AdminOwner.js";
router.post("/login", logincontroller);
router.post("/register", registercontroller);
// router.get("/google",googleauthcontroller);
// router.get("/google/callback", googlecallbackcontroller);
router.post("/logout", (req, res) => {
    res.clearCookie('uid'); // Clear the 'uid' cookie
      res.status(200).json({ message: 'Logout successful' });
})

// checking user authorization for visiting that page
router.get("/check-admin-org",authMiddleware,authorize("ADMIN", "ORGANIZATION"), (req, res) => {
    // console.log("Authorization check for admin/org page");
    // console.log("User ID from request:", req?.Role); // Log the user ID
    // If the middleware passes, it means the user is either an admin or belongs to an organization
    res.json({ isAdminOrg: true });
});

// router.get("/admin-owner-check/:ownerId",authMiddleware,AdminOwnerAuthorization, (req, res) => {
//     try{
//         res.json({ allowed: true });
//     }
//     catch(err){
//         res.status(500).json({ allowed: false });
//     }
// });


export default router;