"use client";

import { DEFAULT_CARDS } from "@/utils/basic";
import React, { useState, useRef, memo } from "react";
import { useDeviceType } from "@/hooks/useDeviceType";
import FloatingCard from "@/components/basic/FloatingCard";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";

function CardStackReveal({ cards = DEFAULT_CARDS }) {
  const sectionRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(-1);

  const { isMobile } = useDeviceType();
  const { isTier2 } = usePerformanceTier();

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
      className={`relative bg-white w-full ${renderStackedCards ? "h-auto py-15" : "h-[425vh]"}`}>
      <div
        className={`${renderStackedCards ? "relative h-auto" : "sticky top-0 h-screen"} w-full overflow-visible bg-white`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),transparent_55%)] pointer-events-none" />

        <div
          className={`${renderStackedCards ? "relative py-5" : "absolute inset-0 pointer-events-none flex items-center justify-center z-0"}`}>
          <motion.div
            className="flex flex-col items-center gap-3 text-center w-full"
            style={{ filter: renderStackedCards ? "none" : backgroundFilter }}>
            <div className="text-3xl font-black uppercase text-black/50 tracking-wider">Achievements</div>
            <p className="max-w-xl px-6 text-sm leading-6 text-black/35 font-medium">
              A visual story of growth, recognition, and consistent progress.
            </p>
          </motion.div>
        </div>

        <div
          className={`relative w-full flex items-center justify-center ${renderStackedCards ? "h-auto px-4 mt-8" : "h-full overflow-hidden z-10"}`}>
          <div
            className={`w-full max-w-7xl mx-auto ${renderStackedCards ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center" : "relative h-full"}`}>
            {renderedCards.map((card, index) =>
              renderStackedCards ? (
                <div
                  key={`${card.title}-${index}`}
                  className="w-full max-w-100 flex flex-col justify-between p-6 rounded-lg border border-neutral-200 bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-neutral-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black/55">
                      ©0{String(index + 1).padStart(2, "")}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex flex-col space-y-5">
                      <div>
                        <h3 className="text-2xl font-black tracking-tight text-black uppercase mb-2">{card.title}</h3>

                        <p
                          className={`text-xs font-semibold uppercase text-black/45 tracking-wider mb-3 ${isMobile ? "" : "min-h-8"}`}>
                          {card.caption}
                        </p>

                        <p
                          className={`text-sm leading-relaxed text-black/70 text-justify ${isMobile ? "" : "min-h-30"}`}>
                          {card.description}
                        </p>
                      </div>

                      <motion.a
                        href={card.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ y: -1 }}
                        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black px-5 py-3 text-xs font-semibold text-white tracking-tight shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all hover:bg-black/90">
                        <span> {card.cta} </span>
                        <span aria-hidden="true"> ↗ </span>
                      </motion.a>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold uppercase text-black/45">
                      <span>Timeline</span>
                      <span className="text-black font-black">{card.year}</span>
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
