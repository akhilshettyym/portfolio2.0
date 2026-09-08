"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { getScrollProStyles } from "@/utils/swatch";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollProgress() {
  const { theme } = useTheme();

  const [progress, setProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let ticking = false;
    let scrollTimeout;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        setProgress(100);
        return;
      }

      const percentage = (scrollTop / scrollableHeight) * 100;
      setProgress(Math.min(100, Math.max(0, percentage)));
    };

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 120);

      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
    };

    updateProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateProgress);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const currentTheme = getScrollProStyles[theme] || getScrollProStyles.light;
  const formattedProgress = Math.round(progress).toString().padStart(3, "0");

  return (
    <div
      className="fixed top-30 right-5 z-[60] flex flex-col items-end gap-2 select-none"
      aria-hidden="true"
      style={{
        "--progress-color": currentTheme.primary,
        "--progress-track": currentTheme.track,
        "--progress-glow": currentTheme.glow,
      }}>
      <div className="flex items-center gap-2">
        <div className="relative h-15 w-5 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={formattedProgress}
              initial={{ y: 8, opacity: 0, filter: "blur(3px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -8, opacity: 0, filter: "blur(3px)" }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-medium tracking-wide tabular-nums [writing-mode:vertical-rl] rotate-180"
              style={{ color: currentTheme.primary }}>
              {formattedProgress}%
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="relative flex h-15 w-[3px] items-center justify-center">
          <div className="absolute inset-0 rounded-full" style={{ background: currentTheme.track }} />
          <div className="absolute inset-0 flex flex-col justify-between py-0.5">
            {[0, 1, 2, 3, 4].map((tick) => (
              <span
                key={tick}
                className="absolute right-1/2 h-px w-[5px] translate-x-1/2"
                style={{ background: currentTheme.secondary }}
              />
            ))}
          </div>
          <motion.div
            className="absolute top-0 left-0 w-full origin-top rounded-full"
            animate={{ height: `${progress}%` }}
            transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.45 }}
            style={{ background: currentTheme.primary, boxShadow: `0 0 8px ${currentTheme.glow}` }}
          />
          <motion.div
            className="absolute left-1/2 z-10 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
            animate={{
              top: `${Math.max(0, Math.min(100, progress))}%`,
              scale: isScrolling ? [1, 1.35, 1] : 1,
            }}
            transition={{
              top: { type: "spring", stiffness: 220, damping: 28, mass: 0.35 },
              scale: { duration: 0.7, repeat: isScrolling ? Infinity : 0, ease: "easeInOut" },
            }}
            style={{ background: currentTheme.primary, boxShadow: `0 0 7px ${currentTheme.glow}` }}
          />
        </div>
      </div>
    </div>
  );
}
