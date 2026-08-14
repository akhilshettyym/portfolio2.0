import {
  clearPortfolioCache,
  getPortfolioData,
  getAchievements,
  getEducations,
  getExperiences,
  getTrailhead,
  getWorks,
} from "../src/lib/payload/contentapi";

jest.mock("@/utils/storage", () => ({
  ACH_DATA: "ACH_DATA_KEY",
  EDU_DATA: "EDU_DATA_KEY",
  EXP_DATA: "EXP_DATA_KEY",
  TRAIL_DATA: "TRAIL_DATA_KEY",
  WORK_DATA: "WORK_DATA_KEY",
}));

global.fetch = jest.fn();
global.console.error = jest.fn();

const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage,
});

describe("Portfolio API and Storage Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
  });

  describe("Cache Management", () => {
    it("should clear all portfolio cache keys from sessionStorage", () => {
      clearPortfolioCache();

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("ACH_DATA_KEY");
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("EDU_DATA_KEY");
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("EXP_DATA_KEY");
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("TRAIL_DATA_KEY");
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("WORK_DATA_KEY");
      expect(mockSessionStorage.removeItem).toHaveBeenCalledTimes(5);
    });
  });

  describe("API Fetching - getPortfolioData", () => {
    it("should fetch portfolio content and store achievements and educations", async () => {
      const mockData = {
        data: {
          achievements: [{ id: 1, title: "Ach 1" }],
          educations: [{ id: 1, school: "Edu 1" }],
        },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getPortfolioData();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/user/portfolio-content"),
        expect.any(Object),
      );

      expect(result).toEqual(mockData.data);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        "ACH_DATA_KEY",
        JSON.stringify(mockData.data.achievements),
      );
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith("EDU_DATA_KEY", JSON.stringify(mockData.data.educations));
    });

    it("should prevent duplicate simultaneous network requests (in-flight promise logic)", async () => {
      global.fetch.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ data: { achievements: [] } }),
                }),
              50,
            ),
          ),
      );

      const promise1 = getPortfolioData();
      const promise2 = getPortfolioData();
      const promise3 = getPortfolioData();

      await Promise.all([promise1, promise2, promise3]);

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should gracefully handle fetch errors and return an empty object", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Network Failure"));

      const result = await getPortfolioData();

      expect(result).toEqual({});
      expect(console.error).toHaveBeenCalledWith("Error fetching /api/user/portfolio-content:", expect.any(Error));
    });
  });

  describe("Individual Getters (Achievements, Educations, Experiences, etc.)", () => {
    describe("getAchievements", () => {
      it("should return cached data if available in sessionStorage", async () => {
        mockSessionStorage.getItem.mockReturnValueOnce(JSON.stringify([{ id: 1, title: "Cached Ach" }]));

        const result = await getAchievements();

        expect(result).toEqual([{ id: 1, title: "Cached Ach" }]);
        expect(global.fetch).not.toHaveBeenCalled(); // Network skipped
      });

      it("should fetch data if cache is empty", async () => {
        mockSessionStorage.getItem.mockReturnValueOnce(null);
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { achievements: [{ id: 2 }] } }),
        });

        const result = await getAchievements();

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(result).toEqual([{ id: 2 }]);
      });
    });

    describe("getExperiences", () => {
      it("should return cached experiences", async () => {
        mockSessionStorage.getItem.mockReturnValueOnce(JSON.stringify([{ id: "exp1" }]));

        const result = await getExperiences();

        expect(global.fetch).not.toHaveBeenCalled();
        expect(result).toEqual([{ id: "exp1" }]);
      });

      it("should fetch, cache, and ensure an array is returned on network success", async () => {
        mockSessionStorage.getItem.mockReturnValueOnce(null);
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [{ id: "exp2" }] }),
        });

        const result = await getExperiences();

        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/user/experiences"), expect.any(Object));
        expect(mockSessionStorage.setItem).toHaveBeenCalledWith("EXP_DATA_KEY", JSON.stringify([{ id: "exp2" }]));
        expect(result).toEqual([{ id: "exp2" }]);
      });

      it("should fallback to an empty array if API returns non-array/null data", async () => {
        mockSessionStorage.getItem.mockReturnValueOnce(null);
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: null }),
        });

        const result = await getExperiences();
        expect(result).toEqual([]);
      });
    });

    describe("getTrailhead", () => {
      it("should fetch, cache, and fallback to empty object if API fails", async () => {
        mockSessionStorage.getItem.mockReturnValueOnce(null);
        global.fetch.mockRejectedValueOnce(new Error("Failed"));

        const result = await getTrailhead();

        expect(result).toEqual({});
        expect(mockSessionStorage.setItem).toHaveBeenCalledWith("TRAIL_DATA_KEY", JSON.stringify({}));
      });
    });

    describe("getWorks", () => {
      it("should fetch and cache works array", async () => {
        mockSessionStorage.getItem.mockReturnValueOnce(null);
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [{ title: "Project 1" }] }),
        });

        const result = await getWorks();

        expect(result).toEqual([{ title: "Project 1" }]);
        expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
          "WORK_DATA_KEY",
          JSON.stringify([{ title: "Project 1" }]),
        );
      });
    });
  });
});
