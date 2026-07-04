import express from "express";
import rateLimit from "express-rate-limit";
import { protectAdminRoute } from "../middleware/auth.middleware.js";
import { adminLoginController, adminLogoutController } from "../controllers/auth.controller.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
  standardHeaders: true,
  legacyHeaders: false,
  store: undefined,
});

const logoutLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many logout requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/* POST /api/auth/login */
router.post("/login", loginLimiter, adminLoginController);

/* POST /api/auth/logout */
router.post("/logout", protectAdminRoute, logoutLimiter, adminLogoutController);

export default router;