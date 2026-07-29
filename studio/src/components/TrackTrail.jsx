import Image from "next/image";
import React, { memo } from "react";

const marqueeStyles = `
  @keyframes scrollLeftToRight {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0%); }
  }
  .marquee-container {
    display: flex;
    width: max-content;
    animation: scrollLeftToRight 40s linear infinite; 
  }
  .marquee-container:hover {
    animation-play-state: paused;
  }
`;

const DEFAULT_DATA = {
  rankImg: "/trailhead/double-star-ranger.svg",
  rankTitle: "Double Star Ranger",
  points: "128,200",
  superbadges: "14",
  badges: "250",
  trails: "23",
};

const BASE_BANNERS = ["/trailhead/champion.svg", "/trailhead/champion.svg", "/trailhead/champion.svg"];

const DEFAULT_BANNERS = Array(4).fill(BASE_BANNERS).flat();

const TrackTrail = memo(({ data = DEFAULT_DATA, banners = DEFAULT_BANNERS }) => {
  return (
    <div className="max-w-300 mx-auto bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 mb-6">
      <style>{marqueeStyles}</style>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
        <div className="flex flex-col items-center shrink-0 w-35">
          <Image
            className="object-contain drop-shadow-sm mb-2 hover:scale-105 transition-transform duration-300"
            src={data.rankImg}
            alt={data.rankTitle}
            width={80}
            height={80}
            priority
          />
          <h2 className="text-[11px] font-bold text-black uppercase tracking-widest text-center mt-2">
            {data.rankTitle}
          </h2>
        </div>

        <div className="flex-1 w-full py-4 md:py-0 md:border-x border-gray-200 px-4 md:px-8">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-center">
            <StatItem value={data.superbadges} label="Superbadges" />
            <StatItem value={data.points} label="Total Points" />
            <StatItem value={data.badges} label="Badges" />
            <StatItem value={data.trails} label="Trails" />
          </div>
        </div>

        <div className="shrink-0 w-full md:w-96 h-25 overflow-hidden relative rounded-md border border-gray-100 shadow-inner bg-gray-50 flex items-center">
          <div className="marquee-container">
            <BannerSet banners={banners} setId="set1" />
            <BannerSet banners={banners} setId="set2" />
          </div>
        </div>
      </div>
    </div>
  );
});

TrackTrail.displayName = "TrackTrail";

const StatItem = memo(({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-2xl font-black text-black tracking-tight">{value}</span>
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">{label}</span>
  </div>
));
StatItem.displayName = "StatItem";

const BannerSet = memo(({ banners, setId }) => (
  <div className="flex items-center justify-around w-max px-3 gap-6">
    {banners.map((url, idx) => (
      <div key={`${setId}-${idx}`} className="relative flex items-center justify-center h-30 w-56">
        <Image
          src={url}
          alt={`Banner ${idx}`}
          width={230}
          height={100}
          className="object-contain drop-shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300"
        />
      </div>
    ))}
  </div>
));
BannerSet.displayName = "BannerSet";

export default TrackTrail;
