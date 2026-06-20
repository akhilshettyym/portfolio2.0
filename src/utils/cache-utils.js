/**
 * Cache utility for GitHub API responses with TTL (Time To Live)
 * Stores data in localStorage with expiration timestamps
 */

const CACHE_PREFIX = "github_cache_";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Get cached data if it exists and hasn't expired
 * @param {string} key - Cache key identifier
 * @returns {any|null} - Cached data or null if expired/not found
 */
export const getCachedData = (key) => {
    try {
        if (typeof window === "undefined") return null;

        const cacheKey = `${CACHE_PREFIX}${key}`;
        const cachedItem = window.localStorage.getItem(cacheKey);

        if (!cachedItem) return null;

        const { data, timestamp } = JSON.parse(cachedItem);
        const now = Date.now();

        // Check if cache has expired
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

/**
 * Set data in cache with current timestamp
 * @param {string} key - Cache key identifier
 * @param {any} data - Data to cache
 */
export const setCachedData = (key, data) => {
    try {
        if (typeof window === "undefined") return;

        const cacheKey = `${CACHE_PREFIX}${key}`;
        const cacheItem = {
            data,
            timestamp: Date.now(),
        };

        window.localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
        console.log("Cache set for key:", key);
    } catch (error) {
        console.error("Cache set error:", error);
    }
};

/**
 * Clear specific cache entry
 * @param {string} key - Cache key identifier
 */
export const clearCache = (key) => {
    try {
        if (typeof window === "undefined") return;

        const cacheKey = `${CACHE_PREFIX}${key}`;
        window.localStorage.removeItem(cacheKey);
        console.log("Cache cleared for key:", key);
    } catch (error) {
        console.error("Cache clear error:", error);
    }
};

/**
 * Clear all GitHub cache entries
 */
export const clearAllGitHubCache = () => {
    try {
        if (typeof window === "undefined") return;

        const keys = Object.keys(window.localStorage);
        keys.forEach((key) => {
            if (key.startsWith(CACHE_PREFIX)) {
                window.localStorage.removeItem(key);
            }
        });
        console.log("All GitHub cache cleared");
    } catch (error) {
        console.error("Clear all cache error:", error);
    }
};