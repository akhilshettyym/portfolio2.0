"use client";

import "@/styles/dev_ticker.css";
import { useTheme } from "@/context/ThemeContext";
import { getDevTickerStyles } from "@/utils/themeSwatch";
import { DEV_TICKERS, DEV_TICKERS_TIER } from "@/utils/basic";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

export default function DevTicker() {
  const { theme } = useTheme();
  const { isTier2 } = usePerformanceTier();
  const styles = getDevTickerStyles(theme);

  const stream = [...DEV_TICKERS, ...DEV_TICKERS];

  const fadeColor = theme === "light" ? "#ffffff" : "#000000";

  return (
    <section id="devticker" className={`w-full px-4 md:px-8 lg:px-12 ${styles.page}`}>
      <div className={`relative mx-auto w-full max-w-360 overflow-hidden font-sans ${styles.section}`}>
        <div className="relative flex h-9 items-center overflow-hidden">
          <div
            className="dev-ticker-fade dev-ticker-fade-left"
            style={{ background: `linear-gradient(to right, ${fadeColor} 0%, ${fadeColor} 30%, transparent 100%)` }}
            aria-hidden="true"
          />

          <div
            className="dev-ticker-fade dev-ticker-fade-right"
            style={{ background: `linear-gradient(to left, ${fadeColor} 0%, ${fadeColor} 30%, transparent 100%)` }}
            aria-hidden="true"
          />

          {isTier2 ? (
            <div className="flex shrink-0 items-center">
              <span className={`mx-6 text-[8px] font-medium uppercase tracking-[0.22em] ${styles.text}`}>
                {DEV_TICKERS_TIER}
              </span>
            </div>
          ) : (
            <div className="dev-marquee flex items-center whitespace-nowrap">
              {stream.map((item, i) => (
                <div key={`${item}-${i}`} className="flex shrink-0 items-center">
                  <span className={`mx-6 text-[8px] font-medium uppercase tracking-[0.22em] ${styles.text}`}>
                    {item}
                  </span>

                  <span className={`text-[10px] ${styles.separator}`} aria-hidden="true">
                    +
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
