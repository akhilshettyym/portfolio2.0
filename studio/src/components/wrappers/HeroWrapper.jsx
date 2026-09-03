"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CLOUD_CONTROL } from "@/utils/storage";
import { useTheme } from "@/context/ThemeContext";
import { IoSettingsOutline } from "react-icons/io5";
import { motion, useReducedMotion } from "framer-motion";
import HeroSection from "@/components/sections/HeroSection";
import ControlModal from "@/components/modals/ControlModal";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const CONTROLS_REVEAL_DELAY = 10000;

function dispatchHeroEvent(name) {
  window.dispatchEvent(new CustomEvent(name));
}

function PersistentHeroControls({ visible }) {
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const { isTier2 } = usePerformanceTier();
  const { theme } = useTheme();

  useEffect(() => {
    const revealTimer = window.setTimeout(() => {
      setMounted(true);
    }, CONTROLS_REVEAL_DELAY);

    return () => {
      window.clearTimeout(revealTimer);
    };
  }, []);

  useEffect(() => {
    const syncCloudState = () => {
      window.setTimeout(() => {
        try {
          setPaused(window.localStorage.getItem(CLOUD_CONTROL) === "true");
        } catch {
          setPaused(false);
        }
      }, 0);
    };

    syncCloudState();

    window.addEventListener("storage", syncCloudState);
    window.addEventListener("hero-cloud-state", syncCloudState);

    return () => {
      window.removeEventListener("storage", syncCloudState);
      window.removeEventListener("hero-cloud-state", syncCloudState);
    };
  }, []);

  const handleCloudControl = () => {
    if (isTier2) {
      return;
    }

    dispatchHeroEvent("hero-toggle-clouds");
  };

  const handleRestartIntroScene = () => {
    dispatchHeroEvent("hero-restart-intro");
  };

  if (!mounted || !visible) {
    return null;
  }

  const normalizedTheme = String(theme || "light").toLowerCase();

  const settingsButtonTheme =
    normalizedTheme === "dark"
      ? "bg-white text-black border-black"
      : normalizedTheme === "metal"
        ? "bg-red-500 text-white border-black"
        : "bg-black text-white border-white";

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          y: shouldReduceMotion ? 0 : 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }
        }
        className="pointer-events-auto fixed bottom-6 left-6 z-99999">
        <div className="group relative inline-block">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            aria-label="Open site controls"
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-transform duration-150 ease-out hover:scale-105 ${settingsButtonTheme}`}>
            <IoSettingsOutline size={20} />
          </button>

          <div className="pointer-events-none absolute bottom-1/2 left-full ml-3 translate-y-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <span className="whitespace-nowrap border border-white/20 bg-black px-2 py-1 text-[10px] text-white">
              Site Controls
            </span>
          </div>
        </div>
      </motion.div>

      <ControlModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        paused={paused}
        isTier2={isTier2}
        handleCloudControl={handleCloudControl}
        handleRestartIntroScene={handleRestartIntroScene}
      />
    </>
  );
}

export default function PersistentHeroLayer() {
  const pathname = usePathname();

  const isInfoRoute = pathname === "/";

  return (
    <>
      <div
        aria-hidden={!isInfoRoute}
        style={{
          opacity: isInfoRoute ? 1 : 0,
          visibility: isInfoRoute ? "visible" : "hidden",
          transition: "opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), visibility 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="pointer-events-none fixed inset-0 z-0">
        <HeroSection active={isInfoRoute} />
      </div>

      <PersistentHeroControls visible={isInfoRoute} />
    </>
  );
}
