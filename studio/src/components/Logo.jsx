"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

const Logo = ({ className = "" }) => {
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  const imgSrc = isMetal ? "/logo/logo-metal.svg" : "/logo/logo-light-dark.svg";

  const logoInvertClass = isDark ? "invert brightness-0" : "";

  return (
    <Image
      src={imgSrc}
      alt="Akhil"
      unoptimized
      fill
      priority
      className={`object-contain scale-125 ${logoInvertClass} ${className}`}
    />
  );
};

export default Logo;
