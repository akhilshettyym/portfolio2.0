"use client";

import "@/styles/dev_ticker.css";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { DEV_TICKERS, DEV_TICKERS_TIER } from "@/utils/basic-utils";

const DevTicker = () => {

  const { isTier2 } = usePerformanceTier();
  const stream = [...DEV_TICKERS, ...DEV_TICKERS];

  return (
    <section className="relative w-full border-y border-black/8 bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white overflow-hidden">
      <div className="relative h-9 flex items-center">
        <div className="absolute left-0 top-0 h-full w-24 bg-linear-to-r from-white via-white/95 to-transparent z-10 pointer-events-none" />

        <div className="absolute right-0 top-0 h-full w-24 bg-linear-to-l from-white via-white/95 to-transparent z-10 pointer-events-none" />

        {isTier2 ? (
          <div className="flex items-center shrink-0">
            <span className="mx-6 text-[8px] uppercase tracking-[0.22em] text-black/45 font-medium">
              {DEV_TICKERS_TIER}
            </span>
          </div>
        ) : (
          <div className="dev-marquee flex items-center whitespace-nowrap">
            {stream.map((item, i) => (
              <div key={i} className="flex items-center shrink-0">
                <span className="mx-6 text-[8px] uppercase tracking-[0.22em] text-black/45 font-medium">
                  {item}
                </span>
                <span className="text-black/15 text-[10px]"> + </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default DevTicker;