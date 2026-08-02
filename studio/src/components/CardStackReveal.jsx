"use client";

import { DEFAULT_CARDS } from "@/utils/basic";
import { useTheme } from "@/context/ThemeContext";
import React, { useState, useRef, memo } from "react";
import { useDeviceType } from "@/hooks/useDeviceType";
import FloatingCard from "@/components/basic/FloatingCard";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";

function CardStackReveal({ cards = DEFAULT_CARDS }) {
  const sectionRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(-1);

  const { theme } = useTheme();
  const { isMobile } = useDeviceType();
  const { isTier2 } = usePerformanceTier();

  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  const styles = {
    section: isDark || isMetal ? "bg-black" : "bg-white",
    bgGradient: isMetal
      ? "bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1),transparent_55%)]"
      : isDark
        ? "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_55%)]"
        : "bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),transparent_55%)]",
    title: isDark ? "text-white/50" : isMetal ? "text-red-500/50" : "text-black/50",
    desc: isDark ? "text-white/40" : isMetal ? "text-red-500/40" : "text-black/35",

    cardBg: isDark
      ? "bg-[#0a0a0a] border-white/10 shadow-[0_4px_20px_rgba(255,255,255,0.03)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.08)]"
      : isMetal
        ? "bg-[#0a0a0a] border-red-500/30 shadow-[0_4px_20px_rgba(239,68,68,0.05)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)]"
        : "bg-white border-neutral-200 shadow-md hover:shadow-xl",
    badge: isDark
      ? "border-white/20 bg-white/5 text-white/55"
      : isMetal
        ? "border-red-500/30 bg-red-500/10 text-red-500/70"
        : "border-black/10 bg-neutral-50 text-black/55",
    cardTitle: isDark ? "text-white" : isMetal ? "text-red-500" : "text-black",
    cardCaption: isDark ? "text-white/45" : isMetal ? "text-red-500/45" : "text-black/45",
    cardDesc: isDark ? "text-white/70" : isMetal ? "text-red-200/70" : "text-black/70",

    button: isDark
      ? "border-white/20 bg-white text-black hover:bg-white/90 shadow-[0_12px_30px_rgba(255,255,255,0.15)]"
      : isMetal
        ? "border-red-500/20 bg-red-500 text-black hover:bg-red-600 shadow-[0_12px_30px_rgba(239,68,68,0.15)]"
        : "border-black/10 bg-black text-white hover:bg-black/90 shadow-[0_12px_30px_rgba(0,0,0,0.18)]",

    footerBorder: isDark ? "border-white/10" : isMetal ? "border-red-500/20" : "border-neutral-100",
    footerLabel: isDark ? "text-white/45" : isMetal ? "text-red-500/45" : "text-black/45",
    footerYear: isDark ? "text-white" : isMetal ? "text-red-500" : "text-black",
  };

  const renderStackedCards = isMobile || isTier2;
  const renderedCards = renderStackedCards ? cards.slice(0, Math.min(cards.length, 4)) : cards;

  const { scrollYProgress } = useScroll({
    target: !renderStackedCards ? sectionRef : undefined,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 26,
    damping: 22,
    mass: 1.1,
  });

  const backgroundBlur = useTransform(progress, [0, 0.4, 0.8], renderStackedCards ? [0, 0, 0] : [0, 5, 12]);
  const backgroundFilter = useMotionTemplate`blur(${backgroundBlur}px)`;

  const displayProgress = progress;

  return (
    <section
      ref={sectionRef}
      className={`relative w-full transition-colors duration-500 ${styles.section} ${
        renderStackedCards ? "h-auto py-15" : "h-[425vh]"
      }`}>
      <div
        className={`${
          renderStackedCards ? "relative h-auto" : "sticky top-0 h-screen"
        } w-full overflow-visible transition-colors duration-500 ${styles.section}`}>
        <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${styles.bgGradient}`} />

        <div
          className={`${
            renderStackedCards
              ? "relative py-5"
              : "absolute inset-0 pointer-events-none flex items-center justify-center z-0"
          }`}>
          <motion.div
            className="flex flex-col items-center gap-3 text-center w-full"
            style={{ filter: renderStackedCards ? "none" : backgroundFilter }}>
            <div
              className={`text-3xl font-black uppercase tracking-wider transition-colors duration-500 ${styles.title}`}>
              Achievements
            </div>
            <p className={`max-w-xl px-6 text-sm leading-6 font-medium transition-colors duration-500 ${styles.desc}`}>
              A visual story of growth, recognition, and consistent progress.
            </p>
          </motion.div>
        </div>

        <div
          className={`relative w-full flex items-center justify-center ${
            renderStackedCards ? "h-auto px-4 mt-8" : "h-full overflow-hidden z-10"
          }`}>
          <div
            className={`w-full max-w-7xl mx-auto ${
              renderStackedCards
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center"
                : "relative h-full"
            }`}>
            {renderedCards.map((card, index) =>
              renderStackedCards ? (
                <div
                  key={`${card.title}-${index}`}
                  className={`w-full max-w-100 flex flex-col justify-between p-6 rounded-lg border transition-all duration-300 transform hover:-translate-y-1 ${styles.cardBg}`}>
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${styles.badge}`}>
                      ©0{String(index + 1).padStart(2, "")}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex flex-col space-y-5">
                      <div>
                        <h3
                          className={`text-2xl font-black tracking-tight uppercase mb-2 transition-colors duration-300 ${styles.cardTitle}`}>
                          {card.title}
                        </h3>

                        <p
                          className={`text-xs font-semibold uppercase tracking-wider mb-3 transition-colors duration-300 ${styles.cardCaption} ${
                            isMobile ? "" : "min-h-8"
                          }`}>
                          {card.caption}
                        </p>

                        <p
                          className={`text-sm leading-relaxed text-justify transition-colors duration-300 ${styles.cardDesc} ${
                            isMobile ? "" : "min-h-30"
                          }`}>
                          {card.description}
                        </p>
                      </div>

                      <motion.a
                        href={card.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ y: -1 }}
                        className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-xs font-semibold tracking-tight transition-all duration-300 ${styles.button}`}>
                        <span> {card.cta} </span>
                        <span aria-hidden="true"> ↗ </span>
                      </motion.a>
                    </div>

                    <div
                      className={`mt-6 pt-4 border-t flex items-center justify-between text-xs font-bold uppercase transition-colors duration-300 ${styles.footerBorder} ${styles.footerLabel}`}>
                      <span>Timeline</span>
                      <span className={`font-black transition-colors duration-300 ${styles.footerYear}`}>
                        {card.year}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <FloatingCard
                  key={`${card.title}-${index}`}
                  card={card}
                  index={index}
                  progress={displayProgress}
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  theme={theme}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(CardStackReveal);
