// const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://portfolio-backend-cjvf.onrender.com";

import { ACH_DATA, EDU_DATA, EXP_DATA, TRAIL_DATA, WORK_DATA } from "@/utils/storage";

const baseUrl = "http://localhost:8000";

const KEYS = {
  achievements: ACH_DATA,
  educations: EDU_DATA,
  experiences: EXP_DATA,
  trailhead: TRAIL_DATA,
  works: WORK_DATA,
};

let inFlightFetchPromise = null;

const getFromStorage = (key) => {
  if (typeof window === "undefined") return null;
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (err) {
    console.error(`Error reading ${key} from sessionStorage:`, err);
    return null;
  }
};

const setToStorage = (key, value) => {
  if (typeof window === "undefined" || value === undefined) return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to sessionStorage:`, err);
  }
};

export const getPortfolioData = async () => {
  if (inFlightFetchPromise) {
    return await inFlightFetchPromise;
  }

  inFlightFetchPromise = (async () => {
    try {
      const res = await fetch(`${baseUrl}/api/user/portfolio-content`, {
        next: {
          revalidate: 86400,
          tags: ["portfolio"],
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch portfolio content: ${res.statusText}`);
      }

      const json = await res.json();
      const data = json?.data || {};

      setToStorage(KEYS.achievements, data.achievements || []);
      setToStorage(KEYS.educations, data.educations || []);
      setToStorage(KEYS.experiences, data.experiences || []);
      setToStorage(KEYS.trailhead, data.trailhead || {});
      setToStorage(KEYS.works, data.works || []);

      return data;
    } catch (error) {
      console.error("Error in getPortfolioData:", error);
      return null;
    } finally {
      inFlightFetchPromise = null;
    }
  })();

  return await inFlightFetchPromise;
};

export async function getAchievements() {
  const cached = getFromStorage(KEYS.achievements);
  if (cached) return cached;

  const data = await getPortfolioData();
  return data?.achievements || [];
}

export async function getEducations() {
  const cached = getFromStorage(KEYS.educations);
  if (cached) return cached;

  const data = await getPortfolioData();
  return data?.educations || [];
}

export async function getExperiences() {
  const cached = getFromStorage(KEYS.experiences);
  if (cached) return cached;

  const data = await getPortfolioData();
  return data?.experiences || [];
}

export async function getTrailhead() {
  const cached = getFromStorage(KEYS.trailhead);
  if (cached) return cached;

  const data = await getPortfolioData();
  return data?.trailhead || {};
}

export async function getWorks() {
  const cached = getFromStorage(KEYS.works);
  if (cached) return cached;

  const data = await getPortfolioData();
  return data?.works || [];
}
