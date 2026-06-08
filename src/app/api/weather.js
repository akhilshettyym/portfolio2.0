// // services/weather.js

// export async function fetchWeather(latitude, longitude) {
//     try {
//         const response = await fetch(
//             `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,cloud_cover,weather_code,is_day,wind_speed_10m&daily=sunrise,sunset&timezone=auto`
//         );

//         if (!response.ok) {
//             throw new Error("Failed to fetch weather");
//         }

//         const data = await response.json();

//         return {
//             temperature: data.current.temperature_2m,
//             cloudCover: data.current.cloud_cover,
//             weatherCode: data.current.weather_code,
//             isDay: data.current.is_day === 1,
//             windSpeed: data.current.wind_speed_10m,
//             sunrise: data.daily.sunrise?.[0],
//             sunset: data.daily.sunset?.[0],
//         };
//     } catch (error) {
//         console.error("Weather fetch failed:", error);

//         return null;
//     }
// }


// async function loadWeather() {
//     navigator.geolocation.getCurrentPosition(
//         async ({ coords }) => {
//             const weather = await fetchWeather(
//                 coords.latitude,
//                 coords.longitude
//             );

//             console.log(weather);
//         },
//         (error) => {
//             console.error(error);
//         }
//     );
// }


// const data = loadWeather();
// console.log("DATA", data)




// services/weather-scene.js

import { Moon } from "lunarphase-js";

const WEATHER_CODES = {
    RAIN: [51, 53, 55, 61, 63, 65, 80, 81, 82],
    STORM: [95, 96, 99]
};

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
            return "FULL_MOON";

        default:
            return "FULL_MOON";
    }
}

function resolveScene(weather) {
    const { cloudCover, weatherCode, sunrise, sunset } = weather;

    const now = new Date();

    const sunriseDate = new Date(sunrise);
    const sunsetDate = new Date(sunset);

    const currentTime = now.getTime();

    const sunriseTime = sunriseDate.getTime();
    const sunsetTime = sunsetDate.getTime();

    const HOUR = 60 * 60 * 1000;

    const isDawn = currentTime >= sunriseTime && currentTime < sunriseTime + HOUR;
    const isGoldenHour = currentTime >= sunsetTime - HOUR && currentTime < sunsetTime;
    const isSunset = currentTime >= sunsetTime && currentTime < sunsetTime + HOUR;
    const isNight = currentTime > sunsetTime + HOUR || currentTime < sunriseTime;
    const isMorning = !isNight && !isDawn && now.getHours() < 12;
    const isAfternoon = !isNight && !isMorning && !isGoldenHour && !isSunset;

    if (WEATHER_CODES.STORM.includes(weatherCode)) {
        return "STORM";
    }

    if (WEATHER_CODES.RAIN.includes(weatherCode)
    ) {
        return "RAIN";
    }

    if (isNight) {
        return "NIGHT";
    }

    if (isSunset) {
        return "SUNSET";
    }

    if (isGoldenHour) {
        return "GOLDEN_HOUR";
    }

    if (isDawn) {
        return cloudCover <= 40 ? "DAWN_CLEAR" : "DAWN_OVERCAST";
    }

    if (isMorning) {
        return cloudCover <= 40 ? "MORNING_CLEAR" : "MORNING_CLOUDY";
    }

    if (isAfternoon) {
        return cloudCover <= 40 ? "AFTERNOON_CLEAR" : "AFTERNOON_CLOUDY";
    }

    return "AFTERNOON_CLEAR";
}

async function fetchWeather(latitude, longitude) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,cloud_cover,weather_code,is_day,wind_speed_10m&daily=sunrise,sunset&timezone=auto`);

    if (!response.ok) {
        throw new Error(
            "Failed to fetch weather"
        );
    }

    const data = await response.json();

    return {
        temperature: data.current.temperature_2m,
        cloudCover: data.current.cloud_cover,
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day === 1,
        windSpeed: data.current.wind_speed_10m,
        sunrise: data.daily.sunrise?.[0],
        sunset: data.daily.sunset?.[0]
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
                    maximumAge: 300000
                }
            );
        }
    );
}

export async function getWeatherScene() {
    try {
        const position = await getCurrentPosition();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const weather = await fetchWeather(latitude, longitude);
        const scene = resolveScene(weather);
        const moonPhase = scene === "NIGHT" ? getMoonVariant() : null;

        return {
            success: true, scene, moonPhase, weather
        };

    } catch (error) {
        // console.error("Weather Scene Error:", error);

        return {
            success: false,
            scene: "AFTERNOON_CLEAR",
            moonPhase: null,
            weather: null
        };
    }
}