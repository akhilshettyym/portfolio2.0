import { Work } from "../../models/workModel.js";

export const getWorks = async (req, res) => {
  try {
    const works = await Work.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: works });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createWork = async (req, res) => {
  try {
    const work = await Work.create(req.body);
    res.status(201).json({ success: true, data: work });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWork = async (req, res) => {
  try {
    const work = await Work.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: work });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteWork = async (req, res) => {
  try {
    await Work.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Work deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
