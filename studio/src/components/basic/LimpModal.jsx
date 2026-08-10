"use client";

import { useEffect, useState } from "react";
import { LIMP_BANNER } from "@/utils/storage";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "@/components/basic/CustomButton";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

export default function LimpModal() {
  const { theme } = useTheme();
  const { isTier2 } = usePerformanceTier();
  const [isOpen, setIsOpen] = useState(false);

  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  useEffect(() => {
    const hasShown = localStorage.getItem(LIMP_BANNER);
    if (hasShown === "true") return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isTier2]);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem(LIMP_BANNER, "true");
  };

  const styles = {
    modalBox: isDark
      ? "bg-[#0a0a0a] border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.5)]"
      : isMetal
        ? "bg-black border-red-500/20 shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
        : "bg-white border-neutral-200 shadow-[0_25px_80px_rgba(0,0,0,0.08)]",

    title: isDark ? "text-white" : isMetal ? "text-red-500" : "text-black",
    description: isDark ? "text-white/60" : isMetal ? "text-red-500/70" : "text-gray-500",

    line1: isMetal ? "via-red-500" : "via-cyan-500",
    line2: isMetal ? "via-red-800" : "via-purple-500",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={handleDismiss} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`relative mx-5 w-full max-w-md overflow-hidden border p-5 z-10 transition-colors duration-500 ${styles.modalBox}`}>
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                animate={{ opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 5, repeat: Infinity, repeatDelay: 2 }}
                className={`absolute top-0 h-px w-full bg-linear-to-r from-transparent ${styles.line1} to-transparent`}
              />

              <motion.div
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 5, repeat: Infinity, repeatDelay: 2.3 }}
                className={`absolute bottom-[36%] h-px w-full bg-linear-to-r from-transparent ${styles.line2} to-transparent`}
              />
            </div>

            <div className="relative z-10">
              <div className="mb-2">
                <div
                  className={`text-lg font-extrabold uppercase tracking-wide transition-colors duration-500 ${styles.title}`}>
                  Limp Mode
                </div>
              </div>

              <div className="mb-5 space-y-3 text-justify">
                <p className={`text-sm transition-colors duration-500 ${styles.description}`}>
                  Hey! To keep everything running lightning-fast on your device, we&apos;ve dialed back a few of the
                  heavier visual effects. Enjoy a smooth, seamless ride!
                </p>
              </div>

              <div className="w-full pt-2 sm:w-auto flex justify-end">
                <CustomButton title="Got it" onClick={handleDismiss} width={180} height={40} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
