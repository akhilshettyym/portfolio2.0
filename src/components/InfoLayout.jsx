"use client";

import React from "react";
import { motion } from "framer-motion";
import { useScrollParallax } from "@/hooks/useScrollParallax";

const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    viewport: { once: true, amount: 0.15 },
};

const InfoLayout = () => {

    const parallax = useScrollParallax(0.045);

    return (
        <section className="relative w-full overflow-hidden bg-white text-black -mt-20 md:-mt-25 z-20">

            <div className="relative z-10 px-8 md:px-16">
                <div className="grid grid-cols-1 mt-5 md:grid-cols-12 gap-y-14 md:gap-x-8 items-end">
                    <motion.div {...fadeUp} className="md:col-span-8">

                        <div className="overflow-hidden">
                            <h1 className="text-[clamp(4.5rem,9vw,7rem)] leading-[0.82] font-black tracking-[-0.09em] text-black will-change-transform" style={{ fontFeatureSettings: '"ss01" on, "ss02" on' }}> FULL STACK </h1>
                        </div>

                        <div className="overflow-hidden -mt-3">
                            <h1 className="text-[clamp(4.5rem,5vw,6rem)] leading-[0.82] font-black tracking-[-0.09em] text-black/90 will-change-transform" style={{ fontFeatureSettings: '"ss01" on, "ss02" on' }}> DEVELOPER </h1>
                        </div>
                    </motion.div>

                    <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }} className="md:col-span-4 flex flex-col items-start md:items-end justify-end text-left md:text-right pb-2">

                        <h2 className="text-[clamp(2.3rem,4vw,4rem)] leading-[0.9] font-black tracking-[-0.07em] text-black/95 will-change-transform">
                            / FROM <br /> MUMBAI, MH
                        </h2>

                        <p className="mt-6 max-w-70 text-[11px] uppercase tracking-[0.3em] leading-relaxed text-black/45">
                            The art of hacking social
                        </p>

                    </motion.div>
                </div>
            </div>

            <motion.div {...fadeUp} className="relative z-20 px-18 pt-10 pb-5">
                <div className="mx-auto max-w-8xl">

                    <div className="relative flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="uppercase text-[12px] tracking-[0.25em] text-black/50">
                                / Subject Profile
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-5 text-[10px] tracking-[0.38em] uppercase text-black/35 font-mono">
                            <span> 12.8761° N </span>
                            <span> 74.8316° E </span>
                        </div>

                        <div className="flex items-center gap-4 font-mono">
                            <span className="text-[10px] tracking-[0.32em] uppercase text-black/45">
                                @03-29
                            </span>

                            <div className="relative w-14 h-px overflow-hidden">
                                <div className="absolute inset-0 bg-black/8" />
                                <motion.div className="absolute top-0 h-px w-6 bg-black/40 blur-[0.5px]" animate={{ x: ["-120%", "250%"] }} transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }} />
                            </div>

                            <span className="text-[10px] tracking-[0.38em] uppercase text-black/70"> 2026 </span>
                        </div>
                    </div>

                    <div className="relative mt-5 h-px overflow-hidden">
                        <div className="absolute inset-0 bg-black/6" />
                    </div>
                </div>
            </motion.div>

            <div className="relative z-10 px-6 md:px-16">
                <div className="relative isolate pt-5">
                    <motion.div ref={parallax.ref} style={{ ...parallax.style, willChange: "transform" }} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true, amount: 0.15 }} className="mt-5 relative z-0 overflow-hidden rounded-4xl border border-black/10 bg-white/70 backdrop-blur-2xl grid  grid-cols-12 shadow-[0_10px_80px_rgba(120,160,255,0.12)]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,170,255,0.12),transparent_55%)] pointer-events-none" />

                        <div className="col-span-12 md:col-span-4 relative min-h-80 md:min-h-105 p-6 md:p-8 flex items-center justify-center">
                            <div className="relative w-full h-full max-w-65 max-h-85 rounded-3xl overflow-hidden">
                                <motion.img src="/Id3.png" alt="profile" initial={{ scale: 1.08 }} whileInView={{ scale: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true }} className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-8 p-8 md:p-12 flex flex-col justify-between">

                            <div className="space-y-5 text-[clamp(1rem,1.25vw,1.08rem)] leading-relaxed text-black/75">
                                <motion.p {...fadeUp}>
                                    Hi, I&apos;m Akhil — a Full-Stack Developer and UI/UX Designer
                                    passionate about building fast, scalable, and visually refined digital
                                    experiences. Over the past 3+ years, I&apos;ve worked with technologies
                                    like React, Next.js, Node.js, Three.js, and Firebase to create modern
                                    web applications focused on performance and seamless user experience.
                                </motion.p>

                                <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }}>
                                    I enjoy blending engineering with design to build products that feel
                                    both functional and immersive. From interactive interfaces to scalable
                                    backend systems, I&apos;m driven by clean architecture, creative
                                    development, and crafting digital experiences that leave a lasting
                                    impression.
                                </motion.p>
                            </div>

                            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.12 }} className="mt-14 border-t border-black/10 pt-6 space-y-4 text-[11px] uppercase tracking-[0.22em] text-black/50">
                                <div className="flex items-center justify-between gap-4 border-b border-black/5 pb-4">
                                    <span> 01. React • Next.js • Node.js • Three.js • Firebase </span>
                                    <span className="w-2 h-2 rounded-full bg-black/40 shrink-0" />
                                </div>

                                <div className="flex items-center justify-between gap-4 pb-1">
                                    <span> 02. UI/UX • Motion Design • Scalable Systems • Creative Development </span>
                                    <span className="w-2 h-2 rounded-full bg-black/40 shrink-0" />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

        </section>
    );
};

export default InfoLayout;