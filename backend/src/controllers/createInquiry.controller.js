import ContactInquiry from "../models/userModel.js";

/**
 * @desc    Submit a new contact inquiry (Say Hi or Project Request)
 * @route   POST /api/user/contact-inquiry
 * @access  Public (Any user)
 */
export const createInquiry = async (req, res) => {
  try {
    const { name, email, organization, role, purpose, projectType, budget, deadline, message } = req.body;

    const recentInquiry = await ContactInquiry.findOne({
      email,
      createdAt: {
        $gte: new Date(Date.now() - 5 * 60 * 1000),
      },
    });

    if (recentInquiry) {
      return res.status(429).json({
        success: false,
        message:
          "Please wait 5 minutes before submitting another inquiry from this email.",
      });
    }

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
      try {
        const sanitizeString = (str) =>
          str ? str
            .slice(0, 1024)
            .replace(/@everyone/g, "@everyone")
            .replace(/@here/g, "@here")
            .replace(/([_`*~|<>:\\])/g, "\\$1")
            : "N/A";

        const fields = [
          { name: "Name", value: sanitizeString(name), inline: true },
          { name: "Email", value: sanitizeString(email), inline: true },
          {
            name: "Organization",
            value: sanitizeString(organization) || "N/A",
            inline: true,
          },
        ];

        if (isWork) {
          fields.push(
            { name: "Project Type", value: sanitizeString(projectType), inline: true },
            { name: "Budget", value: sanitizeString(budget), inline: true },
            {
              name: "Deadline",
              value: deadline ? new Date(deadline).toLocaleDateString() : "N/A",
              inline: true,
            }
          );
        }

        const formattedMessage = message
          ? `>>> ${sanitizeString(message)}`
          : "*No message provided.*";
        fields.push({
          name: "Message",
          value: formattedMessage,
          inline: false,
        });

        const discordPayload = {
          embeds: [
            {
              author: {
                name: "Website Contact Form",
              },
              title: isWork ? "New Project Request! 🚀" : "New Hello Inquiry! 👋",
              color: isWork ? 15158332 : 3447003,
              fields: fields,
              footer: {
                text: `Portfolio Bot • ID: ${savedInquiry._id}`,
              },
              timestamp: new Date().toISOString(),
            },
          ],
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(discordPayload),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            console.error(
              `Discord webhook failed with status ${response.status}`
            );
          } else {
            console.log("Discord notification sent successfully");
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError.name === "AbortError") {
            console.error("Discord webhook timeout (5s)");
          } else {
            console.error("Discord webhook error:", fetchError.message);
          }
        }
      } catch (webhookError) {
        console.error("Error preparing Discord webhook:", webhookError.message);
      }
    } else {
      console.warn(
        "DISCORD_WEBHOOK_URL is not defined. Inquiry created but no notification sent."
      );
    }

    return res.status(201).json({
      success: true,
      message: isWork
        ? "Project inquiry submitted successfully! I will review your details and reach out soon."
        : "Thanks for reaching out! I appreciate you saying hi.",
      data: {
        _id: savedInquiry._id,
        email: savedInquiry.email,
        createdAt: savedInquiry.createdAt,
      },
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