"use client";

import "@/styles/devticker.css";

const items = [
    "BUILD STATUS — STABLE",
    "API RESPONSE 124ms",
    "DEPLOYMENT SYNCHRONIZED",
    "CACHE HIT RATE 92%",
    "EDGE FUNCTIONS ACTIVE",
    "AUTH SERVICE HEALTHY",
    "CI/CD PIPELINE PASSING",
    "REQUEST LOAD NORMAL",
    "SCALABLE SYSTEM DESIGN",
    "THREE.JS RENDER LOOP ACTIVE",
    "NEXT.JS APP ROUTER READY",
    "PRODUCTION BUILD OPTIMIZED",
    "INTERACTIVE UI SYSTEMS",
    "REAL-TIME MOTION ENGINE",
    "DATABASE CONNECTION SECURE",
    "PERFORMANCE SCORE — HIGH",
    "TYPE-SAFE APPLICATION LAYER",
    "FULL STACK ARCHITECTURE",
    "SYSTEM LATENCY WITHIN RANGE",
    "SHIPPING RELIABLE EXPERIENCES",
];

export default function DevTicker() {
    const stream = [...items, ...items];

    return (
        <section className="w-full border-y border-black/8 bg-white overflow-hidden">
            <div className="relative h-9 flex items-center">
                <div className="absolute left-0 top-0 h-full w-24 bg-linear-to-r from-white via-white/95 to-transparent z-10 pointer-events-none" />

                <div className="absolute right-0 top-0 h-full w-24 bg-linear-to-l from-white via-white/95 to-transparent z-10 pointer-events-none" />

                <div className="dev-marquee flex items-center whitespace-nowrap">
                    {stream.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center shrink-0"
                        >
                            <span className="mx-6 text-[8px] uppercase tracking-[0.22em] text-black/45 font-medium">
                                {item}
                            </span>

                            <span className="text-black/15 text-[10px]">
                                +
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}