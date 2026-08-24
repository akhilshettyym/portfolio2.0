import { ACH_DATA, EDU_DATA, EXP_DATA, TRAIL_DATA, WORK_DATA } from "@/utils/storage";

const KEYS = {
  achievements: ACH_DATA,
  educations: EDU_DATA,
  experiences: EXP_DATA,
  trailhead: TRAIL_DATA,
  works: WORK_DATA,
};

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

export const seedPortfolioCache = ({ achievements, educations, experiences, trailhead, works } = {}) => {
  if (achievements !== undefined) setToStorage(KEYS.achievements, Array.isArray(achievements) ? achievements : []);
  if (educations !== undefined) setToStorage(KEYS.educations, Array.isArray(educations) ? educations : []);
  if (experiences !== undefined) setToStorage(KEYS.experiences, Array.isArray(experiences) ? experiences : []);
  if (trailhead !== undefined)
    setToStorage(KEYS.trailhead, trailhead && typeof trailhead === "object" ? trailhead : {});
  if (works !== undefined) setToStorage(KEYS.works, Array.isArray(works) ? works : []);
};

export const getPortfolioData = async () => ({
  achievements: (await getAchievements()) || [],
  educations: (await getEducations()) || [],
});

export async function getAchievements() {
  const cached = getFromStorage(KEYS.achievements);
  return Array.isArray(cached) ? cached : [];
}

export async function getEducations() {
  const cached = getFromStorage(KEYS.educations);
  return Array.isArray(cached) ? cached : [];
}

export async function getExperiences() {
  const cached = getFromStorage(KEYS.experiences);
  return Array.isArray(cached) ? cached : [];
}

export async function getTrailhead() {
  const cached = getFromStorage(KEYS.trailhead);
  return cached && typeof cached === "object" ? cached : {};
}

export async function getWorks() {
  const cached = getFromStorage(KEYS.works);
  return Array.isArray(cached) ? cached : [];
}
