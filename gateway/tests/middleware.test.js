import jwt from "jsonwebtoken";
import { protectAdminRoute } from "../src/middleware/auth.middleware.js";
import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { validateContactInquiry } from "../src/middleware/validation.middleware.js";

describe("Middlewares", () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {}, headers: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = "test_secret_32_characters_long_minimum";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("protectAdminRoute", () => {
    it("should return 401 if no authorization cookie or header exists", async () => {
      await protectAdminRoute(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Access Denied. No token provided.",
        }),
      );
    });

    it("should return 403 if token role is not explicitly 'ADMIN'", async () => {
      req.cookies.token = "user_token";
      jest.spyOn(jwt, "verify").mockReturnValue({ userId: "user_id_456", role: "USER" });

      await protectAdminRoute(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Forbidden. Insufficient permissions.",
        }),
      );
    });

    it("should append adminId to request and fire next() if token is authorized", async () => {
      req.headers.authorization = "Bearer structural_admin_token";
      jest.spyOn(jwt, "verify").mockReturnValue({ userId: "admin_id_789", role: "ADMIN" });

      await protectAdminRoute(req, res, next);

      expect(req.adminId).toBe("admin_id_789");
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("validateContactInquiry", () => {
    it("should return 400 if email field validation fails", () => {
      req.body = {
        name: "John Doe",
        email: "malformed-email-address",
        message: "This payload contains an invalid email field structure.",
        purpose: "say_hi",
      };

      validateContactInquiry(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Valid email address is required",
        }),
      );
    });

    it("should return 400 if purpose is 'work' but dynamic workflow attributes are missing", () => {
      req.body = {
        name: "Jane Project",
        email: "jane@company.com",
        message: "Looking for an expert application engineer to assist.",
        purpose: "work",
      };

      validateContactInquiry(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Invalid project type selected",
        }),
      );
    });

    it("should proceed past verification step with next() for highly valid inputs", () => {
      req.body = {
        name: "Valid Enterprise",
        email: "partner@enterprise.org",
        message: "This message meets the character limit constraint parameters.",
        purpose: "work",
        projectType: "fullstack",
        budget: "5k_10k",
      };

      validateContactInquiry(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
