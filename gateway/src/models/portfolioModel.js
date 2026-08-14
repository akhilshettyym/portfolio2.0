import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    title: String,
    caption: String,
    description: String,
    year: String,
    href: String,
    cta: String,
  },
  { _id: false },
);

const educationSchema = new mongoose.Schema(
  {
    title: String,
    college: String,
    major: String,
    score: String,
    timeline: String,
    variant: String,
  },
  { _id: false },
);

const portfolioSchema = new mongoose.Schema(
  {
    achievements: [achievementSchema],
    educations: [educationSchema],
  },
  { timestamps: true },
);

export const Portfolio = mongoose.model("portfolio_content", portfolioSchema, "portfolio_content");
