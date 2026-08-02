"use client";

import "@/styles/dev_ticker.css";
import { useTheme } from "@/context/ThemeContext";
import { DEV_TICKERS, DEV_TICKERS_TIER } from "@/utils/basic";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

export default function DevTicker() {
  const { theme } = useTheme();
  const { isTier2 } = usePerformanceTier();
  const stream = [...DEV_TICKERS, ...DEV_TICKERS];

  const getStyles = (currentTheme) => {
    const dark = currentTheme === "dark";
    const metal = currentTheme === "metal";
    return {
      section: dark
        ? "border-y border-white/10 bg-black text-white selection:bg-white selection:text-black"
        : metal
          ? "border-y border-red-500/20 bg-black text-red-500 selection:bg-red-500 selection:text-black"
          : "border-y border-black/8 bg-white text-slate-900 selection:bg-slate-900 selection:text-white",
      fadeLeft: dark
        ? "bg-linear-to-r from-black via-black/95 to-transparent"
        : metal
          ? "bg-linear-to-r from-black via-black/95 to-transparent"
          : "bg-linear-to-r from-white via-white/95 to-transparent",
      fadeRight: dark
        ? "bg-linear-to-l from-black via-black/95 to-transparent"
        : metal
          ? "bg-linear-to-l from-black via-black/95 to-transparent"
          : "bg-linear-to-l from-white via-white/95 to-transparent",
      text: dark ? "text-white/45" : metal ? "text-red-500/45" : "text-black/45",
      separator: dark ? "text-white/15" : metal ? "text-red-500/20" : "text-black/15",
    };
  };

  const styles = getStyles(theme);

  return (
    <section className={`relative w-full font-sans overflow-hidden ${styles.section}`}>
      <div className="relative h-9 flex items-center">
        <div className={`absolute left-0 top-0 h-full w-24 z-10 pointer-events-none ${styles.fadeLeft}`} />

        <div className={`absolute right-0 top-0 h-full w-24 z-10 pointer-events-none ${styles.fadeRight}`} />

        {isTier2 ? (
          <div className="flex items-center shrink-0">
            <span className={`mx-6 text-[8px] uppercase tracking-[0.22em] font-medium ${styles.text}`}>
              {DEV_TICKERS_TIER}
            </span>
          </div>
        ) : (
          <div className="dev-marquee flex items-center whitespace-nowrap">
            {stream.map((item, i) => (
              <div key={i} className="flex items-center shrink-0">
                <span className={`mx-6 text-[8px] uppercase tracking-[0.22em] font-medium ${styles.text}`}>{item}</span>
                <span className={`text-[10px] ${styles.separator}`}> + </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
