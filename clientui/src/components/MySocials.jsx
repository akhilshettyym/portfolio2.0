"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { getQualityPreset } from "@/lib/performance/applyQualityTier";

const trailImages = [
  "/bubbles/bubbles.docker.svg",
  "/bubbles/bubbles.github.svg",
  "/bubbles/bubbles.kubernetes.svg",
  "/bubbles/bubbles.salesforce.svg",
  "/bubbles/bubbles.vscode.svg",
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/akhilshettyym",
    icon: FaGithub,
    meta: "code archive",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: FaLinkedinIn,
    meta: "work signal",
  },
  {
    label: "X",
    href: "https://x.com/",
    icon: FaXTwitter,
    meta: "short notes",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: FaInstagram,
    meta: "visual log",
  },
  {
    label: "LeetCode",
    href: "https://leetcode.com/",
    icon: SiLeetcode,
    meta: "problem reps",
  },
];

const MySocials = () => {
  const [trail, setTrail] = useState([]);
  const lastPosition = useRef({ x: 0, y: 0 });
  const imageIndex = useRef(0);
  const shouldReduceMotion = useReducedMotion();
  const { tier, isTier2 } = usePerformanceTier();
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
      x,
      y,
      src: trailImages[imageIndex.current],
    };

    imageIndex.current = (imageIndex.current + 1) % trailImages.length;
    setTrail((prev) => [...prev.slice(isTier2 ? -2 : -5), nextItem]);

    window.setTimeout(() => {
      setTrail((prev) => prev.filter((item) => item.id !== nextItem.id));
    }, quality.socialTrailLifeMs);
  };

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 80, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: isTier2 ? 0.45 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-[72vh] overflow-hidden bg-white px-5 py-18 text-black md:min-h-screen md:px-10">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] bg-size-[56px_56px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-black/15" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/15" />

      {!isTier2 && (
        <div className="absolute inset-0 pointer-events-none">
          {trailImages.map((src, index) => (
            <motion.img
              key={src}
              src={src}
              alt=""
              className="absolute h-16 w-16 opacity-20"
              style={{
                left: `${12 + index * 18}%`,
                top: `${18 + (index % 2) * 42}%`,
              }}
              animate={{ y: [0, -24, 0], rotate: [0, 10, -8, 0] }}
              transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-[56vh] w-full max-w-6xl flex-col justify-center gap-10 md:min-h-[78vh]">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.32em] text-black/40">
            network nodes
          </div>
          <h2 className="mt-3 max-w-3xl text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-[0.88] tracking-normal">
            Socials
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-6 text-black/55 md:text-base">
            A few live exits from the portfolio shell. Hover, scan, or jump straight in.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {socials.map((social, index) => {
            const Icon = social.icon;

            return (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: isTier2 ? 0 : index * 0.08 }}
                whileHover={isTier2 ? undefined : { y: -10, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
                className="group relative overflow-hidden rounded-lg border border-black/10 bg-white p-4 shadow-[6px_6px_0px_#000000] transition-colors hover:bg-black hover:text-white">
                <div className="absolute inset-x-0 top-0 h-px bg-black/40 transition group-hover:bg-white/70" />
                <div className="flex items-start justify-between gap-4">
                  <Icon size={22} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/35 transition group-hover:text-white/45">
                    0{index + 1}
                  </span>
                </div>
                <div className="mt-8 text-xl font-black uppercase leading-none">
                  {social.label}
                </div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-black/40 transition group-hover:text-white/50">
                  {social.meta}
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
        <AnimatePresence>
          {trail.map((item) => (
            <motion.img
              key={item.id}
              src={item.src}
              alt=""
              initial={{ opacity: 0, scale: 0.25, x: item.x - 56, y: item.y - 56, rotate: -8 }}
              animate={{ opacity: isTier2 ? 0.35 : 0.8, scale: isTier2 ? 0.65 : 1, rotate: 8 }}
              exit={{ opacity: 0, scale: 0.2, filter: "blur(8px)" }}
              transition={{ duration: isTier2 ? 0.35 : 0.6, ease: "easeOut" }}
              className="absolute h-28 w-28 rounded-lg border border-black/10 bg-white/60 p-3 shadow-lg backdrop-blur-sm"
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default MySocials;