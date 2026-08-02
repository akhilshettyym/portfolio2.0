import mongoose from "mongoose";

const contactInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [1, "Name is required"],
      maxlength: [100, "Name must be less than 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please provide a valid email address",
      },
    },

    organization: {
      type: String,
      trim: true,
      default: "",
      maxlength: [200, "Organization name must be less than 200 characters"],
    },

    role: {
      type: String,
      trim: true,
      default: "",
      maxlength: [100, "Role must be less than 100 characters"],
    },

    purpose: {
      type: String,
      required: [true, "Purpose is required"],
      enum: {
        values: ["say_hi", "work"],
        message: "{VALUE} is not a valid purpose type.",
      },
    },

    projectType: {
      type: String,
      enum: ["frontend", "backend", "fullstack", "mobile_app", "cms", "ci_cd", "other"],
      required: [
        function () {
          return this.purpose === "work";
        },
        "Project type is required if you want to work together.",
      ],
    },

    budget: {
      type: String,
      enum: ["under_1k", "1k_5k", "5k_10k", "10k_plus", "not_sure"],
      required: [
        function () {
          return this.purpose === "work";
        },
        "Please select a rough budget estimate.",
      ],
    },

    deadline: {
      type: Date,
      required: false,
    },

    message: {
      type: String,
      required: [true, "Message body is required"],
      trim: true,
      minlength: [10, "Your message should be at least 10 characters long."],
      maxlength: [5000, "Message must be less than 5000 characters"],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

contactInquirySchema.index({ email: 1, createdAt: -1 });

const ContactInquiry = mongoose.models.ContactInquiry || mongoose.model("ContactInquiry", contactInquirySchema);

export default ContactInquiry;
