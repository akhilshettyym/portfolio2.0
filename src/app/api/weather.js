// services/weather.js

export async function fetchWeather(latitude, longitude) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,cloud_cover,weather_code,is_day,wind_speed_10m&daily=sunrise,sunset&timezone=auto`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch weather");
        }

        const data = await response.json();

        return {
            temperature: data.current.temperature_2m,
            cloudCover: data.current.cloud_cover,
            weatherCode: data.current.weather_code,
            isDay: data.current.is_day === 1,
            windSpeed: data.current.wind_speed_10m,
            sunrise: data.daily.sunrise?.[0],
            sunset: data.daily.sunset?.[0],
        };
    } catch (error) {
        console.error("Weather fetch failed:", error);

        return null;
    }
}


async function loadWeather() {
    navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
            const weather = await fetchWeather(
                coords.latitude,
                coords.longitude
            );

            console.log(weather);
        },
        (error) => {
            console.error(error);
        }
    );
}


const data = loadWeather();
console.log("DATA", data)