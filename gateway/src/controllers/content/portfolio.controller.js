import { Portfolio } from "../../models/portfolioModel.js";

export const getPortfolioContent = async (req, res) => {
  try {
    const portfolioData = await Portfolio.findOne();
    if (!portfolioData) return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, data: portfolioData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
