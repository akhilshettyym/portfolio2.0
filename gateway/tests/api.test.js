import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";
import ContactInquiry from "../src/models/userModel.js";
import AdminModel from "../src/models/adminModel.js";

describe("Backend API Suite", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    process.env.JWT_SECRET = "test-secret-key-at-least-32-characters-long";

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });
  });

  describe("GET /ping", () => {
    it("should return 200 OK and say 'pong'", async () => {
      const res = await request(app).get("/ping");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("pong");
    });
  });

  describe("POST /api/user/contact-inquiry", () => {
    it("should successfully create a general inquiry ('say_hi')", async () => {
      const validPayload = {
        name: "Alex Smith",
        email: "alex@example.com",
        purpose: "say_hi",
        message: "Hey! Just wanted to reach out and look at your work.",
      };

      ContactInquiry.findOne = jest.fn().mockImplementation(() => ({
        sort: jest.fn().mockResolvedValue(null),
      }));

      const mockSavedInstance = {
        ...validPayload,
        _id: "inquiry_mock_id_123",
        createdAt: new Date().toISOString(),
      };
      jest.spyOn(ContactInquiry.prototype, "save").mockResolvedValue(mockSavedInstance);

      const res = await request(app).post("/api/user/contact-inquiry").send(validPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("Thanks for reaching out");
    });

    it("should reject an inquiry if validation criteria fails (e.g., short message)", async () => {
      const invalidPayload = {
        name: "Alex Smith",
        email: "alex@example.com",
        purpose: "say_hi",
        message: "Short",
      };

      const res = await request(app)
        .post("/api/user/contact-inquiry")
        .send(invalidPayload);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Message must be between 10-5000 characters");
    });

    it("should enforce mandatory work fields when purpose is set to 'work'", async () => {
      const incompleteWorkPayload = {
        name: "Enterprise Corp",
        email: "corporate@enterprise.com",
        purpose: "work",
        message: "We need a massive fullstack software system built immediately.",
      };

      const res = await request(app)
        .post("/api/user/contact-inquiry")
        .send(incompleteWorkPayload);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Invalid project type selected");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should log in successfully and assign an httpOnly cookie given correct credentials", async () => {
      const mockUser = {
        _id: "admin123",
        name: "Admin User",
        email: "admin@portfolio.com",
        role: "ADMIN",
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      AdminModel.findOne = jest.fn().mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUser),
      }));

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin@portfolio.com", password: "SecurePassword123!" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe("ADMIN");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should refuse access and deny access tokens upon wrong passwords", async () => {
      const mockUser = {
        email: "admin@portfolio.com",
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      AdminModel.findOne = jest.fn().mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUser),
      }));

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin@portfolio.com", password: "WrongPassword" });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Protected Admin Endpoints", () => {
    it("should block requests trying to fetch inquiries without a token", async () => {
      const res = await request(app).get("/api/admin/get-all-inquiries");

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should grant access to get-all-inquiries when a verified Admin token cookie is provided", async () => {
      const signedAdminToken = jwt.sign(
        { userId: "admin123", role: "ADMIN" },
        process.env.JWT_SECRET,
      );

      const mockInquiriesList = [
        { name: "John Doe", message: "Testing dashboard visibility" },
      ];

      ContactInquiry.find = jest.fn().mockImplementation(() => ({
        sort: jest.fn().mockResolvedValue(mockInquiriesList),
      }));

      const res = await request(app)
        .get("/api/admin/get-all-inquiries")
        .set("Cookie", [`token=${signedAdminToken}`]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
