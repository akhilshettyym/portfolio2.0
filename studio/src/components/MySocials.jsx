"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { getQualityPreset } from "@/lib/performance/applyQualityTier";
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring } from "framer-motion";

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
  const timeouts = useRef(new Set());

  const shouldReduceMotion = useReducedMotion();
  const { tier } = usePerformanceTier();
  const quality = getQualityPreset(tier);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const globeRotateX = useSpring(mouseY, { stiffness: 60, damping: 15 });
  const globeRotateY = useSpring(mouseX, { stiffness: 60, damping: 15 });

  // 1. FIXED LINTER WARNING: Copy timeouts.current to a local variable
  useEffect(() => {
    const currentTimeouts = timeouts.current;

    return () => {
      currentTimeouts.forEach((id) => clearTimeout(id));
      currentTimeouts.clear();
    };
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      mouseX.set(((x - centerX) / centerX) * 15);
      mouseY.set(((y - centerY) / centerY) * -15);

      if (shouldReduceMotion) return;
      const distance = Math.hypot(x - lastPosition.current.x, y - lastPosition.current.y);
      if (distance < quality.socialTrailDistance) return;

      lastPosition.current = { x, y };

      const uniqueId =
        typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

      const nextItem = {
        id: uniqueId,
        x,
        y,
        src: trailImages[imageIndex.current],
        zIndex: 20 + (imageIndex.current % 10),
      };

      imageIndex.current = (imageIndex.current + 1) % trailImages.length;

      setTrail((prev) => [...prev.slice(-4), nextItem]);

      const timeoutId = setTimeout(() => {
        setTrail((prev) => prev.filter((item) => item.id !== nextItem.id));
        timeouts.current.delete(timeoutId);
      }, quality.socialTrailLifeMs);

      timeouts.current.add(timeoutId);
    },
    [mouseX, mouseY, quality, shouldReduceMotion],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 80, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-[72vh] overflow-hidden bg-white px-5 py-18 text-black md:min-h-screen md:px-10"
      style={{ perspective: "1200px" }}>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] bg-size-[25px_25px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-black/15" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/15" />

      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-10">
        {/* 2. FIXED ROTATION: Parent handles the Parallax Tilt (X and Y axis) */}
        <motion.div
          style={{
            rotateX: globeRotateX,
            rotateY: globeRotateY,
            transformStyle: "preserve-3d",
          }}
          className="flex h-150 w-100 items-center justify-center">
          {/* Child handles the continuous Earth-like spin (Y axis) */}
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{
              repeat: Infinity,
              duration: 35,
              ease: "linear",
            }}
            style={{ transformStyle: "preserve-3d" }}>
            <GlobeSVG />
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[56vh] w-full max-w-6xl flex-col justify-center gap-10 md:min-h-[78vh]">
        <div className="pointer-events-auto relative text-center mix-blend-difference">
          <div className="text-xs uppercase tracking-[0.32em] text-black/40">network nodes</div>
          <h2 className="mt-3 text-[clamp(2.6rem,7vw,4rem)] font-black uppercase leading-[0.88] tracking-normal">
            Socials
          </h2>
          <h1 className="mt-4 text-3xl font-bold uppercase text-black/20 mix-blend-difference md:text-5xl">
            Some Visuals <br />
            to get an idea
          </h1>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0" style={{ zIndex: 20, top: "10.5%", height: "75%" }}>
        <AnimatePresence>
          {trail.map((item) => (
            <motion.img
              key={item.id}
              src={item.src}
              alt="Decorative network node"
              initial={{
                opacity: 0,
                scale: 0.2,
                x: item.x - 96,
                y: item.y - 96,
              }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute h-35 w-35 rounded-lg object-cover"
              style={{ zIndex: item.zIndex }}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

const GlobeSVG = () => (
  <svg
    viewBox="0 0 800 800"
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
    className="stroke-black/15 fill-transparent"
    strokeWidth="2">
    <circle cx="400" cy="400" r="380" />
    <ellipse cx="400" cy="400" rx="380" ry="120" />
    <ellipse cx="400" cy="400" rx="120" ry="380" />
  </svg>
);
