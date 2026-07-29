"use client";

import React, { useRef, useState, useEffect } from "react";
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
  const targetRef = useRef(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const [scrollRange, setScrollRange] = useState(0);

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
    <section ref={targetRef} className="relative h-[250vh] bg-white text-black">
      <div className="sticky top-0 flex h-screen items-center justify-center px-10 overflow-hidden">
        <div className="w-full h-[70%] max-h-200 border-4 border-black p-4 flex flex-col justify-center bg-white relative rounded-md">
          <div
            ref={containerRef}
            className="w-full h-[65%] border-2 border-black overflow-hidden flex items-center relative bg-white rounded-md">
            <motion.div ref={trackRef} style={{ x }} className="flex gap-5 items-center w-max pl-[100vw]">
              {DUMMY_CARDS.map((card) => (
                <React.Fragment key={card.id}>
                  <div className="w-62.5 h-75 border-2 border-black bg-white flex flex-col items-center justify-center shrink-0 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative rounded-sm">
                    <span className="text-xs font-mono uppercase tracking-widest absolute top-4 left-4 text-neutral-400">
                      {" "}
                      {card.type}{" "}
                    </span>

                    <span className="text-7xl font-black text-black"> {card.id} </span>

                    <h3 className="mt-6 text-xl font-bold uppercase tracking-wider text-black border-t-2 border-black pt-4 w-3/4 text-center">
                      {" "}
                      {card.title}{" "}
                    </h3>
                  </div>

                  {card.id === 3 && (
                    <div className="w-16 h-75 flex flex-col justify-center relative shrink-0 pointer-events-none z-10">
                      <div className="w-full h-0.5 bg-black absolute top-[20%]" />
                      <div className="w-full h-0.5 bg-black absolute top-[30%]" />
                      <div className="w-full h-0.5 bg-black absolute top-[70%]" />
                      <div className="w-full h-0.5 bg-black absolute top-[80%]" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </div>

          <div className="mt-5">
            <div className="w-full h-25 border-2 border-black bg-white flex items-center rounded-md overflow-hidden relative">
              <motion.div
                className="flex gap-4 px-2 items-center whitespace-nowrap"
                animate={{ x: ["-20%", "0%"] }}
                transition={{ ease: "linear", duration: 18, repeat: Infinity }}>
                {[...MARQUEE_CARDS, ...MARQUEE_CARDS].map((item, index) => (
                  <div
                    key={index}
                    className="w-75 h-20 border-2 border-black bg-white flex flex-col items-center justify-center rounded-md shrink-0 transition-colors duration-300 hover:bg-black hover:text-white group">
                    <span className="text-[10px] font-black tracking-widest uppercase text-neutral-400 group-hover:text-neutral-500 transition-colors">
                      {" "}
                      {item.category}{" "}
                    </span>

                    <span className="text-md font-bold uppercase tracking-wide"> {item.title} </span>
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
