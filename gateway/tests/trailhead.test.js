import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const CONTROLLER_PATH = "../src/controllers/content/trailhead.controller.js";
const MODEL_PATH = "../src/models/trailheadModel.js";

jest.unstable_mockModule(MODEL_PATH, () => ({
  Trailhead: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

const { getTrailhead, updateTrailhead } = await import(CONTROLLER_PATH);
const { Trailhead } = await import(MODEL_PATH);

describe("Trailhead Controllers", () => {
  let req;
  let res;

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    req = {
      body: {},
    };
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe("getTrailhead", () => {
    it("should return 200 and trailhead data when found", async () => {
      const mockTrailheadData = { rank: "Ranger", badges: 150, points: 100000 };

      Trailhead.findOne.mockResolvedValue(mockTrailheadData);

      await getTrailhead(req, res);

      expect(Trailhead.findOne).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTrailheadData,
      });
    });

    it("should return 200 and an empty object when no document is found", async () => {
      Trailhead.findOne.mockResolvedValue(null);

      await getTrailhead(req, res);

      expect(Trailhead.findOne).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {},
      });
    });

    it("should return 500 on database error", async () => {
      const errorMessage = "Database connection error";
      Trailhead.findOne.mockRejectedValue(new Error(errorMessage));

      await getTrailhead(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe("updateTrailhead", () => {
    it("should return 200 and updated trailhead data on success", async () => {
      const mockUpdateData = { rank: "Triple Star Ranger", points: 150000 };
      req.body = mockUpdateData;

      Trailhead.findOneAndUpdate.mockResolvedValue(mockUpdateData);

      await updateTrailhead(req, res);

      expect(Trailhead.findOneAndUpdate).toHaveBeenCalledWith({}, mockUpdateData, { new: true, upsert: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdateData,
      });
    });

    it("should return 500 on database error", async () => {
      const errorMessage = "Update operation failed";
      req.body = { rank: "Double Star Ranger" };

      Trailhead.findOneAndUpdate.mockRejectedValue(new Error(errorMessage));

      await updateTrailhead(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });
});
