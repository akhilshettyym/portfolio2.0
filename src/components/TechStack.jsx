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
        <div className="bg-white">

            <section className="relative w-full overflow-hidden px-6 py-4 text-black flex justify-center">
                <div className="relative mx-auto w-full max-w-8xl">
                    <div className="relative overflow-hidden border border-black/20 bg-white p-2">

                        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,0,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.2)_1px,transparent_1px)] bg-size-[72px_72px]" />

                        <div className="pointer-events-none absolute inset-0 overflow-hidden z-50">
                            <div className="scan-line" />
                        </div>

                        <div className="relative z-10 mb-2 flex items-center justify-between gap-4 border-b border-black/10 pb-1.5">
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                    <p className="text-[10px] uppercase tracking-[0.45em] text-black/50">
                                        Tech Stack SKILLS
                                    </p>
                                    <span className="text-xs text-black/60">
                                        Sweep online · tracking modules
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 border border-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-black/70">
                                <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
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
                                        className={`min-h-28 min-w-27.5 rounded-xl border bg-white p-3 transition-all duration-300 ${isActive ? isAlert
                                            ? "border-black shadow-[0_0_12px_rgba(244,63,94,0.25)]"
                                            : "border-black shadow-[0_0_12px_rgba(0,0,0,0.25)]"
                                            : "border-black/20"}`}>
                                        <div className="flex h-full flex-col justify-between">

                                            <div className="flex justify-between">
                                                <span className="text-[9px] uppercase tracking-widest text-black/40">
                                                    {isActive ? (isAlert ? "alert" : "lock") : "idle"}
                                                </span>

                                                <div
                                                    className={`h-2 w-2 rounded-full ${isActive ? isAlert
                                                        ? "bg-rose-500"
                                                        : "bg-emerald-500"
                                                        : "bg-black/20"
                                                        }`} />
                                            </div>

                                            <div className="flex flex-1 items-center justify-center">
                                                <img src={tech.src} alt={tech.name} className={`h-10 w-10 transition ${isActive ? "scale-110" : "opacity-70"
                                                    }`} />
                                            </div>

                                            <div className="text-center text-sm text-black/80"> {tech.name} </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="relative z-10 mt-3 flex items-center justify-between border-t border-black/10 pt-2 text-[10px] uppercase tracking-[0.35em] text-black/40">
                            <span> Vector acquisition stable </span>
                            <span> scan matrix secured </span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}