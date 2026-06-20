import { CACHE_KEY, LOCATION_MODE_KEY, CACHE_TTL_MS } from "./basic-utils";
import { getMoonVariant, resolveScene } from "./weather-helpers";

async function fetchWeather(latitude, longitude) {
    const response = await fetch(`/api/weather?latitude=${latitude}&longitude=${longitude}`,
        {
            cache: "no-store"
        }
    );

    if (!response.ok) {
        throw new Error("Weather fetch failed");
    }

    const data = await response.json();

    return {
        temperature: data.current?.temperature_2m,
        cloudCover: data.current?.cloud_cover,
        weatherCode: data.current?.weather_code,
        isDay: data.current?.is_day === 1,
        windSpeed: data.current?.wind_speed_10m,
        sunrise: data.daily?.sunrise?.[0],
        sunset: data.daily?.sunset?.[0],
    };
}

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            }
        );
    });
}

async function getLocationFromIP() {
    const response = await fetch("/api/location", {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("IP lookup failed");
    }

    const data = await response.json();

    return {
        latitude: data.latitude,
        longitude: data.longitude,
    };
}

async function getCoordinates() {
    const mode = localStorage.getItem(LOCATION_MODE_KEY) || "fast";

    if (mode === "accurate") {
        try {
            const position = await getCurrentPosition();

            return {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };

        } catch (error) {
            console.warn("GPS failed. Falling back to IP.", error);
            return await getLocationFromIP();
        }
    }

    return await getLocationFromIP();
}

function readCachedScene() {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const raw = localStorage.getItem(CACHE_KEY);

        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw);

        if (!parsed?.timestamp || !parsed?.data) {
            return null;
        }

        const age = Date.now() - parsed.timestamp;

        if (age > CACHE_TTL_MS) {
            return null;
        }

        return parsed.data;

    } catch {
        return null;
    }
}

function writeCachedScene(data) {
    if (typeof window === "undefined") {
        return;
    }

    try {
        localStorage.setItem(CACHE_KEY,
            JSON.stringify({
                timestamp: Date.now(),
                data,
            })
        );

    } catch (error) {
        console.error("Failed to cache weather scene", error);
    }
}

export function setLocationMode(mode) {
    localStorage.setItem(LOCATION_MODE_KEY, mode);
    localStorage.removeItem(CACHE_KEY);
}

export function getLocationMode() {
    return localStorage.getItem(LOCATION_MODE_KEY);
}

export function getWeatherIconData() {
    try {
        const rawData = localStorage.getItem(CACHE_KEY);

        if (!rawData) {
            return {
                getMoonPhase: "MOON",
                getSceneCondition: "SCENE",
            };
        }

        const parsedData = JSON.parse(rawData);
        const innerData = parsedData?.data;

        return {
            getMoonPhase: innerData?.renderMoonPhase || "MOON",
            getSceneCondition: innerData?.sceneCondition || "SCENE",
        };

    } catch {
        return {
            getMoonPhase: "MOON",
            getSceneCondition: "SCENE",
        };
    }
}

export async function getWeatherScene({ forceRefresh = false } = {}) {
    try {
        if (!forceRefresh) {
            const cached = readCachedScene();

            if (cached) {
                return cached;
            }
        }

        const { latitude, longitude } = await getCoordinates();
        const weather = await fetchWeather(latitude, longitude);
        const mode = localStorage.getItem(LOCATION_MODE_KEY) || "fast";
        const scene = resolveScene(weather);
        const sceneCondition = scene.condition;
        const renderMoonPhase = getMoonVariant();
        const moonPhase = scene.timeBand === "night" ? getMoonVariant() : null;

        const result = {
            success: true,
            scene: scene.timeBand,
            backgroundKey: scene.backgroundKey,
            cloudKey: scene.cloudKey,
            moonPhase,
            sceneCondition,
            renderMoonPhase,

            ...(mode === "accurate" && {
                weather,
            }),
        };

        writeCachedScene(result);
        return result;

    } catch (error) {
        console.error("Weather Scene Error:", error);
        const cached = readCachedScene();

        if (cached) {
            return cached;
        }

        return {
            success: false,
            scene: "morning",
            backgroundKey: "morning_clear",
            cloudKey: "morning_clear",
            sceneCondition: "CLEAR",
            renderMoonPhase: "MOON",
            moonPhase: null,
            weather: null,
        };
    }
}


export function hasLocationPreference() {
    return !!localStorage.getItem(LOCATION_MODE_KEY);
}