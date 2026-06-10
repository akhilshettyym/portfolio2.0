import { Moon } from "lunarphase-js";
import { WEATHER_CODES, CACHE_KEY, LOCATION_MODE_KEY, CACHE_TTL_MS } from "../../utils/basic-utils";

function getMoonVariant() {
    const phase = Moon.lunarPhase();
    switch (phase) {
        case "New Moon":
            return "NEW_MOON";
        case "Waxing Crescent":
        case "Waning Crescent":
            return "CRESCENT";
        case "First Quarter":
        case "Last Quarter":
            return "HALF_MOON";
        case "Waxing Gibbous":
        case "Waning Gibbous":
        case "Full Moon":
        default:
            return "FULL_MOON";
    }
}

function getWeatherCondition(weatherCode) {
    if (WEATHER_CODES.STORM.includes(weatherCode)) return "storm";
    if (WEATHER_CODES.RAIN.includes(weatherCode)) return "rain";
    if (WEATHER_CODES.SNOW.includes(weatherCode)) return "snow";
    if (WEATHER_CODES.MIST.includes(weatherCode)) return "mist";
    return "clear";
}

function getTimeBand(now, sunrise, sunset) {
    const HOUR = 60 * 60 * 1000;
    const sunriseTime = new Date(sunrise).getTime();
    const sunsetTime = new Date(sunset).getTime();
    const currentTime = now.getTime();
    const isDawn = currentTime >= sunriseTime && currentTime < sunriseTime + HOUR;
    const isGoldenHour = currentTime >= sunsetTime - HOUR && currentTime < sunsetTime;
    const isSunset = currentTime >= sunsetTime && currentTime < sunsetTime + HOUR;
    const isNight = currentTime > sunsetTime + HOUR || currentTime < sunriseTime;

    if (isNight) return "night";
    if (isDawn) return "dawn";
    if (isGoldenHour) return "golden_hour";
    if (isSunset) return "sunset";

    return now.getHours() < 12 ? "morning" : "afternoon";
}

function resolveScene(weather) {
    const now = new Date();
    const { cloudCover = 0, weatherCode, sunrise, sunset } = weather;
    const timeBand = getTimeBand(now, sunrise, sunset);
    const condition = getWeatherCondition(weatherCode);

    const cloudy = Number(cloudCover) > 40;
    let backgroundKey = "morning_clear";

    switch (timeBand) {
        case "dawn":
            backgroundKey = cloudy ? "dawn_overcast" : "dawn_clear";
            break;

        case "morning":
            backgroundKey = cloudy ? "morning_cloudy" : "morning_clear";
            break;

        case "afternoon":
            backgroundKey = cloudy ? "afternoon_cloudy" : "afternoon_clear";
            break;

        case "golden_hour":
            backgroundKey = "golden_hour";
            break;

        case "sunset":
            backgroundKey = "sunset";
            break;

        case "night":
            backgroundKey = "night";
            break;

        default:
            backgroundKey = "morning_clear";
    }

    let cloudKey = backgroundKey;

    if (condition === "storm") {
        cloudKey = "storm";

    } else if (condition === "rain") {
        cloudKey = "rain";
    }
    return {
        backgroundKey, cloudKey, timeBand, condition,
    };
}

async function fetchWeather(latitude, longitude) {
    const url = new URL(`${process.env.LOCATION_FROM_OPEN_METEO_API}`);
    url.searchParams.set("latitude", latitude);
    url.searchParams.set("longitude", longitude);
    url.searchParams.set("current", "temperature_2m,weather_code,is_day,cloud_cover,wind_speed_10m");
    url.searchParams.set("daily", "sunrise,sunset");
    url.searchParams.set("timezone", "auto");

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error("Failed to fetch weather");
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
    return new Promise(
        (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000,
                }
            );
        }
    );
}

async function getLocationFromIP() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(`${process.env.LOCATION_FROM_IP}`, { signal: controller.signal });

        if (!response.ok) {
            throw new Error("IP lookup failed");
        }

        const data = await response.json();

        return {
            latitude: data.latitude,
            longitude: data.longitude,
        };

    } finally {
        clearTimeout(timeout);
    }
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
        } catch {
            console.warn("GPS failed. Falling back to IP.");
            return await getLocationFromIP();
        }
    }
    return await getLocationFromIP();
}

function readCachedScene() {
    if (typeof window === "undefined")
        return null;

    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;

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
    if (typeof window === "undefined")
        return;

    try {
        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
                timestamp: Date.now(),
                data,
            })
        );
    } catch { }
}

export function setLocationMode(mode) {
    localStorage.setItem(LOCATION_MODE_KEY, mode);
    localStorage.removeItem(CACHE_KEY);
}

export function getLocationMode() {
    return localStorage.getItem(LOCATION_MODE_KEY);
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

        const scene = resolveScene(weather);
        const moonPhase = scene.timeBand === "night" ? getMoonVariant() : null;

        const result = {
            success: true,
            scene: scene.timeBand,
            backgroundKey: scene.backgroundKey,
            cloudKey: scene.cloudKey,
            moonPhase,
            weather,
        };

        writeCachedScene(result);
        return result;

    } catch (error) {
        console.error(error);
        const cached = readCachedScene();

        if (cached) {
            return cached;
        }

        return {
            success: false,
            scene: "morning",
            backgroundKey: "morning_clear",
            cloudKey: "morning_clear",
            moonPhase: null,
            weather: null,
        };
    }
}