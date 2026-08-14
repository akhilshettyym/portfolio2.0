import { Trailhead } from "../../models/trailheadModel.js";

export const getTrailhead = async (req, res) => {
  try {
    const trailhead = await Trailhead.findOne();
    res.status(200).json({ success: true, data: trailhead || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTrailhead = async (req, res) => {
  try {
    const trailhead = await Trailhead.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.status(200).json({ success: true, data: trailhead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
