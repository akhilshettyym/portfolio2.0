"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FADEUP } from "@/utils/basic-utils";
import { useScrollParallax } from "@/hooks/useScrollParallax";
import { PROFILE_METRICS, PROFILE_SIGNALS, PROFILE_STACK } from "@/data/profile";

const revealGroup = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.08,
        },
    },
};

const revealItem = {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
    },
};

const SubjectProfile = () => {
    const parallax = useScrollParallax(0.035);

    return (
        <section className="relative z-20 -mt-20 w-full overflow-hidden bg-white text-black md:-mt-25">
            <div className="relative z-10 px-8 md:px-16">
                <div className="mt-5 grid grid-cols-1 items-end gap-y-14 md:grid-cols-12 md:gap-x-8">
                    <motion.div {...FADEUP} className="md:col-span-8">
                        <div className="overflow-hidden">
                            <h1 className="text-[clamp(4.5rem,9vw,8rem)] font-black leading-[0.82] tracking-[-0.09em] text-black will-change-transform" style={{ fontFeatureSettings: '"ss01" on, "ss02" on' }}>
                                FULL STACK
                            </h1>
                        </div>

                        <div className="-mt-3 overflow-hidden">
                            <h1 className="text-[clamp(4.5rem,5vw,6rem)] font-black leading-[0.82] tracking-[-0.09em] text-black/90 will-change-transform" style={{ fontFeatureSettings: '"ss01" on, "ss02" on' }}>
                                DEVELOPER
                            </h1>
                        </div>
                    </motion.div>

                    <motion.div {...FADEUP} transition={{ ...FADEUP.transition, delay: 0.08 }} className="flex flex-col items-start justify-end pb-2 text-left md:col-span-4 md:items-end md:text-right">
                        <h2 className="text-[clamp(2.3rem,4vw,4rem)] font-black leading-[0.9] tracking-[-0.07em] text-black/95 will-change-transform">
                            / FROM <br /> MUMBAI, MH
                        </h2>

                        <p className="mt-6 max-w-70 text-[11px] uppercase leading-relaxed tracking-[0.3em] text-black/45">
                            The art of hacking social
                        </p>
                    </motion.div>
                </div>
            </div>

            <motion.div {...FADEUP} className="relative z-20 px-6 pt-10 pb-5 md:px-16">
                <div className="mx-auto max-w-8xl">
                    <div className="relative flex items-center justify-between gap-6">
                        <span className="text-[12px] uppercase tracking-[0.25em] text-black/50">
                            / Subject Profile
                        </span>

                        <div className="hidden items-center gap-5 font-mono text-[10px] uppercase tracking-[0.38em] text-black/35 md:flex">
                            <span>12.8761 N</span>
                            <span>74.8316 E</span>
                        </div>

                        <div className="flex items-center gap-4 font-mono">
                            <span className="text-[10px] uppercase tracking-[0.32em] text-black/45">
                                @03-29
                            </span>

                            <div className="relative h-px w-14 overflow-hidden">
                                <div className="absolute inset-0 bg-black/8" />
                                <motion.div className="absolute top-0 h-px w-6 bg-black/40 blur-[0.5px]" animate={{ x: ["-120%", "250%"] }} transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }} />
                            </div>

                            <span className="text-[10px] uppercase tracking-[0.38em] text-black/70">2026</span>
                        </div>
                    </div>

                    <div className="relative mt-5 h-px overflow-hidden">
                        <div className="absolute inset-0 bg-black/6" />
                    </div>
                </div>
            </motion.div>

            <div className="relative z-10 px-6 pb-16 md:px-16">
                <motion.div style={{ ...parallax.style, willChange: "transform" }} variants={revealGroup} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}
                    className="mx-auto grid max-w-8xl grid-cols-1 gap-8 border-y border-black/10 py-8 md:grid-cols-12 md:gap-10 md:py-12">
                    <motion.div variants={revealItem} className="md:col-span-5 lg:col-span-4">
                        <div className="relative overflow-hidden border border-black/10 bg-neutral-100">
                            <Image src="/my-image.png" alt="Akhil Shetty" width={1141} height={1379} unoptimized sizes="(min-width: 1024px) 28vw, (min-width: 768px) 40vw, 100vw" className="aspect-4/5 h-full w-full object-cover object-top grayscale" priority={false} />
                            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/20 to-transparent p-5 text-white">
                                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/55">Available for focused builds</p>
                                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em]">Systems, interfaces, motion</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="flex flex-col justify-between md:col-span-7 lg:col-span-8">
                        <motion.div variants={revealItem} className="max-w-5xl">
                            <p className="text-[clamp(1.75rem,3.6vw,4.4rem)] font-black uppercase leading-[0.95] text-black">
                                I turn product questions into fast interfaces, dependable services, and memorable motion.
                            </p>
                        </motion.div>

                        <motion.div variants={revealItem} className="mt-8 grid gap-5 text-sm leading-7 text-black/62 md:grid-cols-2">
                            <p>
                                I am Akhil Shetty, a full-stack developer who likes the point where engineering taste meets product clarity. I build with React, Next.js, Node.js, Three.js, Firebase, and the tooling needed to ship work that feels sharp without becoming fragile.
                            </p>
                            <p>
                                My best work starts with the reason a system exists, then moves into architecture, interaction, and performance. The goal is simple: make the experience feel effortless for the user and maintainable for the person who has to keep it alive.
                            </p>
                        </motion.div>

                        <motion.div variants={revealGroup} className="mt-10 grid gap-3 md:grid-cols-3">
                            {PROFILE_METRICS.map((metric) => (
                                <motion.div key={metric.label} variants={revealItem} className="border border-black/10 px-4 py-5">
                                    <p className="text-3xl font-black leading-none">{metric.value}</p>
                                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-black/45">{metric.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div variants={revealGroup} className="mt-8 divide-y divide-black/10 border-y border-black/10">
                            {PROFILE_SIGNALS.map((signal, index) => (
                                <motion.div key={signal.label} variants={revealItem} className="grid gap-3 py-5 md:grid-cols-[120px_1fr] md:gap-8">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/35">
                                        {String(index + 1).padStart(2, "0")} / {signal.label}
                                    </span>
                                    <p className="text-base font-semibold leading-7 text-black/78">{signal.value}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div variants={revealItem} className="mt-8 flex flex-wrap gap-2">
                            {PROFILE_STACK.map((item) => (
                                <span key={item} className="border border-black/10 bg-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-black/55">
                                    {item}
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SubjectProfile;
