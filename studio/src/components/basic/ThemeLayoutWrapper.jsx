"use client";

import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeLayoutWrapper({ children }) {
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  useEffect(() => {
    if (isDark) {
      document.body.className = "bg-[#0a0a0a] text-white transition-colors duration-500";
    } else if (isMetal) {
      document.body.className = "bg-[#050000] text-red-500 transition-colors duration-500";
    } else {
      document.body.className = "bg-white text-black transition-colors duration-500";
    }
  }, [isDark, isMetal]);

  const mainThemeClass = isDark
    ? "bg-[#0a0a0a] text-white"
    : isMetal
      ? "bg-[#050000] text-red-500"
      : "bg-white text-black";

  return (
    <main
      id="main-content"
      className={`relative pt-25 flex flex-col min-h-screen transition-colors duration-500 ${mainThemeClass}`}>
      {children}
    </main>
  );
}
