import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    timeline: String,
    type: String,
    description: String,
    tags: [String],
    tilt: { type: mongoose.Schema.Types.Mixed, default: 0 },
  },
  { timestamps: true },
);

export const Experience = mongoose.model("Experience", experienceSchema);
