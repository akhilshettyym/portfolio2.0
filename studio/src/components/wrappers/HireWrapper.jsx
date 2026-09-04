"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useRouter, usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

const BUTTON_REVEAL_DELAY = 10000;

export default function HireWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

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

  const hireButtonTheme =
    normalizedTheme === "dark"
      ? "bg-white text-black border-black"
      : normalizedTheme === "metal"
        ? "bg-red-600 text-black border-black"
        : "bg-black text-white border-white";

  const handleHireClick = () => {
    router.push("/start");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto fixed bottom-20 left-6 z-99999">
      <button
        type="button"
        onClick={handleHireClick}
        aria-label="Hire me"
        className={`flex w-10 flex-col items-center justify-center gap-1 border py-4 text-[10px] font-bold uppercase rounded-3xl tracking-widest transition-transform duration-150 ease-out hover:scale-105 ${hireButtonTheme}`}>
        <span className="[writing-mode:vertical-rl] rotate-180">HIRE</span>
      </button>
    </motion.div>
  );
}
