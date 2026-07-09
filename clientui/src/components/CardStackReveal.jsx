"use client";

import { DEFAULT_CARDS } from "@/utils/basic-utils";
import React, { useState, useRef, memo } from "react";
import FloatingCard from "@/components/basic/FloatingCard";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";

const CardStackRevealComponent = ({ cards = DEFAULT_CARDS }) => {
  const sectionRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(-1);
  const { isTier2 } = usePerformanceTier();

  const renderedCards = isTier2 ? cards.slice(0, Math.min(cards.length, 4)) : cards;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 26,
    damping: 22,
    mass: 1.1,
  });

  const backgroundBlur = useTransform(progress, [0, 0.4, 0.8], isTier2 ? [0, 0, 0] : [0, 5, 12]);
  const backgroundFilter = useMotionTemplate`blur(${backgroundBlur}px)`;

  const displayProgress = progress;

  return (
    <section ref={sectionRef} className={`relative bg-white w-full ${isTier2 ? "h-auto py-15" : "h-[425vh]"}`}>
      <div className={`${isTier2 ? "relative h-auto" : "sticky top-0 h-screen"} w-full overflow-visible bg-white`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),transparent_55%)] pointer-events-none" />

        <div className={`${isTier2 ? "relative py-5" : "absolute inset-0 pointer-events-none flex items-center justify-center z-0"}`}>
          <motion.div className="flex flex-col items-center gap-3 text-center w-full" style={{ filter: isTier2 ? "none" : backgroundFilter }}>
            <div className="text-3xl font-black uppercase text-black/50 tracking-wider">
              Achievements
            </div>
            <p className="max-w-xl px-6 text-sm leading-6 text-black/35 font-medium">
              A visual story of growth, recognition, and consistent progress.
            </p>
          </motion.div>
        </div>

        <div className={`relative w-full flex items-center justify-center ${isTier2 ? "h-auto px-4 mt-8" : "h-full overflow-hidden z-10"}`}>
          <div className={`w-full max-w-7xl mx-auto ${isTier2 ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center" : "relative h-full"}`}>
            {renderedCards.map((card, index) => (
              isTier2 ? (
                <div key={`${card.title}-${index}`} className="w-full max-w-[20rem] flex flex-col justify-between p-6 rounded-lg border border-neutral-200 bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">

                  <div className="mb-4 flex items-start justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-neutral-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black/55">
                      ©0{String(index + 1).padStart(2, "")}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-black uppercase mb-2">
                        {card.title}
                      </h3>

                      <p className="text-xs font-semibold uppercase text-black/45 tracking-wider mb-3">
                        {card.caption}
                      </p>

                      <p className="text-sm leading-relaxed text-black/70">
                        {card.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold uppercase text-black/45">
                      <span>Timeline</span>
                      <span className="text-black font-black">{card.year}</span>
                    </div>
                  </div>

                </div>
              ) : (
                <FloatingCard key={`${card.title}-${index}`} card={card} index={index} progress={displayProgress} hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} />
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CardStackReveal = memo(CardStackRevealComponent);

export default CardStackReveal;