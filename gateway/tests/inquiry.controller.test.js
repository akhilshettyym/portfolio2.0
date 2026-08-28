import mongoose from "mongoose";
import ContactInquiry from "../src/models/userModel.js";
import { createInquiry } from "../src/controllers/createInquiry.controller.js";
import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { getAllInquiries } from "../src/controllers/getInquiredDetails.controller.js";
import { deleteInquiryDetails } from "../src/controllers/deleteInquiryDetails.controller.js";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  }),
);

describe("Inquiry Controllers", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createInquiry", () => {
    it("should block request (429) if user submitted an inquiry within 5 minutes", async () => {
      req.body = { email: "spam@test.com" };

      jest.spyOn(ContactInquiry, "findOne").mockReturnValue({
        sort: jest.fn().mockResolvedValue({
          createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
        }),
      });

      await createInquiry(req, res);

      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining("Please wait 5 minutes"),
        }),
      );
    });

    it("should save inquiry and return 201 for a valid 'say_hi' purpose", async () => {
      req.body = {
        name: "Alice Builder",
        email: "alice@test.com",
        purpose: "say_hi",
        message: "Hello! Love your portfolio.",
      };

      jest.spyOn(ContactInquiry, "findOne").mockReturnValue({
        sort: jest.fn().mockResolvedValue(null),
      });

      const saveMock = jest.fn().mockResolvedValue({
        _id: "inquiry123",
        email: "alice@test.com",
        createdAt: new Date(),
      });

      jest.spyOn(ContactInquiry.prototype, "save").mockImplementation(saveMock);

      await createInquiry(req, res);

      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining("Thanks for reaching out"),
        }),
      );
    });
  });

  describe("getAllInquiries", () => {
    it("should retrieve all inquiries successfully sorted by latest", async () => {
      const mockInquiries = [{ name: "Inquiry Alpha" }, { name: "Inquiry Beta" }];

      jest.spyOn(ContactInquiry, "find").mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockInquiries),
      });

      await getAllInquiries(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockInquiries,
      });
    });
  });

  describe("deleteInquiryDetails", () => {
    it("should return 400 for an invalid MongoDB ObjectId string format", async () => {
      req.params.id = "not-a-valid-id";

      await deleteInquiryDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Invalid Lead ID format.",
        }),
      );
    });

    it("should return 404 if inquiry lead does not exist", async () => {
      req.params.id = new mongoose.Types.ObjectId().toString();
      jest.spyOn(ContactInquiry, "findByIdAndDelete").mockResolvedValue(null);

      await deleteInquiryDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        }),
      );
    });

    it("should successfully delete lead and return 200 status", async () => {
      const validId = new mongoose.Types.ObjectId().toString();
      req.params.id = validId;
      jest.spyOn(ContactInquiry, "findByIdAndDelete").mockResolvedValue({ name: "Jane Smith" });

      await deleteInquiryDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          deletedId: validId,
        }),
      );
    });
  });
});
