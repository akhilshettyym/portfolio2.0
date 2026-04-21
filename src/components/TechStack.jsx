"use client";

import { useEffect, useState } from "react";

const ALL_TECHS = [
    { name: "HTML", src: "/logo/html.svg" },
    { name: "CSS", src: "/logo/css.svg" },
    { name: "JAVASCRIPT", src: "/logo/javascript.svg" },
    { name: "REACT JS", src: "/logo/react.svg" },
    { name: "NODE JS", src: "/logo/nodejs.svg" },
    { name: "EXPRESS JS", src: "/logo/expressjs.svg" },
    { name: "MONGO DB", src: "/logo/mongodb.svg" },
    { name: "SQL", src: "/logo/sql.svg" },
    { name: "DOCKER", src: "/logo/docker.svg" },
    { name: "KUBERNETES", src: "/logo/kubernetes.svg" },
    { name: "TAILWIND CSS", src: "/logo/tailwind.svg" },
    { name: "GIT", src: "/logo/git.svg" },
    { name: "GITHUB", src: "/logo/github.svg" },
    { name: "NEXT JS", src: "/logo/nextjs.svg" },
    { name: "THREE JS", src: "/logo/threejs.svg" },
    { name: "FIREBASE", src: "/logo/firebase.svg" },
    { name: "FIGMA", src: "/logo/figma.svg" },
    { name: "TEDX", src: "/logo/tedx.svg" },
    { name: "ANIMATE", src: "/logo/animate.svg" },
    { name: "JAVA", src: "/logo/java.svg" },
    { name: "JEST", src: "/logo/jest.svg" },
    { name: "SALESFORCE", src: "/logo/salesforce.svg" },
];

const SLOT_COUNT = 8;

function shuffle(list) {
    return [...list].sort(() => Math.random() - 0.5);
}

export default function TechStack() {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(ALL_TECHS.slice(0, SLOT_COUNT));
    const [activeIndex, setActiveIndex] = useState(null);
    const [alertIndex, setAlertIndex] = useState(null);

    useEffect(() => {
        setMounted(true);
        setVisible(shuffle(ALL_TECHS).slice(0, SLOT_COUNT));

        const timers = [];

        const schedulePulse = () => {
            const delay = 1600 + Math.random() * 2800;

            const timer = window.setTimeout(() => {
                const index = Math.floor(Math.random() * SLOT_COUNT);
                const isAlert = Math.random() < 0.2;

                setActiveIndex(index);
                setAlertIndex(isAlert ? index : null);

                if (!isAlert) {
                    setVisible((prev) => {
                        const occupied = new Set(prev.map((t) => t.name));
                        const pool = ALL_TECHS.filter((t) => !occupied.has(t.name));
                        if (!pool.length) return prev;

                        const next = pool[Math.floor(Math.random() * pool.length)];
                        const copy = [...prev];
                        copy[index] = next;
                        return copy;
                    });
                }

                const clearTimer = window.setTimeout(() => {
                    setActiveIndex(null);
                    setAlertIndex(null);
                }, isAlert ? 520 : 340);

                timers.push(clearTimer);
                schedulePulse();
            }, delay);

            timers.push(timer);
        };

        schedulePulse();

        return () => timers.forEach(clearTimeout);
    }, []);

    if (!mounted) return null;

    return (
        <div className="p-10">
            <div className="mb-2 relative">
                <div className="border-t border-white/10" />
                <div className="absolute -top-3 left-0 w-full flex justify-between text-white font-mono text-sm sm:text-base">
                    <span> + </span> <span> + </span> <span> + </span> <span> + </span>
                </div>
            </div>

            <section className="relative w-full overflow-hidden px-6 py-4 text-white flex justify-center">

                <div className="relative mx-auto w-full max-w-8xl">
                    <div className="war-room relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-[#050914]/90 p-4 md:p-4 backdrop-blur-xl">

                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%)]" />
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(34,211,238,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.16)_1px,transparent_1px)] bg-size-[72px_72px]" />

                        <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            <div className="scan-sweep">
                                <div className="scan-halo" />
                                <div className="scan-core" />
                                <div className="scan-trail" />
                            </div>
                        </div>

                        <div className="relative z-10 mb-2 flex items-center justify-between gap-4 border-b border-white/8 pb-1.5">
                            <div>
                                <div className="mt-1 flex items-center gap-2.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.9)]" />
                                    <p className="text-[10px] uppercase tracking-[0.45em] text-white/40">
                                        Tech Stack
                                    </p>
                                    <span className="text-xs text-white/70">
                                        Sweep online · tracking modules
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-cyan-200/80 backdrop-blur-md">
                                <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.9)]" />
                                live scan
                            </div>
                        </div>

                        <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-8">
                            {visible.map((tech, i) => {
                                const isActive = activeIndex === i;
                                const isAlert = alertIndex === i;

                                return (
                                    <div
                                        key={`${tech.name}-${i}`}
                                        className={`min-h-28 min-w-27.5 rounded-xl border bg-white/4 p-3 transition-all duration-300 ${isActive ? isAlert ? "border-rose-400/30 shadow-[0_0_18px_rgba(244,63,94,0.18)]"
                                            : "border-cyan-300/35 shadow-[0_0_18px_rgba(34,211,238,0.18)]"
                                            : "border-white/10"
                                            }`}>
                                        <div className="flex h-full flex-col justify-between">

                                            <div className="flex justify-between">
                                                <span className="text-[9px] uppercase tracking-widest text-white/40">
                                                    {isActive ? (isAlert ? "alert" : "lock") : "idle"}
                                                </span>
                                                <div className={`h-2 w-2 rounded-full ${isActive ? isAlert
                                                    ? "bg-rose-400"
                                                    : "bg-cyan-300"
                                                    : "bg-white/20"
                                                    }`} />
                                            </div>

                                            <div className="flex flex-1 items-center justify-center">
                                                <img src={tech.src} alt={tech.name} className={`h-10 w-10 transition ${isActive ? "scale-110" : "opacity-80"}`} />
                                            </div>
                                            <div className="text-center text-sm text-white/80"> {tech.name} </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="relative z-10 mt-3 flex items-center justify-between border-t border-white/8 pt-2 text-[10px] uppercase tracking-[0.35em] text-white/35">
                            <span> Vector acquisition stable </span>
                            <span> scan matrix secured </span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}