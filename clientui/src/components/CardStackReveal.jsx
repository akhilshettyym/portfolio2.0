"use client";

import React from "react";
import { DEFAULT_CARDS } from "@/utils/basic-utils";
import FloatingCard from "@/components/basic/FloatingCard";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";

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

  return (
    <section ref={sectionRef} className={`relative bg-white ${isTier2 ? "h-[300vh]" : "h-[425vh]"}`}>
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
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
          <div className="relative h-full w-full max-w-360">
            {renderedCards.map((card, index) => (
              <FloatingCard key={`${card.title}-${index}`} card={card} index={index} progress={progress} hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardStackReveal;