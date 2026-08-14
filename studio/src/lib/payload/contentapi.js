import { ACH_DATA, EDU_DATA, EXP_DATA, TRAIL_DATA, WORK_DATA } from "@/utils/storage";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://portfolio-backend-cjvf.onrender.com";

const KEYS = {
  achievements: ACH_DATA,
  educations: EDU_DATA,
  experiences: EXP_DATA,
  trailhead: TRAIL_DATA,
  works: WORK_DATA,
};

let portfolioInFlightPromise = null;
const isServer = typeof window === "undefined";

const getFromStorage = (key) => {
  if (isServer) return null;
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (err) {
    console.error(`Error reading ${key} from sessionStorage:`, err);
    return null;
  }
};

const setToStorage = (key, value) => {
  if (isServer || value === undefined) return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to sessionStorage:`, err);
  }
};

export const clearPortfolioCache = () => {
  if (isServer) return;
  Object.values(KEYS).forEach((key) => {
    try {
      sessionStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing ${key} from sessionStorage:`, err);
    }
  });
};

const fetchEndpoint = async (endpoint) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 86400,
        tags: ["portfolio"],
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    return json?.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
};

export const getPortfolioData = async () => {
  if (portfolioInFlightPromise) {
    return await portfolioInFlightPromise;
  }

  portfolioInFlightPromise = (async () => {
    try {
      const data = await fetchEndpoint("/api/user/portfolio-content");
      if (data) {
        setToStorage(KEYS.achievements, data.achievements || []);
        setToStorage(KEYS.educations, data.educations || []);
      }
      return data || {};
    } finally {
      portfolioInFlightPromise = null;
    }
  })();

  return await portfolioInFlightPromise;
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

  const data = await fetchEndpoint("/api/user/experiences");
  const result = Array.isArray(data) ? data : [];
  setToStorage(KEYS.experiences, result);
  return result;
}

export async function getTrailhead() {
  const cached = getFromStorage(KEYS.trailhead);
  if (cached) return cached;

  const data = await fetchEndpoint("/api/user/trailhead");
  const result = data || {};
  setToStorage(KEYS.trailhead, result);
  return result;
}

export async function getWorks() {
  const cached = getFromStorage(KEYS.works);
  if (cached) return cached;

  const data = await fetchEndpoint("/api/user/works");
  const result = Array.isArray(data) ? data : [];
  setToStorage(KEYS.works, result);
  return result;
}
