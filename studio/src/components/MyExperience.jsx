"use client";

import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion, useScroll, useTransform } from "framer-motion";

const DUMMY_CARDS = [
  { id: 1, title: "Project 1", type: "Feature" },
  { id: 2, title: "Project 2", type: "Feature" },
  { id: 3, title: "Project 3", type: "Experience" },
  { id: 4, title: "Project 4", type: "Experience" },
];

const MARQUEE_CARDS = [
  { id: 1, title: "Next.js & React", category: "Frontend" },
  { id: 2, title: "Tailwind CSS", category: "UI/UX" },
  { id: 3, title: "Framer Motion", category: "Animation" },
  { id: 4, title: "TypeScript", category: "Language" },
];

export default function MyExperience() {
  const { theme } = useTheme();
  const targetRef = useRef(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const [scrollRange, setScrollRange] = useState(0);

  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  const styles = {
    section: isDark ? "bg-[#0a0a0a] text-white" : isMetal ? "bg-[#050000] text-red-500" : "bg-white text-black",

    outerBox: isDark ? "border-white bg-[#111]" : isMetal ? "border-red-600 bg-[#110000]" : "border-black bg-white",

    innerBox: isDark ? "border-white bg-[#151515]" : isMetal ? "border-red-600 bg-[#160000]" : "border-black bg-white",

    card: isDark
      ? "border-white bg-[#1c1c1c] text-white hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
      : isMetal
        ? "border-red-500 bg-[#220000] text-red-500 hover:shadow-[3px_3px_0px_0px_rgba(239,68,68,1)]"
        : "border-black bg-white text-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",

    cardTitle: isDark ? "text-white border-white" : isMetal ? "text-red-400 border-red-500" : "text-black border-black",
    cardId: isDark ? "text-white" : isMetal ? "text-red-500" : "text-black",
    textMuted: isDark ? "text-white/40" : isMetal ? "text-red-500/40" : "text-neutral-400",
    line: isDark ? "bg-white" : isMetal ? "bg-red-500" : "bg-black",

    marqueeBox: isDark
      ? "border-white bg-[#151515]"
      : isMetal
        ? "border-red-600 bg-[#160000]"
        : "border-black bg-white",

    marqueeCard: isDark
      ? "border-white bg-[#1c1c1c] text-white hover:bg-white hover:text-black"
      : isMetal
        ? "border-red-500 bg-[#220000] text-red-500 hover:bg-red-500 hover:text-black"
        : "border-black bg-white text-black hover:bg-black hover:text-white",
  };

  useEffect(() => {
    const calculateRange = () => {
      if (trackRef.current && containerRef.current) {
        const totalDistance = trackRef.current.scrollWidth - containerRef.current.clientWidth;
        setScrollRange(totalDistance);
      }
    };

    calculateRange();
    window.addEventListener("resize", calculateRange);
    return () => window.removeEventListener("resize", calculateRange);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  return (
    <section ref={targetRef} className={`relative h-[250vh] transition-colors duration-500 ${styles.section}`}>
      <div className="sticky top-0 flex h-screen items-center justify-center px-10 overflow-hidden">
        <div
          className={`w-full h-[70%] max-h-200 border-4 p-4 flex flex-col justify-center relative rounded-md transition-colors duration-500 ${styles.outerBox}`}>
          <div
            ref={containerRef}
            className={`w-full h-[65%] border-2 overflow-hidden flex items-center relative rounded-md transition-colors duration-500 ${styles.innerBox}`}>
            <motion.div ref={trackRef} style={{ x }} className="flex gap-5 items-center w-max pl-[100vw]">
              {DUMMY_CARDS.map((card) => (
                <React.Fragment key={card.id}>
                  <div
                    className={`w-62.5 h-75 border-2 flex flex-col items-center justify-center shrink-0 transition-all duration-300 hover:-translate-y-2 relative rounded-sm ${styles.card}`}>
                    <span
                      className={`text-xs font-mono uppercase tracking-widest absolute top-4 left-4 transition-colors duration-500 ${styles.textMuted}`}>
                      {card.type}
                    </span>

                    <span className={`text-7xl font-black transition-colors duration-500 ${styles.cardId}`}>
                      {card.id}
                    </span>

                    <h3
                      className={`mt-6 text-xl font-bold uppercase tracking-wider border-t-2 pt-4 w-3/4 text-center transition-colors duration-500 ${styles.cardTitle}`}>
                      {card.title}
                    </h3>
                  </div>

                  {card.id === 3 && (
                    <div className="w-16 h-75 flex flex-col justify-center relative shrink-0 pointer-events-none z-10">
                      <div
                        className={`w-full h-0.5 absolute top-[20%] transition-colors duration-500 ${styles.line}`}
                      />
                      <div
                        className={`w-full h-0.5 absolute top-[30%] transition-colors duration-500 ${styles.line}`}
                      />
                      <div
                        className={`w-full h-0.5 absolute top-[70%] transition-colors duration-500 ${styles.line}`}
                      />
                      <div
                        className={`w-full h-0.5 absolute top-[80%] transition-colors duration-500 ${styles.line}`}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </div>

          <div className="mt-5">
            <div
              className={`w-full h-25 border-2 flex items-center rounded-md overflow-hidden relative transition-colors duration-500 ${styles.marqueeBox}`}>
              <motion.div
                className="flex gap-4 px-2 items-center whitespace-nowrap"
                animate={{ x: ["-20%", "0%"] }}
                transition={{ ease: "linear", duration: 18, repeat: Infinity }}>
                {[...MARQUEE_CARDS, ...MARQUEE_CARDS].map((item, index) => (
                  <div
                    key={index}
                    className={`w-75 h-20 border-2 flex flex-col items-center justify-center rounded-md shrink-0 transition-all duration-300 group ${styles.marqueeCard}`}>
                    <span
                      className={`text-[10px] font-black tracking-widest uppercase transition-colors duration-500 ${styles.textMuted}`}>
                      {item.category}
                    </span>

                    <span className="text-md font-bold uppercase tracking-wide">{item.title}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
