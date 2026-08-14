import mongoose from "mongoose";

const trailheadSchema = new mongoose.Schema(
  {
    rankImg: { type: String, default: "" },
    rankTitle: String,
    points: String,
    superbadges: String,
    badges: String,
    trails: String,
  },
  { timestamps: true },
);

export const Trailhead = mongoose.model("Trailhead", trailheadSchema);
