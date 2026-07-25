import { apiFetch } from "@/utils/api";
import { redirectTo } from "@/utils/navigation";

jest.mock("@/utils/navigation", () => ({
  redirectTo: jest.fn(),
}));

describe("apiFetch Utility", () => {
  beforeEach(() => {
    global.fetch = jest.fn();

    Storage.prototype.getItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();

    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should successfully fetch data and parse JSON", async () => {
    const mockData = { success: true };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({
        "content-type": "application/json",
      }),
      json: async () => mockData,
    });

    const result = await apiFetch("/api/test");

    expect(result).toEqual(mockData);
  });

  it("should attach the auth token from localStorage", async () => {
    Storage.prototype.getItem.mockReturnValue("mock-token");

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers(),
    });

    await apiFetch("/api/protected");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token",
        }),
      }),
    );
  });

  it("should clear session and redirect on 401 Unauthorized", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: new Headers({
        "content-type": "application/json",
      }),
      json: async () => ({
        message: "Token expired",
      }),
    });

    await expect(apiFetch("/api/protected")).rejects.toThrow("Token expired");

    expect(localStorage.removeItem).toHaveBeenCalledWith("authToken");

    expect(document.cookie).toContain("adminSession=; path=/; max-age=0; SameSite=Lax");

    expect(redirectTo).toHaveBeenCalledWith("/login?error=session_expired");
  });

  it("should handle network failures correctly", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    await expect(apiFetch("/api/test")).rejects.toThrow(
      "Unable to connect to the server. Please check your connection.",
    );
  });
});
