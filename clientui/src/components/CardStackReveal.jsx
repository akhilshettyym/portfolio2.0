"use client";

import React from "react";
import { DEFAULT_CARDS } from "@/utils/basic-utils";
import FloatingCard from "@/components/basic/FloatingCard";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { motion, useMotionTemplate, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";

const CardStackReveal = ({ cards = DEFAULT_CARDS }) => {
  const sectionRef = React.useRef(null);
  const [hoveredCard, setHoveredCard] = React.useState(-1);
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

  const backgroundBlur = useTransform(progress, [0, 0.4, 0.8], isTier2 ? [0, 0, 2] : [0, 5, 12]);
  const backgroundFilter = useMotionTemplate`blur(${backgroundBlur}px)`;

  const staticProgress = isTier2 ? new MotionValue(1) : progress;
  const displayProgress = isTier2 ? staticProgress : progress;

  return (
    <section ref={sectionRef} className={`relative bg-white ${isTier2 ? "h-auto" : "h-[425vh]"}`}>
      <div className={`${isTier2 ? "relative" : "sticky top-0"} h-screen overflow-hidden bg-white`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),transparent_55%)]" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div className="flex flex-col items-center gap-3 text-center"
            style={{ filter: backgroundFilter }}>

            <div className="text-3xl font-black uppercase text-black/50">
              Achievements
            </div>

            <p className="max-w-xl px-6 text-sm leading-6 text-black/35">
              A visual story of growth, recognition, and consistent progress.
            </p>

          </motion.div>
        </div>

        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <div className={`relative h-full w-full max-w-360 ${isTier2 ? "flex flex-wrap gap-4 items-center justify-center" : ""}`}>
            {renderedCards.map((card, index) => (
              isTier2 ? (
                <div key={`${card.title}-${index}`} className="w-[min(90vw,20rem)] h-auto p-6 rounded-4xl border border-white/70 bg-white/98 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:blur-0 blur-0">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-black/55">
                      ©0{String(index + 1).padStart(2, "")}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="overflow-hidden">
                      <h1 className="text-[35px] leading-[0.75] font-black tracking-[-0.08em] text-black uppercase">{card.title}</h1>
                    </div>
                    <p className="mt-3 max-w-[20rem] text-sm font-medium tracking-tight text-black/45">{card.caption}</p>
                    <p className="mt-5 text-md text-black/68">{card.description}</p>
                  </div>
                  <div className="mt-7">
                    <div className="flex items-center justify-between text-xs uppercase tracking-normal text-black/45">
                      <span>Timeline</span>
                      <span>{card.year}</span>
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

export default CardStackReveal;