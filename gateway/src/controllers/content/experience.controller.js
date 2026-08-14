import { Experience } from "../../models/experienceModel.js";

export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Experience deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
