import express from "express";
import { protectAdminRoute } from "../middleware/auth.middleware.js";
import { getAllInquiries } from "../controllers/getInquiredDetails.controller.js";
import { deleteInquiryDetails } from "../controllers/deleteInquiryDetails.controller.js";

const router = express.Router();

/* GET /api/admin/get-all-inquiries */
router.get("/get-all-inquiries", protectAdminRoute, getAllInquiries);

/* DELETE /api/admin/delete-details/:id */
router.delete("/delete-details/:id", protectAdminRoute, deleteInquiryDetails);

export default router;