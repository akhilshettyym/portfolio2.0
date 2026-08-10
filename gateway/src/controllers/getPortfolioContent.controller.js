import { Portfolio } from "../models/portfolioModel.js";

export const getPortfolioContent = async (req, res) => {
  try {
    const portfolioData = await Portfolio.findOne();

    if (!portfolioData) {
      return res.status(404).json({ success: false, message: "Portfolio data not found" });
    }

    res.status(200).json({
      success: true,
      data: portfolioData,
    });
  } catch (error) {
    console.error("Error fetching portfolio content:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch portfolio data",
    });
  }
};
