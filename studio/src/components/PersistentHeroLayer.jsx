"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiMiniPause, HiMiniPlay } from "react-icons/hi2";
import { SiRevealdotjs } from "react-icons/si";

import HeroSection from "@/components/HeroSection";
import LiquidGlass from "@/components/basic/LiquidGlass";
import WeatherIcon from "@/components/basic/WeatherIcon";
import { CLOUD_CONTROL } from "@/utils/storage";

function dispatchHeroEvent(name) {
  window.dispatchEvent(new CustomEvent(name));
}

function PersistentHeroControls({ visible }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const syncCloudState = () => {
      setTimeout(() => {
        try {
          setPaused(
            window.localStorage.getItem(CLOUD_CONTROL) === "true"
          );
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

  if (!visible) return null;

  const toggleClouds = () => {
    dispatchHeroEvent("hero-toggle-clouds");
  };

  return (
    <div className="fixed right-0 top-60 z-45 pointer-events-auto">
      <LiquidGlass
        width="50px"
        height="180px"
        className="relative z-60 p-0 pointer-events-auto"
      >
        <button
          type="button"
          onClick={toggleClouds}
          aria-label={paused ? "Run clouds" : "Stall clouds"}
          className="
            group
            absolute
            left-1/2
            top-3
            z-70
            h-11
            w-11
            -translate-x-1/2
            cursor-pointer
            pointer-events-auto
          "
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative z-10 flex h-10 w-8 items-center justify-center rounded-full border border-white/10 bg-black/10 backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:border-white/30">
              {paused ? (
                <HiMiniPlay
                  size={14}
                  className="translate-x-[0.5px] text-black/50"
                />
              ) : (
                <HiMiniPause
                  size={14}
                  className="text-black/50"
                />
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute right-full top-1/2 z-100 mr-4 -translate-y-1/2 translate-x-3 whitespace-nowrap rounded-lg border border-white/0 bg-transparent px-3.5 py-1.5 text-[10px] font-medium uppercase text-black/50 opacity-0 backdrop-blur-xl shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:border-slate-100 group-hover:opacity-100">
            {paused ? "Run Clouds" : "Stall Clouds"}
          </div>
        </button>

        <button
          type="button"
          onClick={() => dispatchHeroEvent("hero-restart-intro")}
          aria-label="Run intro"
          className="
            group
            absolute
            left-1/2
            top-14
            z-70
            h-12
            w-12
            -translate-x-1/2
            cursor-pointer
            pointer-events-auto
          "
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/10 backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:border-white/30">
              <SiRevealdotjs
                size={15}
                className="translate-x-[0.5px] text-black/50"
              />
            </div>
          </div>

          <div className="pointer-events-none absolute right-full top-1/2 z-100 mr-4 -translate-y-1/2 translate-x-3 whitespace-nowrap rounded-lg border border-white/0 bg-transparent px-3.5 py-1.5 text-[10px] font-medium uppercase text-black/50 opacity-0 backdrop-blur-xl shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:border-slate-100 group-hover:opacity-100">
            Run Intro
          </div>
        </button>

        <div className="absolute bottom-3 left-1/2 z-70 -translate-x-1/2 pointer-events-auto">
          <WeatherIcon onClick={toggleClouds} />
        </div>
      </LiquidGlass>
    </div>
  );
}

export default function PersistentHeroLayer() {
  const pathname = usePathname();
  const isInfoRoute = pathname === "/";

  return (
    <>
      <motion.div
        aria-hidden={!isInfoRoute}
        initial={false}
        animate={{
          opacity: isInfoRoute ? 1 : 0,
          visibility: isInfoRoute ? "visible" : "hidden",
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <HeroSection active={isInfoRoute} />
      </motion.div>

      <PersistentHeroControls visible={isInfoRoute} />
    </>
  );
}