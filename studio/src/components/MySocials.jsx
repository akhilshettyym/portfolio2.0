"use client";

import { useTheme } from "@/context/ThemeContext";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { getQualityPreset } from "@/lib/performance/applyQualityTier";
import React, { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring } from "framer-motion";

const trailImages = [
  "/bubbles/bubbles.docker.svg",
  "/bubbles/bubbles.github.svg",
  "/bubbles/bubbles.kubernetes.svg",
  "/bubbles/bubbles.salesforce.svg",
  "/bubbles/bubbles.vscode.svg",
];

const THEME_STYLES = {
  light: {
    bg: "bg-white",
    textSub: "text-black/50",
    textMain: "text-black",
    textMuted: "text-black/40",
    textHighlight: "text-black/80",
    globeLines: "border-black/20",
    globeEquator: "border-black/30",
    divider: "via-black/15",
    glow: "bg-black/[0.02]",
    trailCard: "shadow-black/10 bg-white/50 border-black/5",
  },
  dark: {
    bg: "bg-black",
    textSub: "text-white/50",
    textMain: "text-white",
    textMuted: "text-white/40",
    textHighlight: "text-white/80",
    globeLines: "border-white/20",
    globeEquator: "border-white/30",
    divider: "via-white/15",
    glow: "bg-white/[0.02]",
    trailCard: "shadow-white/10 bg-black/50 border-white/10",
  },
  metal: {
    bg: "bg-black",
    textSub: "text-red-500/70",
    textMain: "text-red-500",
    textMuted: "text-red-500/50",
    textHighlight: "text-red-500",
    globeLines: "border-red-500/30",
    globeEquator: "border-red-500/50",
    divider: "via-red-500/20",
    glow: "bg-red-500/[0.05]",
    trailCard: "shadow-red-500/20 bg-black/80 border-red-500/20",
  },
};

const WireframeGlobe = ({ size = 500, styles }) => {
  const R = size / 2;

  const meridians = Array.from({ length: 6 }).map((_, i) => (
    <div
      key={`meridian-${i}`}
      className={`absolute inset-0 rounded-full border-[1.5px] transition-colors duration-500 ${styles.globeLines}`}
      style={{ transform: `rotateY(${i * 30}deg)` }}
    />
  ));

  const latitudes = [-75, -60, -45, -30, -15, 15, 30, 45, 60, 75].map((angle) => {
    const rad = (angle * Math.PI) / 180;
    const radius = R * Math.cos(rad);
    const z = R * Math.sin(rad);
    return (
      <div
        key={`latitude-${angle}`}
        className={`absolute rounded-full border-[1.5px] transition-colors duration-500 ${styles.globeLines}`}
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          left: `${R - radius}px`,
          top: `${R - radius}px`,
          transform: `rotateX(90deg) translateZ(${z}px)`,
        }}
      />
    );
  });

  return (
    <div
      className="relative"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transformStyle: "preserve-3d",
      }}>
      {meridians}
      {latitudes}
      <div
        className={`absolute inset-0 rounded-full border-2 shadow-[0_0_15px_rgba(0,0,0,0.05)] transition-colors duration-500 ${styles.globeEquator}`}
        style={{ transform: "rotateX(90deg)" }}
      />
    </div>
  );
};

export default function MySocials() {
  const [trail, setTrail] = useState([]);
  const lastPosition = useRef({ x: 0, y: 0 });
  const imageIndex = useRef(0);
  const timeouts = useRef(new Set());

  const { theme } = useTheme();
  const activeTheme = THEME_STYLES[theme] || THEME_STYLES.light;

  const shouldReduceMotion = useReducedMotion();

  const tierResult = usePerformanceTier() || { tier: "high" };
  const tier = tierResult.tier;

  const quality = useMemo(() => getQualityPreset(tier) || { socialTrailDistance: 40, socialTrailLifeMs: 800 }, [tier]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const globeRotateX = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const globeRotateY = useSpring(mouseX, { stiffness: 40, damping: 20 });

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

      mouseX.set(((x - centerX) / centerX) * 20);
      mouseY.set(((y - centerY) / centerY) * -20);

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
        rotation: Math.random() * 20 - 10,
      };

      imageIndex.current = (imageIndex.current + 1) % trailImages.length;

      setTrail((prev) => [...prev.slice(-5), nextItem]);

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
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative min-h-[80vh] overflow-hidden px-5 py-18 md:min-h-screen md:px-10 flex flex-col justify-center transition-colors duration-500 ${activeTheme.bg}`}
      style={{ perspective: "1500px" }}>
      <div
        className={`absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent transition-colors duration-500 ${activeTheme.divider}`}
      />
      <div
        className={`absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent to-transparent transition-colors duration-500 ${activeTheme.divider}`}
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className={`h-150 w-150 rounded-full blur-[80px] transition-colors duration-500 ${activeTheme.glow}`} />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-30">
        <motion.div
          style={{
            rotateX: globeRotateX,
            rotateY: globeRotateY,
            transformStyle: "preserve-3d",
          }}
          className="flex items-center justify-center">
          <motion.div
            animate={{ rotateY: [0, -360] }}
            transition={{
              repeat: Infinity,
              duration: 45,
              ease: "linear",
            }}
            style={{ transformStyle: "preserve-3d" }}>
            <WireframeGlobe size={550} styles={activeTheme} />
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-6xl">
        <motion.div
          className="pointer-events-auto relative text-center"
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}>
          <div
            className={`text-xs font-semibold uppercase tracking-[0.4em] transition-colors duration-500 ${activeTheme.textSub}`}>
            Network Nodes
          </div>
          <h2
            className={`mt-4 text-[clamp(3.5rem,8vw,5.5rem)] font-black uppercase leading-[0.85] tracking-tight transition-colors duration-500 ${activeTheme.textMain}`}>
            Socials
          </h2>
          <h1
            className={`mt-6 text-2xl font-medium uppercase md:text-4xl transition-colors duration-500 ${activeTheme.textMuted}`}>
            Some Visuals <br />
            <span className={activeTheme.textHighlight}>to get an idea</span>
          </h1>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <AnimatePresence>
          {trail.map((item) => (
            <motion.img
              key={item.id}
              src={item.src}
              alt="Decorative network node"
              style={{
                position: "absolute",
                left: item.x,
                top: item.y,
                zIndex: item.zIndex,
              }}
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
                rotate: item.rotation,
              }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%", rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4, filter: "blur(10px)", x: "-50%", y: "-50%" }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className={`max-h-40 max-w-40 h-auto w-auto rounded-2xl object-contain shadow-2xl backdrop-blur-sm p-2 border transition-colors duration-500 ${activeTheme.trailCard}`}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
