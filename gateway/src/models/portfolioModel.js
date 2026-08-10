// import mongoose from "mongoose";

// const portfolioSchema = new mongoose.Schema(
//   {
//     achievements: [
//       {
//         title: String,
//         caption: String,
//         description: String,
//         year: String,
//         href: String,
//         cta: String,
//       },
//     ],

//     works: [
//       {
//         title: String,
//         tagline: String,
//         when: String,
//         type: String,
//         image: { type: String, default: "" },
//         url: String,
//         stack: [String],
//         description: String,
//       },
//     ],

//     experiences: [
//       {
//         title: String,
//         company: String,
//         timeline: String,
//         type: String,
//         description: String,
//         tags: [String],
//         tilt: Number,
//       },
//     ],

//     educations: [
//       {
//         title: String,
//         college: String,
//         major: String,
//         score: String,
//         timeline: String,
//         variant: String,
//       },
//     ],

//     trailhead: {
//       rankImg: { type: String, default: "" },
//       rankTitle: String,
//       points: String,
//       superbadges: String,
//       badges: String,
//       trails: String,
//     },
//   },
//   { timestamps: true },
// );

// export const Portfolio = mongoose.model("portfolio_content", portfolioSchema, "portfolio_content");

import mongoose from "mongoose";

// Child schemas with {_id: false} to prevent Mongoose from requiring array element IDs
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
  { _id: false },
);

const experienceSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    timeline: String,
    type: String,
    description: String,
    tags: [String],
    tilt: { type: mongoose.Schema.Types.Mixed, default: 0 }, // Safely parses BSON Double, Float, or Number
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

const trailheadSchema = new mongoose.Schema(
  {
    rankImg: { type: String, default: "" },
    rankTitle: String,
    points: String,
    superbadges: String,
    badges: String,
    trails: String,
  },
  { _id: false },
);

const portfolioSchema = new mongoose.Schema(
  {
    achievements: [achievementSchema],
    works: [workSchema],
    experiences: [experienceSchema],
    educations: [educationSchema],
    trailhead: trailheadSchema,
  },
  { timestamps: true },
);

export const Portfolio = mongoose.model("portfolio_content", portfolioSchema, "portfolio_content");
