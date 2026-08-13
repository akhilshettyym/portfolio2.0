"use client";

import "@/styles/dev_ticker.css";
import { useTheme } from "@/context/ThemeContext";
import { DEV_TICKERS, DEV_TICKERS_TIER } from "@/utils/basic";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { getDevTickerStyles } from "@/utils/themeSwatch";

export default function DevTicker() {
  const { theme } = useTheme();
  const { isTier2 } = usePerformanceTier();
  const styles = getDevTickerStyles(theme);
  const stream = [...DEV_TICKERS, ...DEV_TICKERS];

  return (
    <section id="devticker">
      <div className={`relative w-full font-sans overflow-hidden ${styles.section}`}>
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
                  <span className={`mx-6 text-[8px] uppercase tracking-[0.22em] font-medium ${styles.text}`}>
                    {item}
                  </span>
                  <span className={`text-[10px] ${styles.separator}`}> + </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
