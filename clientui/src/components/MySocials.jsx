"use client";

import React, { useRef, useState } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { getQualityPreset } from "@/lib/performance/applyQualityTier";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const trailImages = [
  "/bubbles/bubbles.docker.svg",
  "/bubbles/bubbles.github.svg",
  "/bubbles/bubbles.kubernetes.svg",
  "/bubbles/bubbles.salesforce.svg",
  "/bubbles/bubbles.vscode.svg",
];

export default function MySocials() {
  const [trail, setTrail] = useState([]);
  const lastPosition = useRef({ x: 0, y: 0 });
  const imageIndex = useRef(0);
  const shouldReduceMotion = useReducedMotion();
  const { tier } = usePerformanceTier();
  const quality = getQualityPreset(tier);

  const handleMouseMove = (event) => {
    if (shouldReduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const distance = Math.hypot(x - lastPosition.current.x, y - lastPosition.current.y);

    if (distance < quality.socialTrailDistance) return;

    lastPosition.current = { x, y };

    const nextItem = {
      id: `${Date.now()}-${imageIndex.current}`,
      x, y,
      src: trailImages[imageIndex.current],
      zIndex: 20 + (imageIndex.current % 10),
    };

    imageIndex.current = (imageIndex.current + 1) % trailImages.length;
    setTrail((prev) => [...prev.slice(-5), nextItem]);

    window.setTimeout(() => {
      setTrail((prev) => prev.filter((item) => item.id !== nextItem.id));
    }, quality.socialTrailLifeMs);
  };

  return (
    <motion.section onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 80, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-[72vh] overflow-hidden bg-white px-5 py-18 text-black md:min-h-screen md:px-10">

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] bg-size-[25px_25px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-black/15" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/15" />

      <div className="relative z-10 mx-auto flex min-h-[56vh] w-full max-w-6xl flex-col justify-center gap-10 md:min-h-[78vh]">
        <div>
          <div className="text-xs uppercase tracking-[0.32em] text-black/40">
            network nodes
          </div>
          <h2 className="mt-3 max-w-4xl text-[clamp(2.6rem,7vw,4rem)] font-black uppercase leading-[0.88] tracking-normal">
            Socials
          </h2>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20, top: "10.5%", height: "75%" }}>
        <AnimatePresence>
          {trail.map((item) => (
            <motion.img key={item.id}
              src={item.src} alt="trail"
              initial={{ opacity: 0, scale: 0.2, x: item.x - 96, y: item.y - 96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute w-35 h-35 object-cover rounded-lg"
              style={{ zIndex: item.zIndex }} />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};