"use client";

export default function AboutConsole() {
    return (
        <div className="w-full max-w-full overflow-x-hidden box-border px-3 sm:px-4">

            {/* Top Labels */}
            <div className="flex justify-between text-[10px] sm:text-xs tracking-[0.25em] text-white/50 mb-5">
                <span>/ FEATURED POST</span>
                <span>/ FEATURED VIDEO</span>
            </div>

            {/* Divider */}
            <div className="border-t border-white/20 mb-6" />

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

                {/* LEFT */}
                <div className="flex flex-col gap-5 min-w-0">

                    <div className="border border-white/30 p-4 sm:p-6 min-w-0">

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] sm:text-xs tracking-[0.2em] text-white/50 whitespace-nowrap">
                                [ FIG. 1 ]
                            </span>
                            <div className="flex-1 border-t border-white/20" />
                        </div>

                        {/* Media */}
                        <div className="w-full aspect-video bg-white/5 border border-white/10 rounded-sm flex items-center justify-center overflow-hidden">
                            <p className="text-white/30 text-xs sm:text-sm text-center px-2">
                                Featured Post Image
                            </p>
                        </div>

                        {/* Text */}
                        <h3 className="mt-4 text-base sm:text-xl font-semibold leading-snug text-white break-words">
                            Provision a production-ready dev stack from your terminal
                        </h3>

                        <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed break-words">
                            Provision hosting, databases, auth, analytics, AI and other dev tools from the Stripe CLI. Stripe Projects creates real resources in your own environment.
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 border border-white/20 text-white/60">
                                DEVELOPER PRODUCTIVITY
                            </span>
                            <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 border border-white/20 text-white/60">
                                ENGINEERING
                            </span>
                            <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 border border-white/20 text-white/60">
                                AI
                            </span>
                        </div>
                    </div>

                    <button className="w-full border border-white/30 py-2.5 sm:py-3 text-xs sm:text-sm rounded-full hover:bg-white hover:text-black transition">
                        More posts
                    </button>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-5 min-w-0">

                    <div className="border border-white/30 p-4 sm:p-6 min-w-0">

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] sm:text-xs tracking-[0.2em] text-white/50 whitespace-nowrap">
                                [ FIG. 2 ]
                            </span>
                            <div className="flex-1 border-t border-white/20" />
                        </div>

                        {/* Media */}
                        <div className="w-full aspect-video bg-white/5 border border-white/10 rounded-sm flex items-center justify-center overflow-hidden">
                            <p className="text-white/30 text-xs sm:text-sm text-center px-2">
                                Featured Video Image
                            </p>
                        </div>

                        {/* Text */}
                        <h3 className="mt-4 text-base sm:text-xl font-semibold leading-snug text-white break-words">
                            How Noiré streamlines talent acquisition for startups
                        </h3>

                        <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed break-words">
                            In this interview from the Dublin Build Day, Eoln Lawless discusses bridging the gap between early-stage founders and talent.
                        </p>

                        {/* Tag */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 border border-white/20 text-white/60">
                                VIDEO
                            </span>
                        </div>
                    </div>

                    <button className="w-full border border-white/30 py-2.5 sm:py-3 text-xs sm:text-sm rounded-full hover:bg-white hover:text-black transition">
                        Move videos
                    </button>
                </div>
            </div>

            {/* Bottom Divider */}
            <div className="border-t border-white/20 mt-6 mb-6" />
        </div>
    );
}