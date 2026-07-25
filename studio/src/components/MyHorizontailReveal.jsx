"use client";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import React, { useEffect, useRef } from "react";

const DUMMY_CARDS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Project ${i + 1}`,
  color: `hsl(${i * 30}, 70%, 90%)`,
}));

export default function MyHorizontalReveal() {
  const wheelRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      gsap.to(wheelRef.current, {
        rotation: -360,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3000",
          pin: true,
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-white text-black overflow-hidden flex items-center justify-center"
    >
      <div
        ref={wheelRef}
        className="absolute left-1/2 top-[110%] md:top-[120%]"
        style={{ width: 0, height: 0 }}
      >
        {DUMMY_CARDS.map((card, i) => {
          const angle = (360 / DUMMY_CARDS.length) * i;

          return (
            <div
              key={card.id}
              className="absolute flex flex-col items-center"
              style={{
                transform: `rotate(${angle}deg) translateY(calc(-40vh - 250px))`,
                transformOrigin: "center center",
                left: "-125px",
                top: "-175px",
                width: "250px",
                height: "350px",
              }}
            >
              <div
                className="w-full h-full rounded-2xl flex items-center justify-center border-2  border-black/5 shadow-2xl transition-transform hover:scale-105"
                style={{ backgroundColor: card.color }}
              >
                <span className="text-6xl font-black text-black/20">{card.id}</span>
              </div>

              <h3 className="mt-6 text-xl font-bold uppercase tracking-wider text-black">
                {card.title}
              </h3>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-pulse">
        <span className="text-xs font-bold uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-black" />
      </div>
    </section>
  );
}
