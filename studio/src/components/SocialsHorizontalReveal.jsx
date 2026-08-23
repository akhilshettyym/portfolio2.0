"use client";

import MySocialsTiered from "@/components/TieredComponents/MySocialsTiered";
import { useTheme } from "@/context/ThemeContext";
import { useDeviceType } from "@/hooks/useDeviceType";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

// Renamed to reflect the new animation style
export default function SocialsCinematicReveal() {
  const sectionRef = useRef(null);
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const { isMobile } = useDeviceType();
  const { isTier2 } = usePerformanceTier();

  // Fallback to static component for low-tier devices or reduced motion preferences
  const useVerticalFallback = shouldReduceMotion || isMobile || isTier2;
  const sectionBg = theme === "light" ? "bg-white" : "bg-black";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smoother, slightly lighter spring for Z-axis scaling
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 20,
    mass: 0.5,
  });

  // 1. Z-Axis Scale: Starts far away (0.6), locks in (1), zooms past camera (1.4)
  const scale = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 1.4]);

  // 2. Opacity: Fades in early, fades out late
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // 3. Vertical Parallax: Drifts up slightly as it enters and exits for a floating feel
  const y = useTransform(smoothProgress, [0, 0.3, 0.7, 1], ["10%", "0%", "0%", "-10%"]);

  // 4. Glass Blur: Starts blurry, snaps into focus, blurs out as it passes you
  const filter = useTransform(smoothProgress, [0, 0.3, 0.7, 1], ["blur(16px)", "blur(0px)", "blur(0px)", "blur(16px)"]);

  if (useVerticalFallback) {
    return <MySocialsTiered />;
  }

  return (
    <section ref={sectionRef} className={`relative h-[300vh] transition-colors duration-500 ${sectionBg}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-1000">
        <motion.div
          style={{ scale, opacity, y, filter }}
          // will-change optimizes both transform and filter for butter-smooth 60fps
          className="h-full w-full origin-center will-change-[transform,filter]">
          {/* Note: Removed the horizontalReveal prop, assuming your base component looks great centered */}
          <MySocialsTiered />
        </motion.div>
      </div>
    </section>
  );
}
