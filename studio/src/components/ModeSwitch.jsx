"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ModeSwitch() {
  const { theme, cycleTheme, mounted } = useTheme();

  if (!mounted) return <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />;

  const dotColor = theme === "dark" ? "bg-red-500" : theme === "metal" ? "bg-white" : "bg-black";

  const nextTheme = theme === "dark" ? "metal" : theme === "metal" ? "light" : "dark";

  const tooltipStyles = theme === "light" ? "text-black" : theme === "dark" ? "text-red-500" : "text-white";

  const arrowStyles = theme === "light" ? "border-b-black" : theme === "dark" ? "border-b-red-500" : "border-b-white";

  return (
    <div className="relative group inline-flex items-center justify-center">
      {" "}
      <button
        onClick={cycleTheme}
        className={`w-6 h-6 rounded-full transition-all duration-300 ${dotColor} shadow-md focus:outline-none`}
        aria-label={`Switch to ${nextTheme} theme`}
      />{" "}
      <span
        className={`absolute top-8 scale-90 opacity-0 pointer-events-none whitespace-nowrap px-2.5 py-1 text-[10px] font-medium shadow-xl transition-all duration-200 ease-out border group-hover:translate-y-1 group-hover:scale-100 group-hover:opacity-100 uppercase ${tooltipStyles}`}>
        Switch To {nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)} Mode{" "}
        <span
          className={`absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent ${arrowStyles}`}
        />{" "}
      </span>{" "}
    </div>
  );
}