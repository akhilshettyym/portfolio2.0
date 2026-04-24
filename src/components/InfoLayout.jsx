"use client";

import React, { useEffect, useState } from "react";

const InfoLayout = () => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isResetting, setIsResetting] = useState(false);

    const words = [
        { text: "CORE JAVA" },
        { text: "DATA STRUCTURES" },
        { text: "MERN STACK" },
        { text: "VERSION CONTROL" },
        { text: "SALESFORCE" },
        { text: "API INTEGRATIONS" },
        { text: "FRAMEWORKS" },
        { text: "ARCHITECTURES" },
        { text: "DEPLOYMENT" },
    ];

    const loopedWords = [...words, ...words];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (currentIndex === words.length) {
            setTimeout(() => {
                setIsResetting(true);
                setCurrentIndex(0);
            }, 700);

            setTimeout(() => {
                setIsResetting(false);
            }, 750);
        }
    }, [currentIndex, words.length]);

    return (
        <section className="relative flex w-full flex-col sm:flex-row sm:pt-14 sm:pb-14">

            <div className="flex min-w-0 flex-1 flex-col md:flex-row">
                <div className="shrink-0 sm:w-56">
                    <div className="sm:sticky">
                        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-black/60">
                            <span className="text-black/40">0_</span> Intro
                        </h2>
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="max-w-5xl space-y-6 relative">
                        <div className="absolute -left-6 top-2 h-16 w-0.5 bg-black/10 hidden md:block" />

                        <p className="text-xl md:text-2xl leading-snug text-black font-medium tracking-tight">
                            Hi, I'm <span className="text-black"> AKHIL </span> — I design, build, and ship
                            modern web products, focusing on performance, clean architecture, and
                            experiences that feel fast, intuitive, and well-crafted.
                        </p>

                        <p className="text-lg md:text-xl leading-relaxed text-black/70 max-w-4xl">
                            Centered around performance, scalability, and robust architecture, my work
                            focuses on building real-world systems while advancing my expertise in system
                            design and delivering software that is both reliable and thoughtfully engineered.
                        </p>
                    </div>
                </div>
            </div>

            <div className="shrink-0 sm:w-60">
                <div className="pt-25 text-end sm:sticky">
                    <div className="mb-3 select-none font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-black/50"> 03 · 07 · 2002 </div>

                    <div className="relative h-8 overflow-hidden w-full mask-[linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
                        <div className={`flex flex-col will-change-transform ${isResetting ? "" : "transition-transform duration-700 ease-in-out"}`} style={{ transform: `translateY(-${currentIndex * 2}rem)` }}>
                            {loopedWords.map((word, index) => (
                                <div key={index} className="flex justify-end items-center h-8 w-full">
                                    <span className="text-md md:text-base font-bold tracking-[0.08em] text-black/70 whitespace-nowrap"> {word.text} </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full border-t border-black/10" />
        </section>
    );
};

export default InfoLayout;