"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiShield } from "react-icons/fi";
import { useRouter } from "next/navigation";
import ModeSwitch from "../basic/ModeSwitch";
import { IoMdNuclear } from "react-icons/io";
import { WiMoonAltFull } from "react-icons/wi";
import { SiRevealdotjs } from "react-icons/si";
import { TiWeatherSunny } from "react-icons/ti";
import { AiOutlineClear } from "react-icons/ai";
import { useTheme } from "@/context/ThemeContext";
import { MOON_MAP, WEATHER_MAP } from "@/utils/basic";
import { GiRabbit, GiTortoise } from "react-icons/gi";
import { AnimatePresence, motion } from "framer-motion";
import { HiMiniPause, HiMiniPlay } from "react-icons/hi2";
import { getWeatherIconData } from "@/utils/weather-scene";
import { getControlModalStyles } from "@/utils/themeSwatch";
import { ASSET_CACHE, LOCATION_MODE, SCENE_CACHE } from "@/utils/storage";

export default function ControlModal({ open, onClose, paused, isTier2, handleCloudControl, handleRestartIntroScene }) {
  const router = useRouter();
  const { theme } = useTheme();

  const weatherData = getWeatherIconData();
  const moonPhase = weatherData?.getMoonPhase;
  const sceneCondition = weatherData?.getSceneCondition;

  const WeatherGlyph = WEATHER_MAP[sceneCondition]?.icon || TiWeatherSunny;
  const MoonGlyph = MOON_MAP[moonPhase]?.icon || WiMoonAltFull;
  const weatherLabel = WEATHER_MAP[sceneCondition]?.label || "Weather";
  const moonLabel = MOON_MAP[moonPhase]?.label || "Moon";
  const normalizedTheme = String(theme || "light").toLowerCase();

  const handleNavigation = () => {
    router.push("/privacy");
  };

  const handleResetScene = () => {
    try {
      localStorage.removeItem(SCENE_CACHE);
      localStorage.removeItem(ASSET_CACHE);
      localStorage.removeItem(LOCATION_MODE);

      const defaultAssets = {
        background: "morning_clear",
        clouds: "morning_clear",
      };

      localStorage.setItem(LOCATION_MODE, "denied");
      localStorage.setItem(ASSET_CACHE, JSON.stringify(defaultAssets));

      window.location.reload();
    } catch {
      console.error("data flush failed");
    }
  };

  const handleNuclearWipe = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error("Nuclear wipe failed", error);
    }
  };

  const themeStyles = getControlModalStyles;
  const styles = themeStyles[normalizedTheme] || themeStyles.light;

  const cloudsValue = isTier2 ? "Disabled" : paused ? "Paused" : "Running";
  const cloudsIcon = isTier2 ? <HiMiniPlay size={15} /> : paused ? <HiMiniPlay size={15} /> : <HiMiniPause size={15} />;
  const cloudsDescription = isTier2
    ? "Unavailable on this device due to system constraints."
    : paused
      ? "Resume the moving atmospheric cloud layer."
      : "Pause the moving atmospheric cloud layer.";

  const limpIcon = isTier2 ? <GiTortoise size={15} /> : <GiRabbit size={15} />;
  const limpLabel = isTier2 ? "Efficiency Mode" : "Performance Mode";
  const limpDescription = isTier2
    ? "Visuals automatically dialed back to ensure smooth operation on this device."
    : "Running optimally with uncompromised visual fidelity and high frame rates.";

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          className={`pointer-events-auto fixed inset-0 z-100000 flex items-center justify-center p-4 backdrop-blur-xs ${styles.overlay}`}>
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            onMouseDown={(event) => event.stopPropagation()}
            className={`flex w-full max-w-xl flex-col overflow-hidden border backdrop-blur-2xl ${styles.modal}`}>
            <div className={`shrink-0 flex items-start justify-between border-b px-5 py-3 ${styles.header}`}>
              <div>
                <h2 className={`text-sm font-bold uppercase tracking-tighter ${styles.title}`}>Site Controls</h2>
                <p className={`max-w-xs text-[10px] leading-4 ${styles.description}`}>
                  Manage active connections, environments, and data states.
                </p>
              </div>

              <div className="ml-35 mt-1.5">
                <ModeSwitch />
              </div>

              <button
                type="button"
                aria-label="Close site controls"
                onClick={onClose}
                className={`flex h-8 w-8 items-center justify-center border transition-colors ${styles.close}`}>
                <IoClose size={15} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2 sm:gap-2 sm:p-3">
              <ControlCard
                icon={cloudsIcon}
                value={cloudsValue}
                description={cloudsDescription}
                actionLabel="CONTROL"
                disabled={isTier2}
                onClick={handleCloudControl}
                styles={styles}
              />
              <ControlCard
                icon={limpIcon}
                value={limpLabel}
                description={limpDescription}
                actionLabel="STATUS"
                styles={styles}
              />
              <ControlCard
                icon={<SiRevealdotjs size={12} />}
                value="Run intro"
                description="Trigger a full cinematic replay of the opening scene animation."
                actionLabel="REPLAY"
                onClick={handleRestartIntroScene}
                styles={styles}
              />
              <ControlCard
                icon={<WeatherGlyph size={15} />}
                value={weatherLabel}
                description="Synchronized in real-time with your local atmospheric conditions."
                actionLabel="LIVE"
                styles={styles}
              />
              <ControlCard
                icon={<AiOutlineClear size={15} />}
                value="Erase data"
                description="Wipe custom scene preferences to restore the default layout state."
                actionLabel="WIPE"
                onClick={handleResetScene}
                styles={styles}
              />
              <ControlCard
                icon={<IoMdNuclear size={15} />}
                value="Purge Storage"
                description="Purge all local and session storage data, followed by a hard reset."
                actionLabel="PURGE"
                onClick={handleNuclearWipe}
                styles={styles}
              />
              <ControlCard
                icon={<MoonGlyph size={15} />}
                value={moonLabel}
                description="Live lunar phase tracking based on current astronomical data."
                actionLabel="PHASE"
                styles={styles}
              />
              <ControlCard
                icon={<FiShield size={15} />}
                value="Privacy Policy"
                description="Discover how I collect, manage, and secure the data you share with me."
                actionLabel="OPEN"
                onClick={handleNavigation}
                styles={styles}
              />
            </div>

            <div className={`shrink-0 flex items-center justify-end border-t px-5 py-2.5 ${styles.divider}`}>
              <div className={`flex items-center gap-2 text-[10px] ${styles.footer}`}>
                <span>Press</span>
                <span className={`border px-1.5 py-0.5 text-[9px] font-semibold uppercase ${styles.key}`}>esc</span>
                <span>to close</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ControlCard({ icon, value, description, actionLabel, disabled = false, onClick, styles }) {
  const isInteractive = !!onClick && !disabled;
  const Component = isInteractive ? "button" : "div";

  return (
    <Component
      type={isInteractive ? "button" : undefined}
      disabled={disabled}
      onClick={(event) => {
        if (!isInteractive) return;
        event.stopPropagation();
        onClick();
      }}
      className={`group flex min-h-22.5 flex-col justify-between border p-3 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40
      ${isInteractive ? `cursor-pointer ${styles.card}` : `cursor-default ${styles.cardStatic}`}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center border transition-transform duration-300
          ${isInteractive ? "group-hover:-rotate-3 group-hover:scale-105" : ""} ${styles.cardIcon}`}>
            {icon}
          </span>
          <span
            className={`truncate text-[10px] font-bold uppercase tracking-wide ${styles.cardValue || styles.title}`}>
            {value}
          </span>
        </div>

        {actionLabel && (
          <span
            className={`shrink-0 text-[9px] font-bold tracking-widest transition-opacity duration-200
          ${isInteractive ? "opacity-0 group-hover:opacity-100" : "opacity-40"} ${styles.cardText}`}>
            {actionLabel}
          </span>
        )}
      </div>

      <div className="mt-2">
        <div className={`text-[10px] leading-normal ${styles.cardText}`}>{description}</div>
      </div>
    </Component>
  );
}