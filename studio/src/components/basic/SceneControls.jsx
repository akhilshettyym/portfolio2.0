"use client";

import Image from "next/image";
import "@/styles/scene-controls.css";
import { WiMoonAltFull } from "react-icons/wi";
import { SiRevealdotjs } from "react-icons/si";
import { TiWeatherSunny } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";
import { MOON_MAP, WEATHER_MAP } from "@/utils/basic";
import { HiMiniPause, HiMiniPlay } from "react-icons/hi2";
import { getWeatherIconData } from "@/utils/weather-scene";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CONTROL_RADIUS, SCENE_CONTROLS, CONTROL_TRANSITION, REVEAL_TRANSITION } from "@/utils/basic";

function getControlPosition(angle, radius = CONTROL_RADIUS) {
  const radians = (angle * Math.PI) / 180;

  return {
    x: Math.cos(radians) * radius,
    y: Math.sin(radians) * radius,
  };
}

export default function SceneControls({
  paused,
  isTier2,
  handleCloudControl,
  handleRestartIntroScene,
  sceneAssets,
  open: controlledOpen,
  triggerCover = "/album.svg",
  reveal = false,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : Boolean(sceneAssets) && internalOpen;

  const weatherData = getWeatherIconData();

  const moonPhase = weatherData?.getMoonPhase;
  const sceneCondition = weatherData?.getSceneCondition;

  const WeatherGlyph = WEATHER_MAP[sceneCondition]?.icon || TiWeatherSunny;
  const MoonGlyph = MOON_MAP[moonPhase]?.icon || WiMoonAltFull;

  const weatherLabel = WEATHER_MAP[sceneCondition]?.label || "Weather";
  const moonLabel = MOON_MAP[moonPhase]?.label || "Moon";

  useEffect(() => {
    if (isControlled) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setInternalOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isControlled]);

  const cloudsLabel = isTier2 ? "Disabled" : paused ? "Run Clouds" : "Stall Clouds";

  const handleToggle = (event) => {
    event.stopPropagation();

    if (!isControlled) {
      setInternalOpen((value) => !value);
    }
  };

  const getControl = (id) => SCENE_CONTROLS.find((control) => control.id === id);

  const renderControl = (id, content) => {
    const config = getControl(id);

    if (!config) {
      return null;
    }

    const position = getControlPosition(config.angle);

    return (
      <motion.div
        key={id}
        initial={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
        animate={{ opacity: 1, x: position.x, y: position.y, scale: 1 }}
        exit={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
        transition={{ ...CONTROL_TRANSITION, delay: config.delay }}
        className="pointer-events-auto absolute top-1/2 left-1/2">
        <div className="-translate-x-1/2 -translate-y-1/2">{content}</div>
      </motion.div>
    );
  };

  return (
    <motion.div
      ref={containerRef}
      initial={reveal ? { opacity: 0, y: shouldReduceMotion ? 0 : -6, scale: shouldReduceMotion ? 1 : 0.96 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={reveal && !shouldReduceMotion ? REVEAL_TRANSITION : { duration: 0 }}
      className="pointer-events-auto fixed top-32 right-11 z-99999 h-8 w-8">
      <AnimatePresence>
        {open && (
          <>
            {renderControl(
              "clouds",
              <ControlButton
                label={cloudsLabel}
                labelPlacement={getControl("clouds")?.labelPlacement}
                icon={paused ? <HiMiniPlay size={15} className="translate-x-[0.5px]" /> : <HiMiniPause size={15} />}
                disabled={isTier2}
                onClick={handleCloudControl}
              />,
            )}

            {renderControl(
              "intro",
              <ControlButton
                label="Run Intro"
                labelPlacement={getControl("intro")?.labelPlacement}
                icon={<SiRevealdotjs size={14} />}
                onClick={handleRestartIntroScene}
              />,
            )}

            {sceneAssets &&
              renderControl(
                "weather",
                <WeatherControl
                  label={weatherLabel}
                  labelPlacement={getControl("weather")?.labelPlacement}
                  icon={
                    <motion.span
                      animate={{ rotate: sceneCondition === "storm" ? [-6, 6, -6] : 0 }}
                      transition={{
                        duration: 1.2,
                        repeat: sceneCondition === "storm" ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                      className="pointer-events-none flex items-center justify-center text-slate-700 transition-colors group-hover:text-slate-950">
                      <WeatherGlyph size={16} />
                    </motion.span>
                  }
                />,
              )}

            {sceneAssets &&
              renderControl(
                "moon",
                <WeatherControl
                  label={moonLabel}
                  labelPlacement={getControl("moon")?.labelPlacement}
                  icon={
                    <motion.span
                      animate={{ y: moonPhase === "FULL_MOON" ? [0, -1.5, 0] : 0 }}
                      transition={{
                        duration: 2.2,
                        repeat: moonPhase === "FULL_MOON" ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                      className="pointer-events-none flex items-center justify-center text-slate-700 transition-colors group-hover:text-slate-950">
                      <MoonGlyph size={16} />
                    </motion.span>
                  }
                />,
              )}
          </>
        )}
      </AnimatePresence>

      {!isControlled && (
        <div
          role="button"
          tabIndex={0}
          aria-label={open ? "Close scene controls" : "Open scene controls"}
          aria-expanded={open}
          onClick={handleToggle}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleToggle(event);
            }
          }}
          className={`album mini absolute top-1/2 left-1/2 z-100 -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none ${open ? "open" : ""}`}>
          <div className="album-cover">
            <Image src={triggerCover} alt="" width={100} height={100} />
          </div>

          <div className="album-vinyl">
            <div className="vinyl-cover" style={{ backgroundImage: `url("${triggerCover}")` }} />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ControlButton({ label, labelPlacement = "bottom", icon, disabled = false, onClick }) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        if (!disabled) {
          onClick();
        }
      }}
      whileHover={!disabled ? { scale: 1.12 } : undefined}
      whileTap={!disabled ? { scale: 0.92 } : undefined}
      transition={{ type: "spring", stiffness: 450, damping: 22 }}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full outline-none disabled:cursor-not-allowed disabled:opacity-30">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-700 shadow-[0_8px_20px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-150 ease-out group-hover:border-white group-hover:bg-white group-hover:text-slate-950 group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.14)]">
        {icon}
      </span>

      <ControlLabel label={label} labelPlacement={labelPlacement} />
    </motion.button>
  );
}

function WeatherControl({ icon, label, labelPlacement = "bottom" }) {
  return (
    <div className="group relative flex h-10 w-10 items-center justify-center">
      <motion.div
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 450, damping: 22 }}
        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-700 shadow-[0_8px_20px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-150 ease-out group-hover:border-white group-hover:bg-white group-hover:text-slate-950 group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.14)]">
        {icon}
      </motion.div>

      <ControlLabel label={label} labelPlacement={labelPlacement} />
    </div>
  );
}

function ControlLabel({ label, labelPlacement }) {
  const placementClass =
    labelPlacement === "left" ? "right-full top-1/2 mr-2 -translate-y-1/2" : "top-full left-1/2 mt-1 -translate-x-20";

  return (
    <div
      className={`pointer-events-auto absolute z-100 opacity-0 transition-all duration-150 ease-out group-hover:opacity-100 ${placementClass}`}>
      <span className="inline-flex w-19 items-center justify-center whitespace-nowrap rounded-full border border-white/80 bg-white/85 px-2 py-1 text-[8px] font-bold tracking-normal text-slate-800 uppercase shadow-[0_6px_16px_rgba(0,0,0,0.08)] backdrop-blur-md">
        {label}
      </span>
    </div>
  );
}
