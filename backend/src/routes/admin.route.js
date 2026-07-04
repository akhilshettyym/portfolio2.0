import express from "express";
import rateLimit from "express-rate-limit";
import { protectAdminRoute } from "../middleware/auth.middleware.js";
import { getAllInquiries } from "../controllers/getInquiredDetails.controller.js";
import { deleteInquiryDetails } from "../controllers/deleteInquiryDetails.controller.js";

const router = express.Router();

const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        message: "Too many admin requests. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        return req.method === "HEAD";
    },
});

/* GET /api/admin/get-all-inquiries */
router.get("/get-all-inquiries", protectAdminRoute, adminLimiter, getAllInquiries);

/* DELETE /api/admin/delete-details/:id */
router.delete("/delete-details/:id", protectAdminRoute, adminLimiter, deleteInquiryDetails);

export default router;