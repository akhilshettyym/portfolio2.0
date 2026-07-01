import mongoose from "mongoose";
import ContactInquiry from "../models/userModel.js";

/**
* @desc    Delete a specific contact inquiry/lead
* @route   DELETE /api/user/delete-details/:id
* @access  Private (Admin Only)
*/
export const deleteInquiryDetails = async (req, res) => {
    
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Lead ID format.",
            });
        }

        const deletedInquiry = await ContactInquiry.findByIdAndDelete(id);

        if (!deletedInquiry) {
            return res.status(404).json({
                success: false,
                message: "Lead not found. It may have already been deleted.",
            });
        }

        return res.status(200).json({
            success: true,
            message: `Lead from '${deletedInquiry.name}' has been successfully deleted.`,
            deletedId: id
        });

    } catch (error) {
        console.error("Error in deleteInquiryDetails Controller:", error);
        return res.status(500).json({
            success: false,
            message: "Server error trying to delete the inquiry details."
        });
    }

};