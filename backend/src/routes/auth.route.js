import express from "express";
import { protectAdminRoute } from "../middleware/auth.middleware.js";
import { getAllInquiries } from "../controllers/getInquiredDetails.controller.js";
import { adminLoginController, adminLogoutController } from "../controllers/auth.controller.js";

const router = express.Router();

/* POST /api/auth/login */
router.post("/login", adminLoginController);

/* POST /api/auth/logout */
router.post("/logout", protectAdminRoute, adminLogoutController);


export default router;