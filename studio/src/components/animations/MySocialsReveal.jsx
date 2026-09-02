"use client";

import { useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useDeviceType } from "@/hooks/useDeviceType";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import MySocialsTiered from "@/components/Tiered/MySocialsTiered";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

export default function MySocialsReveal() {
  const sectionRef = useRef(null);
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const { isMobile } = useDeviceType();
  const { isTier2 } = usePerformanceTier();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 20,
    mass: 0.5,
  });

  const scale = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 1.4]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(smoothProgress, [0, 0.3, 0.7, 1], ["10%", "0%", "0%", "-10%"]);
  const filter = useTransform(smoothProgress, [0, 0.3, 0.7, 1], ["blur(16px)", "blur(0px)", "blur(0px)", "blur(16px)"]);

  if (isTier2 || isMobile) {
    return null;
  }

  const useVerticalFallback = shouldReduceMotion || isMobile || isTier2;
  const sectionBg = theme === "light" ? "bg-white" : "bg-black";

  if (useVerticalFallback) {
    return <MySocialsTiered />;
  }

  return (
    <section ref={sectionRef} className={`relative h-[300vh] transition-colors duration-500 ${sectionBg}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-1000">
        <motion.div
          style={{ scale, opacity, y, filter }}
          className="h-full w-full origin-center will-change-[transform,filter]">
          <MySocialsTiered />
        </motion.div>
      </div>
    </section>
  );
}