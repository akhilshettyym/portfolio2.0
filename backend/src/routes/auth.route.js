import express from "express";
import rateLimit from "express-rate-limit";
import { protectAdminRoute } from "../middleware/auth.middleware.js";
import { getAllInquiries } from "../controllers/getInquiredDetails.controller.js";
import { adminLoginController, adminLogoutController } from "../controllers/auth.controller.js";

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many login attempts. Please try again in 15 minutes."
    },
    skipSuccessfulRequests: true,
    standardHeaders: false,
});

/* POST /api/auth/login */
router.post("/login", loginLimiter, adminLoginController);

/* POST /api/auth/logout */
router.post("/logout", protectAdminRoute, adminLogoutController);


export default router;