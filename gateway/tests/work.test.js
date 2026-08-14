import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const CONTROLLER_PATH = "../src/controllers/content/work.controller.js";
const MODEL_PATH = "../src/models/workModel.js";

jest.unstable_mockModule(MODEL_PATH, () => ({
  Work: {
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const { getWorks, createWork, updateWork, deleteWork } = await import(CONTROLLER_PATH);
const { Work } = await import(MODEL_PATH);

describe("Work Controllers", () => {
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

  describe("getWorks", () => {
    it("should return 200 and a list of works on success", async () => {
      const mockWorks = [
        { title: "Portfolio Website", techStack: ["React", "Node.js"] },
        { title: "E-commerce App", techStack: ["Next.js", "MongoDB"] },
      ];

      Work.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockWorks),
      });

      await getWorks(req, res);

      expect(Work.find).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockWorks,
      });
    });

    it("should return 500 on database error", async () => {
      const errorMessage = "Database query failed";

      Work.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error(errorMessage)),
      });

      await getWorks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe("createWork", () => {
    it("should return 201 and the created work on success", async () => {
      const mockWorkData = { title: "New Project", description: "Project details" };
      req.body = mockWorkData;

      Work.create.mockResolvedValue(mockWorkData);

      await createWork(req, res);

      expect(Work.create).toHaveBeenCalledWith(mockWorkData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockWorkData,
      });
    });

    it("should return 500 on creation error", async () => {
      const errorMessage = "Validation failed";
      req.body = { title: "Invalid Project" };

      Work.create.mockRejectedValue(new Error(errorMessage));

      await createWork(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe("updateWork", () => {
    it("should return 200 and updated work data on success", async () => {
      const mockUpdatedWork = { title: "Updated Project Title" };
      req.params.id = "work123";
      req.body = mockUpdatedWork;

      Work.findByIdAndUpdate.mockResolvedValue(mockUpdatedWork);

      await updateWork(req, res);

      expect(Work.findByIdAndUpdate).toHaveBeenCalledWith("work123", mockUpdatedWork, { new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedWork,
      });
    });

    it("should return 500 on database error", async () => {
      const errorMessage = "Invalid Work ID";
      req.params.id = "work123";

      Work.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      await updateWork(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe("deleteWork", () => {
    it("should return 200 and a success message on deletion", async () => {
      req.params.id = "work123";

      Work.findByIdAndDelete.mockResolvedValue(true);

      await deleteWork(req, res);

      expect(Work.findByIdAndDelete).toHaveBeenCalledWith("work123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Work deleted",
      });
    });

    it("should return 500 on deletion error", async () => {
      const errorMessage = "Delete operation failed";
      req.params.id = "work123";

      Work.findByIdAndDelete.mockRejectedValue(new Error(errorMessage));

      await deleteWork(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });
});
