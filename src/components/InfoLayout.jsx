import React from "react";
import Hero from "./Hero";

const InfoLayout = () => {
    return (
        <section className="w-full flex justify-center py-8">

            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8">

                <div className="md:col-span-2">
                    <div className="sticky top-24">
                        <p className="text-xs tracking-[0.35em] font-semibold text-black/60 uppercase">
                            01_INTRO
                        </p>
                    </div>
                </div>

                <div className="md:col-span-7">

                    <h1 className="text-3xl font-black tracking-tight mb-4">
                        HI
                    </h1>

                    <div className="w-full h-17.5 mb-6">
                        <Hero />
                    </div>

                    <div className="space-y-5 text-sm leading-relaxed text-black/80">
                        {/* DESCRIPTION HERE */}
                    </div>
                </div>

                <div className="md:col-span-3 flex justify-end">
                    <div
                        className="relative w-50 h-70 shadow-xl overflow-hidden bg-black/5"
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% 86%, 86% 100%, 0 100%)" }}>
                        <img src="/your-image.jpg" className="w-full h-full object-cover" alt="profile" />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default InfoLayout;