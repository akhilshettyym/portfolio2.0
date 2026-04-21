"use client";

import { useState } from "react";

const primary = [
    "CPU 42% OK",
    "MEM 68% OK",
    "LATENCY 98ms",
    "DEPLOY PROD → SYNCED",
    "BUILD PASS",
    "TEST PASS",
    "API HEALTHY",
    "DB OK",
    "QUEUE NORMAL",
    "REQUESTS 1.3K/s",
    "CACHE HIT 92%",
    "VERCEL EDGE OK",
    "GITHUB ACTIONS RUNNING",
    "WORKS_ON_MY_MACHINE",
];

const secondary = [
    "WARN MEM SPIKE NODE-3",
    "TRACE: auth-service 120ms",
    "DEBUG cache-miss user-session",
    "CORS intermittent block",
    "retry queue latency rising",
    "minor GC pressure detected",
    "webpack rebuild slow",
    "edge function cold start",
    "log ingestion delayed",
    "synthetic test jitter detected",
];

export default function WarRoomHUD() {
    const [paused, setPaused] = useState(false);
    const [dir, setDir] = useState("left");

    const streamA = [...primary, ...primary];
    const streamB = [...secondary, ...secondary];

    return (
        <div className="w-full bg-black font-mono text-xs border-y border-white/10">

            <div className="flex justify-between px-3 py-1 text-[10px] bg-white/5 border-b border-white/10 uppercase tracking-widest text-gray-500">
                <button onClick={() => setPaused((p) => !p)} className="hover:text-white transition">
                    {paused ? "RUN" : "PAUSE"}
                </button>

                <div> OBSERVABILITY WAR ROOM // CIRCULAR STREAM </div>

                <button onClick={() => setDir((d) => (d === "left" ? "right" : "left"))} className="hover:text-white transition">
                    DIR {dir === "left" ? "←" : "→"}
                </button>
            </div>

            <div className="relative h-4 overflow-hidden border-b border-white/10">
                <div className={`marquee ${dir} ${paused ? "paused" : ""}`}>
                    {streamA.map((t, i) => (
                        <span key={i} className="text-green-400 opacity-80 hover:text-white hover:opacity-100 transition"> {t} </span>
                    ))}
                </div>
            </div>

            <div className="relative h-4 overflow-hidden">
                <div className={`marquee2 ${dir === "left" ? "right" : "left"} ${paused ? "paused" : ""}`}>
                    {streamB.map((t, i) => (
                        <span key={i} className="text-[10px] text-gray-500 opacity-60"> {t} </span>
                    ))}
                </div>
            </div>
        </div>
    );
}