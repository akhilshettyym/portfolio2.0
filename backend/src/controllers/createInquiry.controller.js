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
    const isWork = purpose === "work";

    if (isWork) {
      inquiryPayload.projectType = projectType;
      inquiryPayload.budget = budget;
      if (deadline) {
        inquiryPayload.deadline = deadline;
      }
    }

    const newInquiry = new ContactInquiry(inquiryPayload);
    const savedInquiry = await newInquiry.save();

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (webhookUrl) {
      const fields = [
        { name: "Name", value: name || "N/A", inline: true },
        { name: "Email", value: email || "N/A", inline: true },
        { name: "Organization", value: organization || "N/A", inline: true },
      ];

      if (isWork) {
        fields.push(
          { name: "Project Type", value: projectType || "N/A", inline: true },
          { name: "Budget", value: budget || "N/A", inline: true },
          { name: "Deadline", value: deadline || "N/A", inline: true }
        );
      }

      const formattedMessage = message ? `>>> ${message}` : "*No message provided.*";
      fields.push({ name: "Message", value: formattedMessage, inline: false });

      const discordPayload = {
        embeds: [
          {
            author: {
              name: "Website Contact Form",
            },
            title: isWork ? "New Project Request!" : "New Hello Inquiry!",
            color: isWork ? 15158332 : 3447003,
            fields: fields,
            footer: {
              text: "Portfolio Bot • Automated Alert",
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordPayload),
      }).catch((err) => console.error("Discord Webhook failed:", err));
    } else {
      console.warn("DISCORD_WEBHOOK_URL is not defined in the environment variables.");
    }

    return res.status(201).json({
      success: true,
      message: isWork
        ? "Project inquiry submitted successfully! I will review your details and reach out soon."
        : "Thanks for reaching out! I appreciate you saying hi.",
      data: savedInquiry,
    });

  } catch (error) {
    console.error("Error in createInquiry Controller:", error);

    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map((err) => err.message);
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