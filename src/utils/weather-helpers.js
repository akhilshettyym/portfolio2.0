import { Moon } from "lunarphase-js";
import { WEATHER_CODES } from "./basic-utils";

export function getMoonVariant() {
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

        default:
            return "FULL_MOON";
    }
}

export function getWeatherCondition(weatherCode) {
    if (WEATHER_CODES.STORM.includes(weatherCode))
        return "storm";

    if (WEATHER_CODES.RAIN.includes(weatherCode))
        return "rain";

    if (WEATHER_CODES.SNOW.includes(weatherCode))
        return "snow";

    if (WEATHER_CODES.MIST.includes(weatherCode))
        return "mist";

    return "clear";
}

export function getTimeBand(now, sunrise, sunset) {
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

export function resolveScene(weather) {
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
    }

    let cloudKey = backgroundKey;

    if (condition === "storm")
        cloudKey = "storm";

    if (condition === "rain")
        cloudKey = "rain";

    return { backgroundKey, cloudKey, timeBand, condition };
}