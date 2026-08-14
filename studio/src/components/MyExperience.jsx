"use client";

import "@/styles/my_experience.css";
import { useTheme } from "@/context/ThemeContext";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getEducations, getExperiences } from "@/lib/payload/contentapi";
import { getMyExperienceStyles, getMarqueeCardStyle } from "@/utils/themeSwatch";

export default function MyExperience() {
  const { theme } = useTheme();
  const targetRef = useRef(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const [expData, setExpData] = useState([]);
  const [eduData, setEduData] = useState([]);
  const [scrollRange, setScrollRange] = useState(0);

  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  const styles = getMyExperienceStyles(isDark, isMetal);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const experienceData = await getExperiences();
        const educationData = await getEducations();

        setExpData(Array.isArray(experienceData) ? experienceData : experienceData?.docs || []);
        setEduData(Array.isArray(educationData) ? educationData : educationData?.docs || []);
      } catch (err) {
        console.error("Failed to fetch experience/education data:", err);
      }
    };

    fetchData();
  }, []);

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
  }, [expData]);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 0.75, 1], [0, -scrollRange, -scrollRange]);

  const marqueeItems = eduData.length > 0 ? [...eduData, ...eduData, ...eduData, ...eduData] : [];

  return (
    <div ref={targetRef} className={`relative h-[300vh] transition-colors duration-500 ${styles.section}`}>
      <div className="sticky top-0 flex h-dvh items-center justify-center px-3 sm:px-6 md:px-10 overflow-hidden">
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 blur-3xl transition-all duration-700 ${
            isDark ? "bg-cyan-900/30" : isMetal ? "bg-red-600/30" : "bg-neutral-400/20"
          }`}
        />

        <div
          className={`w-full max-w-7xl h-[75vh] md:h-[70vh] border-2 p-3 md:p-4 flex flex-col gap-3 md:gap-4 relative rounded-xl transition-all duration-500 z-10 ${styles.outerBox}`}>
          <div
            ref={containerRef}
            className={`w-full flex-1 min-h-75 border flex items-center relative rounded-lg overflow-hidden transition-colors duration-500 ${styles.innerBox}`}>
            <motion.div style={{ x }} className="w-max h-full flex items-center">
              <div
                ref={trackRef}
                className="flex gap-6 sm:gap-8 items-center pl-[15vw] md:pl-[35vw] pr-[15vw] md:pr-[20vw] py-4 md:py-8 h-full">
                {expData.map((card, index) => {
                  return (
                    <React.Fragment key={card.id || index}>
                      <motion.div
                        style={{ rotate: card.tilt || 0 }}
                        whileHover={{ scale: 1.04, rotate: 0, zIndex: 30 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`w-[75vw] sm:w-80 md:w-90 lg:w-100 h-64 sm:h-56 md:h-70 border-2 flex flex-col justify-between shrink-0 p-4 relative rounded-lg transition-colors duration-300 group cursor-pointer z-10 ${styles.card}`}>
                        <div className="flex justify-between items-center w-full">
                          <span
                            className={`text-[8px] font-mono uppercase tracking-widest px-2 py-1 rounded border ${styles.badge}`}>
                            {card.type}
                          </span>
                          <span
                            className={`text-4xl font-black font-mono transition-colors duration-500 ${styles.cardId}`}>
                            0{index + 1}
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
                          <p
                            className={`mt-2 text-xs leading-relaxed line-clamp-3 md:line-clamp-none ${styles.textMuted}`}>
                            {card.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {card.tags?.map((tag, tIdx) => (
                            <span key={tIdx} className={`text-[9px] font-semibold px-2 py-0.5 rounded ${styles.badge}`}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="absolute bottom-2 right-2 w-2 h-2 border-r-2 border-b-2 border-current opacity-40" />
                      </motion.div>

                      {index < expData.length - 1 && (
                        <div className="w-6 md:w-10 h-60 md:h-80 flex flex-col justify-center gap-2 shrink-0 pointer-events-none opacity-40">
                          <div className={`w-full h-1 ${styles.line}`} />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </motion.div>
          </div>

          <div
            className={`w-full h-20 md:h-28 border flex items-center shrink-0 rounded-lg overflow-hidden relative transition-colors duration-500 ${styles.marqueeBox}`}>
            <div className="animate-marquee-smooth flex gap-3 md:gap-4 px-2 items-center whitespace-nowrap">
              {marqueeItems.map((item, index) => {
                const uniqueKey = `${item.id || index}-${index}`;
                const cardStyle = getMarqueeCardStyle(item.variant, isDark, isMetal);

                return (
                  <div
                    key={uniqueKey}
                    className={`w-52 md:w-70 h-18.5 md:h-24 border flex flex-col items-center justify-center px-2 md:px-3 py-1 md:py-2 text-center rounded-md shrink-0 transition-all duration-300 ease-in-out cursor-pointer group ${cardStyle}`}>
                    {item.title && (
                      <span className="text-[9px] md:text-[10px] font-bold tracking-wider uppercase truncate w-full">
                        {item.title}
                      </span>
                    )}

                    {item.college && (
                      <span className="text-[7px] md:text-[8px] font-mono font-medium tracking-wider uppercase truncate w-full opacity-80 transition-opacity duration-300">
                        {item.college}
                      </span>
                    )}

                    {item.major && (
                      <span className="text-[7px] md:text-[8px] font-mono tracking-wider uppercase truncate w-full opacity-70 transition-opacity duration-300">
                        {item.major}
                      </span>
                    )}

                    <div className="flex items-center justify-between w-full mt-1 border-t border-current/20 pt-1 transition-colors duration-300">
                      {item.timeline && (
                        <span className="text-[7px] md:text-[8px] font-mono tracking-wider uppercase opacity-70 transition-opacity duration-300">
                          {item.timeline}
                        </span>
                      )}

                      {item.score && (
                        <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-wider truncate max-w-20 md:max-w-30 text-right">
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
  );
}
