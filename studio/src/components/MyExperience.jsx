"use client";

import "@/styles/my_experience.css";
import { useTheme } from "@/context/ThemeContext";
import React, { useRef, useState, useEffect } from "react";
import { DUMMY_CARDS, EDUCATION_CARDS } from "@/utils/basic";
import { motion, useScroll, useTransform } from "framer-motion";

const getMyExperienceStyles = (isDark, isMetal) => {
  if (isMetal) {
    return {
      section: "bg-[#050000] text-red-500",
      outerBox: "border-red-900/60 bg-[#110000]/80 shadow-[0_0_50px_rgba(239,68,68,0.15)] backdrop-blur-md",
      innerBox: "border-red-950 bg-[#180000]",
      card: "border-red-700 bg-[#220000] text-red-400 hover:border-red-500 shadow-[6px_6px_0px_0px_rgba(239,68,68,0.8)] hover:shadow-[10px_10px_0px_0px_rgba(239,68,68,1)]",
      badge: "border-red-800 bg-red-950 text-red-400",
      cardTitle: "text-red-400 border-red-900",
      cardId: "text-red-950",
      textMuted: "text-red-500/60",
      line: "bg-red-800",
      marqueeBox: "border-red-900/50 bg-[#180000]",
    };
  }

  if (isDark) {
    return {
      section: "bg-[#080808] text-white",
      outerBox: "border-neutral-800 bg-[#111111]/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md",
      innerBox: "border-neutral-800 bg-[#141414]",
      card: "border-neutral-700 bg-[#1c1c1c] text-white hover:border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.9)] hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)]",
      badge: "border-neutral-700 bg-neutral-800 text-neutral-300",
      cardTitle: "text-white border-neutral-700",
      cardId: "text-neutral-700",
      textMuted: "text-neutral-400",
      line: "bg-neutral-700",
      marqueeBox: "border-neutral-800 bg-[#141414]",
    };
  }

  return {
    section: "bg-neutral-50 text-black",
    outerBox: "border-neutral-300 bg-white shadow-2xl",
    innerBox: "border-neutral-200 bg-neutral-100/60",
    card: "border-black bg-white text-black hover:border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]",
    badge: "border-neutral-300 bg-neutral-200 text-neutral-800",
    cardTitle: "text-black border-neutral-300",
    cardId: "text-neutral-300",
    textMuted: "text-neutral-500",
    line: "bg-neutral-300",
    marqueeBox: "border-neutral-300 bg-neutral-100",
  };
};

export default function MyExperience() {
  const { theme } = useTheme();
  const targetRef = useRef(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [scrollRange, setScrollRange] = useState(0);

  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  const styles = getMyExperienceStyles(isDark, isMetal);

  const getMarqueeCardStyle = (variant) => {
    const isInverted = variant === "inverted";

    if (isDark) {
      return isInverted
        ? "border-neutral-300 bg-neutral-200 text-black hover:bg-[#1c1c1c] hover:text-white hover:border-neutral-700"
        : "border-neutral-700 bg-[#1c1c1c] text-white hover:bg-neutral-200 hover:text-black hover:border-neutral-300";
    }

    if (isMetal) {
      return isInverted
        ? "border-red-500 bg-red-600 text-black hover:bg-[#220000] hover:text-red-500 hover:border-red-800"
        : "border-red-800 bg-[#220000] text-red-500 hover:bg-red-600 hover:text-black hover:border-red-500";
    }

    return isInverted
      ? "border-black bg-black text-white hover:bg-white hover:text-black hover:border-neutral-400"
      : "border-neutral-400 bg-white text-black hover:bg-black hover:text-white hover:border-black";
  };

  useEffect(() => {
    const calculateRange = () => {
      if (trackRef.current && containerRef.current) {
        const totalDistance = trackRef.current.scrollWidth - containerRef.current.clientWidth;
        setScrollRange(Math.max(0, totalDistance));
      }
    };

    calculateRange();

    const resizeObserver = new ResizeObserver(calculateRange);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (trackRef.current) resizeObserver.observe(trackRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 0.75, 1], [0, -scrollRange, -scrollRange]);

  const marqueeItems = [...EDUCATION_CARDS, ...EDUCATION_CARDS, ...EDUCATION_CARDS, ...EDUCATION_CARDS];

  return (
    <div ref={targetRef} className={`relative h-[320vh] transition-colors duration-500 ${styles.section}`}>
      <div className="sticky top-0 flex h-screen items-center justify-center px-4 sm:px-10 overflow-hidden">
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 blur-3xl transition-all duration-700 ${isDark ? "bg-cyan-900/30" : isMetal ? "bg-red-600/30" : "bg-neutral-400/20"}`}
        />

        <div
          className={`w-full max-w-7xl h-[80%] border-2 p-4 flex flex-col justify-between relative rounded-xl transition-all duration-500 z-10 ${styles.outerBox}`}>
          <div
            ref={containerRef}
            className={`w-full h-[68%] border flex items-center relative rounded-lg overflow-hidden transition-colors duration-500 ${styles.innerBox}`}>
            <motion.div style={{ x }} className="w-max">
              <div ref={trackRef} className="flex gap-8 items-center pl-[40vw] pr-[20vw] py-8">
                {DUMMY_CARDS.map((card) => {
                  return (
                    <React.Fragment key={card.id}>
                      <motion.div
                        style={{ rotate: card.tilt }}
                        whileHover={{ scale: 1.04, rotate: 0, zIndex: 30 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`w-80 sm:w-90 h-56 border-2 flex flex-col justify-between shrink-0 p-4 relative rounded-lg transition-colors duration-300 group cursor-pointer z-10 ${styles.card}`}>
                        <div className="flex justify-between items-center w-full">
                          <span
                            className={`text-[8px] font-mono uppercase tracking-widest px-2 py-1 rounded border ${styles.badge}`}>
                            {card.type}
                          </span>
                          <span
                            className={`text-4xl font-black font-mono transition-colors duration-500 ${styles.cardId}`}>
                            0{card.id}
                          </span>
                        </div>

                        <div className="my-auto">
                          <div
                            className={`flex items-baseline justify-between w-full text-[10px] tracking-wider uppercase leading-relaxed ${styles.textMuted}`}>
                            <p className="font-medium">{card.company}</p>
                            <span className="text-[8px] tracking-normal normal-case opacity-80">{card.timeline}</span>
                          </div>
                        </div>

                        <div className="my-auto">
                          <h3
                            className={`text-md font-bold uppercase tracking-normal pb-1 border-b-2 ${styles.cardTitle}`}>
                            {card.title}
                          </h3>
                          <p className={`mt-2 text-xs leading-relaxed ${styles.textMuted}`}>{card.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {card.tags.map((tag, tIdx) => (
                            <span key={tIdx} className={`text-[9px] font-semibold px-2 py-0.5 rounded ${styles.badge}`}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="absolute bottom-2 right-2 w-2 h-2 border-r-2 border-b-2 border-current opacity-40" />
                      </motion.div>

                      {card.id < DUMMY_CARDS.length && (
                        <div className="w-10 h-80 flex flex-col justify-center gap-2 shrink-0 pointer-events-none opacity-40">
                          <div className={`w-full h-1 ${styles.line}`} />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </motion.div>
          </div>

          <div className="mt-2">
            <div
              className={`w-full h-28 border flex items-center rounded-lg overflow-hidden relative transition-colors duration-500 ${styles.marqueeBox}`}>
              <div className="animate-marquee-smooth flex gap-4 px-2 items-center whitespace-nowrap">
                {marqueeItems.map((item, index) => {
                  const uniqueKey = `${item.id}-${index}`;
                  const cardStyle = getMarqueeCardStyle(item.variant);

                  return (
                    <div
                      key={uniqueKey}
                      className={`w-65 h-20 border flex flex-col items-center justify-center px-3 py-2 text-center rounded-md shrink-0 transition-all duration-300 ease-in-out cursor-pointer group ${cardStyle}`}>
                      {item.title && (
                        <span className="text-[10px] font-bold tracking-wider uppercase truncate w-full">
                          {item.title}
                        </span>
                      )}

                      {item.college && (
                        <span className="text-[8px] font-mono font-medium tracking-wider uppercase truncate w-full opacity-80 transition-opacity duration-300">
                          {item.college}
                        </span>
                      )}

                      {item.major && (
                        <span className="text-[8px] font-mono tracking-wider uppercase truncate w-full opacity-70 transition-opacity duration-300">
                          {item.major}
                        </span>
                      )}

                      <div className="flex items-center justify-between w-full mt-1 border-t border-current/20 pt-1 transition-colors duration-300">
                        {item.timeline && (
                          <span className="text-[8px] font-mono tracking-wider uppercase opacity-70 transition-opacity duration-300">
                            {item.timeline}
                          </span>
                        )}

                        {item.score && (
                          <span className="text-[8px] font-bold uppercase tracking-wider truncate max-w-[120px] text-right">
                            {item.score}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
