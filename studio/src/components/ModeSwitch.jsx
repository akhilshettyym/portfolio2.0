"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeDot() {
  const { theme, cycleTheme, mounted } = useTheme();

  if (!mounted) return <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />;

  const dotColor = theme === "dark" ? "bg-white" : theme === "metal" ? "bg-zinc-500" : "bg-black";

  return (
    <button
      onClick={cycleTheme}
      className={`w-6 h-6 rounded-full transition-colors duration-300 ${dotColor} hover:scale-110`}
      aria-label="Toggle Theme"
      title={`Current Theme: ${theme}`}
    />
  );
}
