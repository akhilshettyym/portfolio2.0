"use client";

import { motion } from "framer-motion";
import { WiMoonAltFull } from "react-icons/wi";
import { TiWeatherSunny } from "react-icons/ti";
import { MOON_MAP, WEATHER_MAP } from "@/utils/basic";
import { getWeatherIconData } from "@/utils/weather-scene";

export default function WeatherIcon() {
    const data = getWeatherIconData();
    const moonPhase = data?.getMoonPhase;
    const sceneCondition = data?.getSceneCondition;

    const WeatherGlyph = WEATHER_MAP[sceneCondition]?.icon || TiWeatherSunny;
    const MoonGlyph = MOON_MAP[moonPhase]?.icon || WiMoonAltFull;
    const weatherLabel = WEATHER_MAP[sceneCondition]?.label || "Weather";
    const moonLabel = MOON_MAP[moonPhase]?.label || "Moon";

    return (
        <div className="group relative flex justify-center">
            <motion.div whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="flex h-15 w-8 flex-col items-center justify-between rounded-full border border-black/10 bg-white/55 px-2 py-2 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)]">

                <motion.div animate={{ rotate: sceneCondition === "storm" ? [-5, 5, -5] : 0 }}
                    transition={{ duration: 1.5, repeat: sceneCondition === "storm" ? Infinity : 0 }}>
                    <WeatherGlyph size={18} className="text-black/50" />
                </motion.div>

                <div className="h-px w-4 bg-black/15" />

                <motion.div animate={{ y: moonPhase === "FULL_MOON" ? [0, -1, 0] : 0 }}
                    transition={{ duration: 2.5, repeat: Infinity }}>
                    <MoonGlyph size={18} className="text-black/50" />
                </motion.div>
            </motion.div>

            <div className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-transparent border border-white/0 backdrop-blur-xl px-3.5 py-1.5 text-[10px] font-medium text-black/50 opacity-0 translate-x-0 transition-all duration-200 group-hover:-translate-x-3 group-hover:border-1 group-hover:border-slate-100 group-hover:opacity-100 z-[10000] shadow-xl uppercase">
                {weatherLabel} • {moonLabel}
            </div>
        </div>
    );
};