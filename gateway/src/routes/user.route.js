import express from "express";
import rateLimit from "express-rate-limit";
import { createInquiry } from "../controllers/createInquiry.controller.js";
import { validateContactInquiry } from "../middleware/validation.middleware.js";

const router = express.Router();

const contactInquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message:
      "Too many inquiries submitted from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/* POST /api/user/contact-inquiry */
router.post(
  "/contact-inquiry",
  contactInquiryLimiter,
  validateContactInquiry,
  createInquiry,
);

export default router;
