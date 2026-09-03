"use client";

import { useTheme } from "@/context/ThemeContext";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function ThemeWrapper({ children }) {
  const { theme } = useTheme();
  const previousThemeRef = useRef(theme);
  const shouldReduceMotion = useReducedMotion();
  const [themeTransitionActive, setThemeTransitionActive] = useState(false);

  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  useEffect(() => {
    if (isDark) {
      document.body.className = "bg-[#0a0a0a] text-white transition-colors duration-500";
    } else if (isMetal) {
      document.body.className = "bg-[#050000] text-red-500 transition-colors duration-500";
    } else {
      document.body.className = "bg-white text-black transition-colors duration-500";
    }
  }, [isDark, isMetal]);

  useEffect(() => {
    if (previousThemeRef.current === theme) return;

    previousThemeRef.current = theme;
    setThemeTransitionActive(true);

    const timeout = window.setTimeout(
      () => {
        setThemeTransitionActive(false);
      },
      shouldReduceMotion ? 180 : 620,
    );

    return () => window.clearTimeout(timeout);
  }, [shouldReduceMotion, theme]);

  const mainThemeClass = isDark
    ? "bg-[#0a0a0a] text-white"
    : isMetal
      ? "bg-[#050000] text-red-500"
      : "bg-white text-black";

  return (
    <main
      id="main-content"
      className={`relative pt-25 flex flex-col min-h-screen transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${mainThemeClass}`}>
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: themeTransitionActive ? 0.18 : 0 }}
        transition={{ duration: shouldReduceMotion ? 0.18 : 0.62, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-0 z-40 bg-current mix-blend-difference"
      />
      {children}
    </main>
  );
}
