import {
  clearPortfolioCache,
  getPortfolioData,
  getAchievements,
  getEducations,
  getExperiences,
  getTrailhead,
  getWorks,
  seedPortfolioCache,
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

describe("Portfolio client cache utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
  });

  it("clears all portfolio cache keys from sessionStorage", () => {
    clearPortfolioCache();

    expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("ACH_DATA_KEY");
    expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("EDU_DATA_KEY");
    expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("EXP_DATA_KEY");
    expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("TRAIL_DATA_KEY");
    expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("WORK_DATA_KEY");
    expect(mockSessionStorage.removeItem).toHaveBeenCalledTimes(5);
  });

  it("seeds only provided portfolio cache values", () => {
    seedPortfolioCache({
      achievements: [{ id: 1, title: "Ach 1" }],
      works: [{ id: 2, title: "Project 1" }],
    });

    expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
      "ACH_DATA_KEY",
      JSON.stringify([{ id: 1, title: "Ach 1" }]),
    );
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
      "WORK_DATA_KEY",
      JSON.stringify([{ id: 2, title: "Project 1" }]),
    );
    expect(mockSessionStorage.setItem).toHaveBeenCalledTimes(2);
  });

  it("reads portfolio data from sessionStorage without fetching", async () => {
    seedPortfolioCache({
      achievements: [{ id: 1, title: "Cached Ach" }],
      educations: [{ id: 2, title: "Cached Edu" }],
    });

    await expect(getPortfolioData()).resolves.toEqual({
      achievements: [{ id: 1, title: "Cached Ach" }],
      educations: [{ id: 2, title: "Cached Edu" }],
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns cached values from individual getters", async () => {
    seedPortfolioCache({
      achievements: [{ id: "ach" }],
      educations: [{ id: "edu" }],
      experiences: [{ id: "exp" }],
      trailhead: { rankTitle: "Triple Star Ranger" },
      works: [{ id: "work" }],
    });

    await expect(getAchievements()).resolves.toEqual([{ id: "ach" }]);
    await expect(getEducations()).resolves.toEqual([{ id: "edu" }]);
    await expect(getExperiences()).resolves.toEqual([{ id: "exp" }]);
    await expect(getTrailhead()).resolves.toEqual({ rankTitle: "Triple Star Ranger" });
    await expect(getWorks()).resolves.toEqual([{ id: "work" }]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns safe empty fallbacks when no client cache exists", async () => {
    await expect(getAchievements()).resolves.toEqual([]);
    await expect(getEducations()).resolves.toEqual([]);
    await expect(getExperiences()).resolves.toEqual([]);
    await expect(getTrailhead()).resolves.toEqual({});
    await expect(getWorks()).resolves.toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
