import express from "express";
import { createInquiry } from "../controllers/createInquiry.controller.js";


const router = express.Router();

/* POST /api/user/contact-enquiry */
router.post("/contact-inquiry", createInquiry);


export default router;