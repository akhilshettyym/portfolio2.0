import Image from "next/image";
import React, { memo } from "react";

const customStyles = `
@keyframes sleekMarquee {
 0% { transform: translateX(0%); }
 100% { transform: translateX(-50%); }
}
.animate-sleek-marquee {
 display: flex;
width: max-content;
 animation: sleekMarquee 25s linear infinite;
}
.animate-sleek-marquee:hover {
 animation-play-state: paused;
}
.fade-edges {
 mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
 -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}
`;

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
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-md border border-neutral-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row transition-all duration-500 mb-6 group">
      <style>{customStyles}</style>

      <div className="relative p-4 flex flex-col items-center justify-center bg-linear-to-b from-white to-neutral-50/50 border-b lg:border-b-0 lg:border-r border-neutral-100 min-w-50 shrink-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-400/10 blur-2xl rounded-full pointer-events-none" />

        <Image
          className="object-contain drop-shadow-sm mb-3 transition-transform duration-500 ease-out relative z-10"
          src={data.rankImg}
          alt={data.rankTitle}
          width={60}
          height={60}
          priority
        />

        <h2 className="text-xs font-black text-neutral-800 uppercase tracking-normal text-center relative z-10">
          {data.rankTitle}
        </h2>
      </div>

      <div className="flex-1 flex flex-row flex-wrap lg:flex-nowrap items-center justify-around px-4 lg:px-10 py-6 lg:py-0 gap-4 lg:gap-2">
        <StatItem value={data.superbadges} label="Superbadges" />
        <div className="hidden lg:block w-px h-10 bg-neutral-100" />
        <StatItem value={data.points} label="Total Points" />
        <div className="hidden lg:block w-px h-10 bg-neutral-100" />
        <StatItem value={data.badges} label="Badges" />
        <div className="hidden lg:block w-px h-10 bg-neutral-100" />
        <StatItem value={data.trails} label="Trails" />
      </div>

      <div className="w-full lg:w-75 h-2 lg:h-auto bg-neutral-50/40 border-t lg:border-t-0 lg:border-l border-neutral-100 flex items-center overflow-hidden fade-edges relative shrink-0">
        <div className="animate-sleek-marquee">
          <BannerSet banners={banners} setId="set1" />
          <BannerSet banners={banners} setId="set2" />
        </div>
      </div>
    </div>
  );
});

TrackTrail.displayName = "TrackTrail";

const StatItem = memo(({ value, label }) => (
  <div className="flex flex-col items-center justify-center w-1/3 lg:w-auto min-w-20">
    <span className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tighter transition-transform duration-300">
      {" "}
      {value}{" "}
    </span>
    <span className="text-[9px] lg:text-[10px] font-bold text-neutral-400 uppercase tracking-normal mt-1">
      {" "}
      {label}{" "}
    </span>
  </div>
));

StatItem.displayName = "StatItem";

const BannerSet = memo(({ banners, setId }) => (
  <div className="flex items-center w-max px-4 gap-5">
    {banners.map((url, idx) => (
      <div key={`${setId}-${idx}`} className="relative flex items-center justify-center h-16 w-40 shrink-0">
        <Image
          src={url}
          alt={`Banner ${idx}`}
          width={160}
          height={96}
          className="object-contain drop-shadow-sm cursor-pointer hover:scale-110 transition-all duration-300"
        />
      </div>
    ))}
  </div>
));

BannerSet.displayName = "BannerSet";

export default TrackTrail;
