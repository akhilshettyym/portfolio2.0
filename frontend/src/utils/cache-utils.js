import { CACHE_PREFIX } from "@/utils/localstorage";

const CACHE_TTL = 24 * 60 * 60 * 1000;

export const getCachedData = (key) => {
    try {
        if (typeof window === "undefined") return null;

        const cacheKey = `${CACHE_PREFIX}${key}`;
        const cachedItem = window.localStorage.getItem(cacheKey);

        if (!cachedItem) return null;

        const { data, timestamp } = JSON.parse(cachedItem);
        const now = Date.now();

        if (now - timestamp > CACHE_TTL) {
            window.localStorage.removeItem(cacheKey);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Cache retrieval error:", error);
        return null;
    }
};

export const setCachedData = (key, data) => {
    try {
        if (typeof window === "undefined") return;

        const cacheKey = `${CACHE_PREFIX}${key}`;
        const cacheItem = {
            data,
            timestamp: Date.now(),
        };

        window.localStorage.setItem(cacheKey, JSON.stringify(cacheItem));

    } catch (error) {
        console.error("Cache set error:", error);
    }
};

export const clearCache = (key) => {
    try {
        if (typeof window === "undefined") return;

        const cacheKey = `${CACHE_PREFIX}${key}`;
        window.localStorage.removeItem(cacheKey);

    } catch (error) {
        console.error("Cache clear error:", error);
    }
};

export const clearAllGitHubCache = () => {
    try {
        if (typeof window === "undefined") return;

        const keys = Object.keys(window.localStorage);
        keys.forEach((key) => {
            if (key.startsWith(CACHE_PREFIX)) {
                window.localStorage.removeItem(key);
            }
        });

    } catch (error) {
        console.error("Clear all cache error:", error);
    }
};