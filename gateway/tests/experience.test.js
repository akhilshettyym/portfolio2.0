import { jest, describe, it, expect, beforeEach } from "@jest/globals";

jest.unstable_mockModule("../src/models/experienceModel.js", () => ({
  Experience: {
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const { getExperiences, createExperience, updateExperience, deleteExperience } =
  await import("../src/controllers/content/experience.controller.js");
const { Experience } = await import("../src/models/experienceModel.js");

describe("Experience Controllers", () => {
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
      params: {},
    };
    res = mockResponse();

    jest.clearAllMocks();
  });

  describe("getExperiences", () => {
    it("should return 200 and a list of experiences on success", async () => {
      const mockExperiences = [
        { title: "Software Engineer", company: "Tech Corp" },
        { title: "Frontend Dev", company: "Web LLC" },
      ];

      Experience.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockExperiences),
      });

      await getExperiences(req, res);

      expect(Experience.find).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockExperiences,
      });
    });

    it("should return 500 on database error", async () => {
      const errorMessage = "Database connection failed";

      Experience.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error(errorMessage)),
      });

      await getExperiences(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe("createExperience", () => {
    it("should return 201 and the created experience on success", async () => {
      const mockData = { title: "Software Engineer", company: "Tech Corp" };
      req.body = mockData;

      Experience.create.mockResolvedValue(mockData);

      await createExperience(req, res);

      expect(Experience.create).toHaveBeenCalledWith(mockData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockData,
      });
    });

    it("should return 500 on validation error", async () => {
      const errorMessage = "Validation failed";
      Experience.create.mockRejectedValue(new Error(errorMessage));

      await createExperience(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe("updateExperience", () => {
    it("should return 200 and updated data on success", async () => {
      const mockUpdatedData = { title: "Senior Engineer", company: "Tech Corp" };
      req.params.id = "12345";
      req.body = { title: "Senior Engineer" };

      Experience.findByIdAndUpdate.mockResolvedValue(mockUpdatedData);

      await updateExperience(req, res);

      expect(Experience.findByIdAndUpdate).toHaveBeenCalledWith("12345", req.body, { new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedData,
      });
    });

    it("should return 500 on database error", async () => {
      const errorMessage = "Invalid ID";
      req.params.id = "12345";

      Experience.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      await updateExperience(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe("deleteExperience", () => {
    it("should return 200 and a success message on successful deletion", async () => {
      req.params.id = "12345";

      Experience.findByIdAndDelete.mockResolvedValue(true);

      await deleteExperience(req, res);

      expect(Experience.findByIdAndDelete).toHaveBeenCalledWith("12345");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Experience deleted",
      });
    });

    it("should return 500 on database error", async () => {
      const errorMessage = "Failed to delete";
      req.params.id = "12345";

      Experience.findByIdAndDelete.mockRejectedValue(new Error(errorMessage));

      await deleteExperience(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });
});
