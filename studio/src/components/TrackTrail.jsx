"use client";

import Image from "next/image";
import "@/styles/track_trail.css";
import React, { memo } from "react";
import { useTheme } from "@/context/ThemeContext";

const DEFAULT_DATA = {
  rankImg: "/trailhead/double-star-ranger.svg",
  rankTitle: "Double Star Ranger",
  points: "1,28,700",
  superbadges: "14",
  badges: "251",
  trails: "24",
};

const BASE_BANNERS = ["/trailhead/champion.svg", "/trailhead/innovator.svg"];

const DEFAULT_BANNERS = Array(4).fill(BASE_BANNERS).flat();

const TrackTrail = memo(({ data = DEFAULT_DATA, banners = DEFAULT_BANNERS }) => {
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const isMetal = theme === "metal";

  const styles = {
    wrapper: isDark ? "bg-[#0a0a0a]" : isMetal ? "bg-black" : "bg-white",

    container: isDark
      ? "bg-[#0a0a0a] border-white/10 hover:border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.9)]"
      : isMetal
        ? "bg-black border-red-500/20 hover:border-red-500/40 shadow-[0_8px_30px_rgba(0,0,0,0.9)]"
        : "bg-white border-neutral-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]",

    rankBox: isDark
      ? "bg-[#0a0a0a] border-white/10"
      : isMetal
        ? "bg-black border-red-500/20"
        : "bg-linear-to-b from-white to-neutral-50/50 border-neutral-100",

    rankGlow: isDark ? "bg-neutral-800/20" : isMetal ? "bg-red-950/30" : "bg-blue-400/10",
    rankTitle: isDark ? "text-white" : isMetal ? "text-red-500" : "text-neutral-800",

    divider: isDark ? "bg-white/10" : isMetal ? "bg-red-500/20" : "bg-neutral-100",

    statValue: isDark ? "text-white" : isMetal ? "text-red-500" : "text-neutral-900",
    statLabel: isDark ? "text-white/40" : isMetal ? "text-red-500/50" : "text-neutral-400",

    marqueeBox: isDark
      ? "bg-[#0a0a0a] border-white/10"
      : isMetal
        ? "bg-black border-red-500/20"
        : "bg-neutral-50/40 border-neutral-100",

    imageFilter: isDark || isMetal ? "drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]" : "drop-shadow-sm",
  };

  return (
    <section className={`w-full py-12 px-4 md:px-8 lg:px-12 transition-colors duration-500 ${styles.wrapper}`}>
      <div
        className={`w-full max-w-6xl mx-auto rounded-md border overflow-hidden flex flex-col lg:flex-row transition-all duration-500 group ${styles.container}`}>
        <div
          className={`relative p-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r min-w-50 shrink-0 transition-colors duration-500 ${styles.rankBox}`}>
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 blur-2xl rounded-full pointer-events-none transition-colors duration-500 ${styles.rankGlow}`}
          />

          <Image
            className={`object-contain mb-3 transition-all duration-500 ease-out relative z-10 ${styles.imageFilter}`}
            src={data.rankImg}
            alt={data.rankTitle}
            width={60}
            height={60}
            priority
          />

          <h2
            className={`text-xs font-black uppercase tracking-normal text-center relative z-10 transition-colors duration-500 ${styles.rankTitle}`}>
            {data.rankTitle}
          </h2>
        </div>

        <div className="flex-1 flex flex-row flex-wrap lg:flex-nowrap items-center justify-around px-4 lg:px-10 py-6 lg:py-0 gap-4 lg:gap-2">
          <StatItem
            value={data.superbadges}
            label="Superbadges"
            valueClass={styles.statValue}
            labelClass={styles.statLabel}
          />
          <div className={`hidden lg:block w-px h-10 transition-colors duration-500 ${styles.divider}`} />

          <StatItem
            value={data.points}
            label="Total Points"
            valueClass={styles.statValue}
            labelClass={styles.statLabel}
          />
          <div className={`hidden lg:block w-px h-10 transition-colors duration-500 ${styles.divider}`} />

          <StatItem value={data.badges} label="Badges" valueClass={styles.statValue} labelClass={styles.statLabel} />
          <div className={`hidden lg:block w-px h-10 transition-colors duration-500 ${styles.divider}`} />

          <StatItem value={data.trails} label="Trails" valueClass={styles.statValue} labelClass={styles.statLabel} />
        </div>

        <div
          className={`w-full lg:w-75 h-2 lg:h-auto border-t lg:border-t-0 lg:border-l flex items-center overflow-hidden fade-edges relative shrink-0 transition-colors duration-500 ${styles.marqueeBox}`}>
          <div className="animate-sleek-marquee py-3 lg:py-0">
            <BannerSet banners={banners} setId="set1" filterClass={styles.imageFilter} />
            <BannerSet banners={banners} setId="set2" filterClass={styles.imageFilter} />
          </div>
        </div>
      </div>
    </section>
  );
});

TrackTrail.displayName = "TrackTrail";

const StatItem = memo(({ value, label, valueClass, labelClass }) => (
  <div className="flex flex-col items-center justify-center w-1/3 lg:w-auto min-w-20">
    <span className={`text-2xl lg:text-3xl font-black tracking-tighter transition-colors duration-500 ${valueClass}`}>
      {value}
    </span>
    <span
      className={`text-[9px] lg:text-[10px] font-bold uppercase tracking-normal mt-1 transition-colors duration-500 ${labelClass}`}>
      {label}
    </span>
  </div>
));

StatItem.displayName = "StatItem";

const BannerSet = memo(({ banners, setId, filterClass }) => (
  <div className="flex items-center w-max px-4 gap-5">
    {banners.map((url, idx) => (
      <div key={`${setId}-${idx}`} className="relative flex items-center justify-center h-16 w-40 shrink-0">
        <Image
          src={url}
          alt={`Banner ${idx}`}
          width={160}
          height={96}
          className={`object-contain cursor-pointer hover:scale-110 transition-all duration-300 ${filterClass}`}
        />
      </div>
    ))}
  </div>
));

BannerSet.displayName = "BannerSet";

export default TrackTrail;
