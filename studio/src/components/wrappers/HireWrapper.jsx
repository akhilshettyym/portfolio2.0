"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const BUTTON_REVEAL_DELAY = 10000;

export default function AvailableWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isInfoRoute = pathname === "/";

  useEffect(() => {
    if (!isInfoRoute) return;

    const revealTimer = window.setTimeout(() => {
      setMounted(true);
    }, BUTTON_REVEAL_DELAY);

    return () => {
      window.clearTimeout(revealTimer);
    };
  }, [isInfoRoute]);

  if (!isInfoRoute || !mounted) {
    return null;
  }

  const normalizedTheme = String(theme || "light").toLowerCase();

  const themeConfig = {
    dark: {
      dot: "bg-white ring-2 ring-neutral-900 shadow-[0_0_8px_rgba(255,255,255,0.8)]",
      avatarBorder: "border-neutral-700/80 shadow-black/60",
      tint: "bg-black/30",
      tooltip: "text-white",
    },
    metal: {
      dot: "bg-red-500 ring-2 ring-neutral-950 shadow-[0_0_8px_rgba(239,68,68,0.9)]",
      avatarBorder: "border-red-900/60 shadow-red-950/40",
      tint: "bg-red-950/20 mix-blend-color-burn",
      tooltip: "text-red-600",
    },
    light: {
      dot: "bg-black ring-2 ring-white shadow-[0_0_6px_rgba(0,0,0,0.5)]",
      avatarBorder: "border-neutral-200 shadow-neutral-900/15",
      tint: "bg-transparent",
      tooltip: "text-black",
    },
  };

  const currentTheme = themeConfig[normalizedTheme] || themeConfig.light;

  const handleAvailableClick = () => {
    router.push("/start");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto fixed bottom-20 left-6 z-99999">
      <div className="relative flex flex-col items-center">
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute bottom-full mb-3 whitespace-nowrap">
              <div
                className={`relative flex items-center text-xs font-bold [writing-mode:vertical-rl] rotate-180 uppercase tracking-wide ${currentTheme.tooltip}`}>
                <span> AVAILABLE </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={handleAvailableClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Available for work"
          className="group relative flex items-center justify-center rounded-full outline-none">
          <div
            className={`relative h-10 w-10 overflow-hidden rounded-full border-[1.5px] shadow-lg transition-transform duration-300 group-hover:scale-105 active:scale-95 ${currentTheme.avatarBorder}`}>
            <Image src="/socials/socials-6.jpg" alt="Status" fill unoptimized className="object-cover" />
            <div
              className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${currentTheme.tint}`}
            />
          </div>

          <span className="absolute bottom-0 right-0 z-10 flex h-3.5 w-3.5 items-center justify-center">
            <motion.span
              animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute h-full w-full rounded-full ${currentTheme.dot.split(" ")[0]}`}
            />
            <span className={`relative h-2.5 w-2.5 rounded-full ${currentTheme.dot}`} />
          </span>
        </button>
      </div>
    </motion.div>
  );
}
