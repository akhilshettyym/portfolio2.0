import express from "express";
import rateLimit from "express-rate-limit";
import { createInquiry } from "../controllers/createInquiry.controller.js";
import { validateContactInquiry } from "../middleware/validation.middleware.js";
import { getPortfolioContent } from "../controllers/content/portfolio.controller.js";
import { getTrailhead, updateTrailhead } from "../controllers/content/trailhead.controller.js";
import { getWorks, createWork, updateWork, deleteWork } from "../controllers/content/work.controller.js";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/content/experience.controller.js";
import { protectAdminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

const contactInquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many inquiries submitted from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/* POST /api/user/contact-inquiry */
router.post("/contact-inquiry", contactInquiryLimiter, validateContactInquiry, createInquiry);

/* GET /api/user/portfolio-content (Education & Achievements) */
router.get("/portfolio-content", getPortfolioContent);

/* Works Endpoints */
router.get("/works", getWorks);
router.post("/works", protectAdminRoute, createWork);
router.put("/works/:id", protectAdminRoute, updateWork);
router.delete("/works/:id", protectAdminRoute, deleteWork);

/* Experiences Endpoints */
router.get("/experiences", getExperiences);
router.post("/experiences", protectAdminRoute, createExperience);
router.put("/experiences/:id", protectAdminRoute, updateExperience);
router.delete("/experiences/:id", protectAdminRoute, deleteExperience);

/* Trailhead Endpoints */
router.get("/trailhead", getTrailhead);
router.put("/trailhead", protectAdminRoute, updateTrailhead);

export default router;
