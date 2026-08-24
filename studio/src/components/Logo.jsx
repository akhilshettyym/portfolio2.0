"use client";

import React from "react";
import "@/styles/navbar.css";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

const Logo = ({ className = "" }) => {
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  const imgSrc = isMetal ? "/logo/logo-metal.svg" : "/logo/logo-light-dark.svg";
  const logoInvertClass = isDark ? "invert brightness-0" : "";

  const glowThemeVars = isMetal
    ? {
        "--glow-main": "rgba(239, 68, 68, 0.85)",
        "--glow-accent-1": "#ff0055",
        "--glow-accent-2": "#00f0ff",
      }
    : isDark
      ? {
          "--glow-main": "rgba(129, 140, 248, 0.85)",
          "--glow-accent-1": "#a855f7",
          "--glow-accent-2": "#38bdf8",
        }
      : {
          "--glow-main": "rgba(79, 70, 229, 0.6)",
          "--glow-accent-1": "#ec4899",
          "--glow-accent-2": "#0ea5e9",
        };

  return (
    <div className="relative w-full h-full logo-cyber-hover" style={glowThemeVars}>
      <Image
        src={imgSrc}
        alt="Akhil"
        unoptimized
        fill
        priority
        className={`object-contain scale-125 ${logoInvertClass} ${className}`}
      />
    </div>
  );
};

export default Logo;
