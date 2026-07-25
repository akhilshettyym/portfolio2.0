import ContactInquiry from "../models/userModel.js";

/**
 * @desc    Get all inquiries
 * @route   GET /api/admin/get-all-inquiries
 * @access  Private (Admin Only)
 */
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    console.error("Error in getAllInquiries Controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve inquiries.",
    });
  }
};
