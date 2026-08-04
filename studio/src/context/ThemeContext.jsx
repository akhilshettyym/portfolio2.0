"use client";

import { SITE_THEME } from "@/utils/storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

const THEMES = ["light", "dark", "metal"];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem(SITE_THEME);

    const timer = setTimeout(() => {
      if (storedTheme && THEMES.includes(storedTheme)) {
        setTheme(storedTheme);
      }
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const cycleTheme = () => {
    setTheme((prevTheme) => {
      const currentIndex = THEMES.indexOf(prevTheme);
      const nextIndex = (currentIndex + 1) % THEMES.length;
      const newTheme = THEMES[nextIndex];

      localStorage.setItem(SITE_THEME, newTheme);
      return newTheme;
    });
  };

  return <ThemeContext.Provider value={{ theme, cycleTheme, mounted }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
