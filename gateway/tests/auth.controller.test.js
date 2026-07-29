import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { adminLoginController, adminLogoutController } from "../src/controllers/auth.controller.js";
import AdminModel from "../src/models/adminModel.js";
import jwt from "jsonwebtoken";

describe("Auth Controllers", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    process.env.JWT_SECRET = "test_secret_32_characters_long_minimum";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("adminLoginController", () => {
    it("should return 400 if email or password is missing", async () => {
      req.body = { email: "test@test.com" };
      await adminLoginController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Email and Password are required",
      });
    });

    it("should return 401 if admin is not found", async () => {
      req.body = { email: "wrong@test.com", password: "password123" };

      jest.spyOn(AdminModel, "findOne").mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await adminLoginController(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Email or Password is invalid",
      });
    });

    it("should return 401 if password is wrong", async () => {
      req.body = { email: "admin@test.com", password: "wrongpassword" };

      const mockUser = {
        _id: "user123",
        email: "admin@test.com",
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      jest.spyOn(AdminModel, "findOne").mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await adminLoginController(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Email or Password is invalid",
      });
    });

    it("should set cookie and return 200 on successful login", async () => {
      req.body = { email: "admin@test.com", password: "correctpassword" };

      const mockUser = {
        _id: "user123",
        name: "Admin",
        email: "admin@test.com",
        role: "ADMIN",
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(AdminModel, "findOne").mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      jest.spyOn(jwt, "sign").mockReturnValue("mocked_token");

      await adminLoginController(req, res);

      expect(jwt.sign).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith("token", "mocked_token", expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: {
          _id: "user123",
          name: "Admin",
          email: "admin@test.com",
          role: "ADMIN",
        },
      });
    });
  });

  describe("adminLogoutController", () => {
    it("should clear the cookie and return 200", async () => {
      await adminLogoutController(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith("token", expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Logged out successfully",
      });
    });
  });
});
