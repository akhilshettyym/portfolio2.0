"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiShield } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { WiMoonAltFull } from "react-icons/wi";
import { SiRevealdotjs } from "react-icons/si";
import { TiWeatherSunny } from "react-icons/ti";
import { AiOutlineClear } from "react-icons/ai";
import { useTheme } from "@/context/ThemeContext";
import { MOON_MAP, WEATHER_MAP } from "@/utils/basic";
import { AnimatePresence, motion } from "framer-motion";
import { HiMiniPause, HiMiniPlay } from "react-icons/hi2";
import { getWeatherIconData } from "@/utils/weather-scene";
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

  const themeStyles = {
    light: {
      modal: "bg-white/78 border-black/10 text-black shadow-[0_30px_80px_rgba(0,0,0,0.16)]",
      overlay: "bg-black/[0.08]",
      header: "border-black/10",
      title: "text-black",
      description: "text-black/45",
      close: "border-black/10 text-black/45 hover:bg-black/5 hover:text-black",
      card: "border-black/10 bg-black/[0.025] hover:bg-black/[0.055]",
      cardIcon: "border-black/10 bg-black/[0.035] text-black",
      cardText: "text-black/45",
      divider: "border-black/10",
      footer: "text-black/35",
      key: "border-black/10 bg-black/[0.04] text-black/55",
    },

    dark: {
      modal: "bg-black/78 border-white/15 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]",
      overlay: "bg-black/25",
      header: "border-white/10",
      title: "text-white",
      description: "text-white/45",
      close: "border-white/10 text-white/45 hover:bg-white/10 hover:text-white",
      card: "border-white/10 bg-white/[0.035] hover:bg-white/[0.07]",
      cardIcon: "border-white/10 bg-white/[0.05] text-white",
      cardText: "text-white/45",
      divider: "border-white/10",
      footer: "text-white/30",
      key: "border-white/10 bg-white/[0.05] text-white/55",
    },

    metal: {
      modal: "bg-red-950/78 border-red-300/20 text-white shadow-[0_30px_80px_rgba(80,0,0,0.42)]",
      overlay: "bg-black/25",
      header: "border-white/10",
      title: "text-white",
      description: "text-white/50",
      close: "border-white/10 text-white/45 hover:bg-white/10 hover:text-white",
      card: "border-white/10 bg-white/[0.045] hover:bg-white/[0.085]",
      cardIcon: "border-white/10 bg-white/[0.05] text-white",
      cardText: "text-white/45",
      divider: "border-white/10",
      footer: "text-white/35",
      key: "border-white/10 bg-white/[0.06] text-white/60",
    },
  };

  const styles = themeStyles[normalizedTheme] || themeStyles.light;

  const cloudsValue = isTier2 ? "Disabled" : paused ? "Paused" : "Running";

  const cloudsIcon = isTier2 ? <HiMiniPlay size={17} /> : paused ? <HiMiniPlay size={17} /> : <HiMiniPause size={17} />;

  const cloudsDescription = isTier2
    ? "Unavailable on this device"
    : paused
      ? "Resume the moving cloud layer"
      : "Pause the moving cloud layer";

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
          className={`pointer-events-auto fixed inset-0 z-100000 flex items-center justify-center p-4 backdrop-blur-[3px] ${styles.overlay}`}>
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 30,
            }}
            onMouseDown={(event) => event.stopPropagation()}
            className={`w-full max-w-90 border backdrop-blur-2xl ${styles.modal}`}>
            <div className={`flex items-start justify-between border-b px-4 py-4 ${styles.header}`}>
              <div>
                <h2 className={`text-sm font-semibold uppercase tracking-tighter ${styles.title}`}>Site Controls</h2>

                <p className={`max-w-65 text-[10px] leading-4 ${styles.description}`}>
                  Manage active connections or revoke permissions.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close site controls"
                onClick={onClose}
                className={`flex h-7 w-7 items-center justify-center border transition-colors ${styles.close}`}>
                <IoClose size={15} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-px bg-current/10">
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
                icon={<SiRevealdotjs size={16} />}
                value="Run intro"
                description="Replay the opening animation"
                actionLabel="REPLAY"
                onClick={handleRestartIntroScene}
                styles={styles}
              />

              <ControlCard
                icon={<WeatherGlyph size={17} />}
                value={weatherLabel}
                description="Live atmospheric condition"
                actionLabel="LIVE"
                styles={styles}
              />

              <ControlCard
                icon={<MoonGlyph size={18} />}
                value={moonLabel}
                description="Current lunar phase"
                actionLabel="PHASE"
                styles={styles}
              />

              <ControlCard
                icon={<AiOutlineClear size={16} />}
                value="Erase data"
                description="Wipe saved data and restore default scene (page reloads)."
                actionLabel="WIPE"
                onClick={handleResetScene}
                styles={styles}
              />

              <ControlCard
                icon={<FiShield size={16} />}
                value="Privacy Policy"
                description="Discover how I collect, manage, and secure the data you share with me."
                actionLabel="OPEN"
                onClick={handleNavigation}
                styles={styles}
              />
            </div>

            <div className={`flex items-center justify-end border-t px-4 py-1.5 ${styles.divider}`}>
              <div className={`flex items-center gap-1.5 text-[9px] ${styles.footer}`}>
                <span>Press</span>

                <span className={`border px-1.5 py-0.5 text-[8px] font-semibold uppercase ${styles.key}`}>esc</span>

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
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();

        if (!disabled && onClick) {
          onClick();
        }
      }}
      className={`group min-h-25 p-4 text-left transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-30 ${styles.card}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center border transition-transform duration-150 group-hover:scale-105 ${styles.cardIcon}`}>
            {icon}
          </span>

          <span className={`truncate text-[9px] font-semibold ${styles.cardText}`}>{value}</span>
        </div>

        {actionLabel && (
          <span
            className={`shrink-0 text-[8px] font-medium opacity-0 transition-opacity duration-150 group-hover:opacity-50 ${styles.cardText}`}>
            {actionLabel}
          </span>
        )}
      </div>

      <div className="mt-2.5">
        <div className={`text-[8px] leading-3 ${styles.cardText}`}>{description}</div>
      </div>
    </button>
  );
}
