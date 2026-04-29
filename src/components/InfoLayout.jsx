"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlobePanel } from "./GlobePanel";
import Hero from "./Hero";
import Clouds from "./Clouds";
import { useScrollParallax } from "@/hooks/useScrollParallax";

const InfoLayout = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isResetting, setIsResetting] = useState(false);

    const parallax = useScrollParallax(0.3);

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
        <>
            {/* PARALLAX INTRO SECTION */}
            <motion.section 
              ref={parallax.ref} 
              className="parallax-container relative w-full py-20 md:py-32 flex items-center justify-center min-h-screen overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
            >
                <motion.div 
                  style={parallax.style}
                  className="parallax-element w-full max-w-6xl px-6 md:px-12"
                >
                    <div className="space-y-8 text-center">
                        <motion.h1 
                          className="text-5xl md:text-7xl font-bold text-black leading-tight"
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          viewport={{ once: false, amount: 0.5 }}
                        >
                            Hello, I&apos;m Akhil Shetty
                        </motion.h1>
                        <motion.p 
                          className="text-xl md:text-2xl text-black/70 max-w-3xl mx-auto leading-relaxed"
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          viewport={{ once: false, amount: 0.5 }}
                        >
                            I design and build web products with a focus on performance and precision.
                        </motion.p>
                        <motion.p 
                          className="text-lg md:text-xl text-black/60 max-w-2xl mx-auto"
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          viewport={{ once: false, amount: 0.5 }}
                        >
                            Focused on scalability, system design, and clean architecture. I build reliable, production-ready software with an emphasis on execution quality.
                        </motion.p>
                    </div>
                </motion.div>
            </motion.section>

            {/* 00_INTRO */}
            {/* <section className="relative flex w-full flex-col sm:flex-row sm:pt-10 sm:pb-10">
                <div className="flex min-w-0 flex-1 flex-col md:flex-row">
                    <div className="shrink-0 sm:w-56">
                        <div className="sm:sticky">
                            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-black/60">
                                <span className="text-black/40">00_</span> Intro
                            </h2>
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="text-align: center max-w-5xl space-y-6 relative">
                            <div className="absolute -left-6 top-2 h-16 w-0.5 bg-black/10 hidden md:block" />

                            <p className="text-xl leading-snug text-black font-medium tracking-tight">
                                Hi, I'm
                            </p>

                            <p className="text-xl leading-snug text-black font-medium tracking-tight">
                                — I design and build web products with a focus on performance and precision.
                            </p>

                            <p className="text-xl leading-relaxed text-black/70 max-w-4xl">
                                Focused on performance, scalability, and system design, I build reliable, production-ready
                                software with a strong emphasis on clean architecture and execution quality.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="shrink-0 sm:w-60">
                    <div className="sm:sticky flex flex-col items-end">
                        <div className="group relative w-40 sm:w-48 aspect-[3/4] overflow-hidden rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                            <div className="absolute -inset-4 rounded-[2rem] bg-black/10 blur-2xl opacity-40 transition duration-700 group-hover:opacity-70" />

                            <img
                                src="/profile.png"
                                alt="Akhil Shetty"
                                className="relative z-10 h-full w-full object-cover grayscale contrast-110 brightness-90 saturate-0 transition duration-700 group-hover:scale-[1.06] group-hover:brightness-100"
                            />

                            <div className="absolute inset-0 z-20 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.16),transparent_30%,transparent_70%,rgba(0,0,0,0.18))] pointer-events-none" />
                            <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%)] pointer-events-none" />

                            <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
                                <div className="absolute left-0 top-[-30%] h-[140%] w-full bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.22),transparent)] rotate-12 opacity-0 transition duration-700 group-hover:opacity-100 group-hover:translate-y-[18%]" />
                            </div>

                            <div className="absolute inset-0 z-30 border border-black/15 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] pointer-events-none" />

                            <div className="absolute bottom-0 left-0 z-30 h-10 w-10 border-l border-b border-black/20 pointer-events-none" style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }} />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full border-t border-black/10" />
            </section> */}

            {/* 01_ABOUT */}
            {/* <section className="relative flex w-full flex-col sm:flex-row sm:pt-10 sm:pb-10">
                <div className="flex min-w-0 flex-1 flex-col md:flex-row">
                    <div className="shrink-0 sm:w-56">
                        <div className="sm:sticky">
                            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-black/60">
                                <span className="text-black/40">01_</span> about
                            </h2>
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="text-align: center  max-w-5xl space-y-6 relative">
                            <div className="absolute -left-6 top-2 h-16 w-0.5 bg-black/10 hidden md:block" />
                            <p className="text-xl leading-relaxed text-black/70 max-w-4xl">
                                Based in India, I spend most of my time building in quiet, minimal environments where focus feels natural and ideas can develop without distraction.
                            </p>

                            <p className="text-xl leading-relaxed text-black/70 max-w-4xl">
                                Outside of work, I stay close to hands-on disciplines like clay modelling and painting, along with sport. Table tennis, cricket, and karate keep me active and reinforce a sense of structure that carries into how I build.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="shrink-0 sm:w-60">
                    <div className="sm:sticky flex justify-end">
                        <div className="opacity-100">
                            <GlobePanel />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full border-t border-black/10" />
            </section> */}

            {/* 02_SERVICES */}
            {/* <section className="relative flex w-full flex-col sm:flex-row sm:pt-10 sm:pb-10">
                <div className="flex min-w-0 flex-1 flex-col md:flex-row">
                    <div className="shrink-0 sm:w-56">
                        <div className="sm:sticky">
                            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-black/60">
                                <span className="text-black/40">02_</span> services
                            </h2>
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="rc space-y-10 text-align: center  max-w-4xl relative">
                            <div className="absolute -left-6 top-2 h-16 w-0.5 bg-black/10 hidden md:block" />
                            <p className="text-xl leading-relaxed text-black/80">
                                I specialize in building Fullstack websites using Next.js and leveraging Sanity for custom content management solutions (CMS), with an emphasis on design accuracy and an accessibility-first approach.
                            </p>

                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 text-sm md:text-base text-black/70">
                                <li className="border-t border-black/10 pt-3 transition-colors hover:text-black">
                                    Fixed-fee project structure
                                </li>
                                <li className="border-t border-black/10 pt-3 transition-colors hover:text-black">
                                    4-8 week delivery cycles
                                </li>
                                <li className="border-t border-black/10 pt-3 transition-colors hover:text-black">
                                    Design-to-development alignment
                                </li>
                                <li className="border-t border-black/10 pt-3 transition-colors hover:text-black">
                                    Scalable system architecture
                                </li>
                                <li className="border-t border-black/10 pt-3 transition-colors hover:text-black">
                                    Scalable system architecture
                                </li>
                                <li className="border-t border-black/10 pt-3 transition-colors hover:text-black">
                                    Scalable system architecture
                                </li>
                            </ul>


                            <div className="my-2 border-l-[3px] border-black/20 bg-black/10 px-5 py-4 text-xs md:text-sm text-black/65 overflow-hidden">
                                <p className="leading-relaxed">
                                    <span className="text-black/80 font-medium">Note:</span>{" "}
                                    Fixed-fee engagements typically range between{" "}
                                    <span className="text-black/90 font-semibold">₹1.5L - ₹3L</span>{" "}
                                    (≈ <span className="text-black/90 font-semibold">$5,000 - $10,000</span>),
                                    depending on scope and design depth.
                                </p>

                                <p className="mt-1 leading-relaxed">
                                    Delivery timelines are usually{" "}
                                    <span className="text-black/90 font-semibold">4-8 weeks</span>{" "}
                                    post design hand-off, focused on clarity, performance, and maintainability.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shrink-0 sm:w-60">
                    <div className="pt-25 text-end sm:sticky">
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full border-t border-black/10" />
            </section> */}
        </>
    );
};

export default InfoLayout;