import express from "express";
import { createInquiry } from "../controllers/createInquiry.controller.js";
import { validateContactInquiry } from "../middleware/validation.middleware.js";

const router = express.Router();

/* POST /api/user/contact-inquiry */
router.post("/contact-inquiry", validateContactInquiry, createInquiry);

export default router;