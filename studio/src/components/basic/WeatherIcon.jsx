"use client";

import { motion } from "framer-motion";
import { WiMoonAltFull } from "react-icons/wi";
import { TiWeatherSunny } from "react-icons/ti";
import { MOON_MAP, WEATHER_MAP } from "@/utils/basic";
import { getWeatherIconData } from "@/utils/weather-scene";

export default function WeatherIcon({ onClick }) {
  const data = getWeatherIconData();

  const moonPhase = data?.getMoonPhase;
  const sceneCondition = data?.getSceneCondition;
  const WeatherGlyph = WEATHER_MAP[sceneCondition]?.icon || TiWeatherSunny;
  const MoonGlyph = MOON_MAP[moonPhase]?.icon || WiMoonAltFull;
  const weatherLabel = WEATHER_MAP[sceneCondition]?.label || "Weather";
  const moonLabel = MOON_MAP[moonPhase]?.label || "Moon";

  return (
    <div className="group relative z-70 flex justify-center pointer-events-auto">
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={`${weatherLabel}, ${moonLabel}. Toggle clouds`}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 18,
        }}
        className="relative z-70 flex h-15 w-8 cursor-pointer flex-col items-center justify-between rounded-full border border-black/10 bg-black/10 px-2 py-2 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20">
        <motion.span
          animate={{
            rotate: sceneCondition === "storm" ? [-5, 5, -5] : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: sceneCondition === "storm" ? Infinity : 0,
          }}
          className="pointer-events-none flex items-center justify-center">
          <WeatherGlyph size={18} className="text-black/50" />
        </motion.span>

        <span className="pointer-events-none h-px w-4 bg-black/15" />

        <motion.span
          animate={{
            y: moonPhase === "FULL_MOON" ? [0, -1, 0] : 0,
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
          }}
          className="pointer-events-none flex items-center justify-center">
          <MoonGlyph size={18} className="text-black/50" />
        </motion.span>
      </motion.button>

      <div className="pointer-events-none absolute right-full top-1/2 z-100 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/0 bg-transparent px-3.5 py-1.5 text-[10px] font-medium uppercase text-black/50 opacity-0 backdrop-blur-xl shadow-xl transition-all duration-200 group-hover:-translate-x-3 group-hover:border-slate-100 group-hover:opacity-100">
        {weatherLabel} • {moonLabel}
      </div>
    </div>
  );
}
