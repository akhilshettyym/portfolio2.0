import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
  {
    title: String,
    tagline: String,
    when: String,
    type: String,
    image: { type: String, default: "" },
    url: String,
    stack: [String],
    description: String,
  },
  { timestamps: true },
);

export const Work = mongoose.model("Work", workSchema);
