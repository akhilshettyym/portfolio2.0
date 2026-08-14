import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const CONTROLLER_PATH = "../src/controllers/content/portfolio.controller.js";
const MODEL_PATH = "../src/models/portfolioModel.js";

jest.unstable_mockModule(MODEL_PATH, () => ({
  Portfolio: {
    findOne: jest.fn(),
  },
}));

const { getPortfolioContent } = await import(CONTROLLER_PATH);
const { Portfolio } = await import(MODEL_PATH);

describe("getPortfolioContent Controller", () => {
  let req;
  let res;

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    req = {};
    res = mockResponse();
    jest.clearAllMocks();
  });

  it("should return 200 and portfolio data when record exists", async () => {
    const mockPortfolioData = {
      name: "Jane Doe",
      bio: "Full Stack Developer",
    };

    Portfolio.findOne.mockResolvedValue(mockPortfolioData);

    await getPortfolioContent(req, res);

    expect(Portfolio.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockPortfolioData,
    });
  });

  it("should return 404 if no portfolio data is found", async () => {
    Portfolio.findOne.mockResolvedValue(null);

    await getPortfolioContent(req, res);

    expect(Portfolio.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Not found",
    });
  });

  it("should return 500 if a database error occurs", async () => {
    const errorMessage = "Database query error";
    Portfolio.findOne.mockRejectedValue(new Error(errorMessage));

    await getPortfolioContent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: errorMessage,
    });
  });
});
