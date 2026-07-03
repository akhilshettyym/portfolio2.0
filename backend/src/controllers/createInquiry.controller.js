import ContactInquiry from "../models/userModel.js";

/**
 * @desc    Submit a new contact inquiry (Say Hi or Project Request)
 * @route   POST /api/user/contact-inquiry
 * @access  Public (Any user)
 */
export const createInquiry = async (req, res) => {
  try {
    const { name, email, organization, role, purpose, projectType, budget, deadline, message } = req.body;

    const inquiryPayload = { name, email, organization, role, purpose, message };

    if (purpose === "work") {
      inquiryPayload.projectType = projectType;
      inquiryPayload.budget = budget;
      if (deadline) {
        inquiryPayload.deadline = deadline;
      }
    }

    const newInquiry = new ContactInquiry(inquiryPayload);
    const savedInquiry = await newInquiry.save();

    return res.status(201).json({
      success: true,
      message:
        purpose === "work"
          ? "Project inquiry submitted successfully! I will review your details and reach out soon."
          : "Thanks for reaching out! I appreciate you saying hi.",
      data: savedInquiry,
    });
  } catch (error) {
    console.error("Error in createInquiry Controller:", error);

    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message,
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorMessages,
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected server error occurred. Please try again later.",
    });
  }
};