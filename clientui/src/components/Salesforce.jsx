import React from "react";

const Salesforce = () => {
    const data = {
        rankImg: "",
        rankTitle: "Double Star Ranger",
        agentBlazerBannerUrl: "",
        points: "121,125",
        superbadges: "13",
        badges: "239",
        trails: "23",
    };

    const BANNER = [
        "/my_experience/education/edu_be.svg",
        "/my_experience/education/edu_be.svg",
        "/my_experience/education/edu_be.svg",
    ]

    const banners = Array(4).fill(BANNER);

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 my-6">
            <style>
                {`
               @keyframes scrollLeftToRight {
                   0% { transform: translateX(-50%); }
                   100% { transform: translateX(0%); }
               }
               .marquee-container {
                   display: flex;
                   width: max-content;
                   animation: scrollLeftToRight 15s linear infinite; 
               }
               .marquee-container:hover {
                   animation-play-state: paused;
               }
               `}
            </style>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
                <div className="flex flex-col items-center shrink-0 w-32 md:w-40">
                    <img
                        className="h-16 w-16 object-contain drop-shadow-sm mb-2 hover:scale-105 transition-transform duration-300"
                        src={data.rankImg}
                        alt={data.rankTitle}
                    />
                    <h2 className="text-[11px] font-bold text-black uppercase tracking-widest text-center">
                        {data.rankTitle}
                    </h2>
                </div>

                <div className="flex-1 w-full py-4 md:py-0 md:border-x border-gray-200 px-4 md:px-8">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-center">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-black tracking-tight">
                                {data.superbadges}
                            </span>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
                                Superbadges
                            </span>
                        </div>

                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-black tracking-tight">
                                {data.points}
                            </span>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
                                Total Points
                            </span>
                        </div>

                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-black tracking-tight">
                                {data.badges}
                            </span>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
                                Badges
                            </span>
                        </div>

                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-black tracking-tight">
                                {data.trails}
                            </span>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
                                Trails
                            </span>
                        </div>
                    </div>
                </div>

                <div className="shrink-0 w-full md:w-90 h-30 overflow-hidden relative rounded-md border border-gray-100 shadow-inner bg-gray-50 flex items-center">
                    <div className="marquee-container">
                        <div className="flex items-center justify-around w-max px-2 gap-4">
                            {banners.map((url, idx) => (
                                <img
                                    key={`set1-${idx}`}
                                    src={url}
                                    alt={`Banner 1-${idx}`}
                                    className="h-20 w-65 object-cover rounded shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300"
                                />
                            ))}
                        </div>

                        <div className="flex items-center justify-around w-max px-2 gap-4">
                            {banners.map((url, idx) => (
                                <img
                                    key={`set2-${idx}`}
                                    src={url}
                                    alt={`Banner 2-${idx}`}
                                    className="h-18 w-32 object-cover rounded shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Salesforce;