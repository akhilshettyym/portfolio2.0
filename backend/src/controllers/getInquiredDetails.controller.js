import ContactInquiry from "../models/userModel.js";

/**
* @desc    Get all inquiries (Useful later if you build an admin dashboard)
* @route   GET /api/contact
* @access  Private (You should protect this route with auth middleware later)
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
        console.error('Error in getAllInquiries Controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve inquiries.',
        });
    }

};