"use client";

import { motion } from "framer-motion";
import { getWeatherIconData } from "@/app/api/weather/route";
import { WiMoonAltNew, WiMoonAltWaxingCrescent3, WiMoonAltFirstQuarter, WiMoonAltFull } from "react-icons/wi";
import { TiWeatherCloudy, TiWeatherNight, TiWeatherPartlySunny, TiWeatherShower, TiWeatherStormy, TiWeatherSunny } from "react-icons/ti";

const WeatherIcon = () => {
    const data = getWeatherIconData();
    const moonPhase = data?.getMoonPhase;
    const sceneCondition = data?.getSceneCondition;

    const weatherMap = {
        clear: {
            icon: TiWeatherSunny,
            label: "Clear Sky",
        },

        cloudy: {
            icon: TiWeatherCloudy,
            label: "Cloudy",
        },

        rain: {
            icon: TiWeatherShower,
            label: "Rain",
        },

        storm: {
            icon: TiWeatherStormy,
            label: "Thunderstorm",
        },

        sunset: {
            icon: TiWeatherPartlySunny,
            label: "Sunset",
        },

        night: {
            icon: TiWeatherNight,
            label: "Night",
        },
    };

    const moonMap = {
        NEW_MOON: {
            icon: WiMoonAltNew,
            label: "New Moon",
        },

        CRESCENT: {
            icon: WiMoonAltWaxingCrescent3,
            label: "Crescent Moon",
        },

        HALF_MOON: {
            icon: WiMoonAltFirstQuarter,
            label: "Half Moon",
        },

        FULL_MOON: {
            icon: WiMoonAltFull,
            label: "Full Moon",
        },
    };

    const WeatherGlyph = weatherMap[sceneCondition]?.icon || TiWeatherSunny;
    const MoonGlyph = moonMap[moonPhase]?.icon || WiMoonAltFull;
    const weatherLabel = weatherMap[sceneCondition]?.label || "Weather";
    const moonLabel = moonMap[moonPhase]?.label || "Moon";

    return (
        <div className="group relative">

            <div className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-black/10 px-3 py-1.5 text-[11px] font-medium text-black/80 opacity-0 translate-x-2 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                {weatherLabel} • {moonLabel}
            </div>

            <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="flex h-[72px] w-[42px] flex-col items-center justify-between rounded-full border border-black/10 bg-white/55 px-2 py-2 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)]">

                <motion.div animate={{ rotate: sceneCondition === "storm" ? [-5, 5, -5] : 0 }} transition={{ duration: 1.5, repeat: sceneCondition === "storm" ? Infinity : 0 }}>
                    <WeatherGlyph ize={20} className="text-black" />
                </motion.div>

                <div className="h-px w-4 bg-black/15" />

                <motion.div animate={{ y: moonPhase === "FULL_MOON" ? [0, -1, 0] : 0 }}
                    transition={{ duration: 2.5, repeat: Infinity }}>
                    <MoonGlyph size={22} className="text-black" />
                </motion.div>

            </motion.div>
        </div>
    );
};

export default WeatherIcon;