"use client";

import React from "react";
import { motion } from "framer-motion";
import { useScrollParallax } from "@/hooks/useScrollParallax";

const SplitText = ({ text }) => {
    return (
        <p className="flex flex-wrap gap-x-2 gap-y-3 leading-relaxed">
            {text.split(" ").map((word, i) => (
                <span key={i} className="text-black/45 hover:text-black transition-all duration-500">
                    {word}
                </span>
            ))}
        </p>
    );
};

const fadeUp = {
    initial: {
        opacity: 0,
        y: 40,
    },
    whileInView: {
        opacity: 1,
        y: 0,
    },
    transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
    },
    viewport: {
        once: true,
        amount: 0.15,
    },
};

const InfoLayout = () => {

    const parallax = useScrollParallax(0.045);

    return (
        <section className="relative w-full overflow-hidden bg-white text-black">

            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-white" />
                <div className="absolute top-0 left-0 w-full h-[65vh] bg-linear-to-b from-[#dbeafe] via-[#eef5ff] to-white " />
                <div className=" absolute top-[-10%] eft-1/2 -translate-x-1/2 w-250 h-150 rounded-full bg-blue-200/35 blur-[140px]" />
                <div className="absolute top-20 left-[8%] w-60 h-60 rounded-full bg-white/80 blur-[100px]" />
                <div className="absolute top-32 right-[10%] w-[320px] h-80 rounded-full bg-white/70 blur-[120px] " />
                <div className="absolute top-[28%] left-[38%] w-55 h-55 rounded-full bg-white/60 blur-[90px] " />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(255,255,255,0.82)_100%)] " />
            </div>

            <div className="relative z-10 px-8 md:px-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

                    <motion.div {...fadeUp}>
                        <h1 className="text-[clamp(3rem,7vw,7rem)] leading-[0.86] font-semibold tracking-[-0.07em]">
                            FULL STACK
                            <br />
                            DEVELOPER
                        </h1>

                        <p className="mt-6 text-[10px] uppercase tracking-[0.32em] text-black/50">
                            Engineering systems with precision
                        </p>
                    </motion.div>

                    <motion.div {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: 0.08 }} className="text-left md:text-right">

                        <h1 className="text-[clamp(2.5rem,5vw,5.5rem)] leading-[0.9] font-semibold tracking-[-0.06em] ">
                            / FROM
                            <br />
                            MUMBAI, MH
                        </h1>

                        <p className="mt-6 text-[10px] uppercase tracking-[0.32em] text-black/50 ">
                            Building scalable digital experiences
                        </p>
                    </motion.div>

                </div>
            </div>

            <motion.div {...fadeUp} className="relative z-20 px-8 md:px-16 pt-20 pb-14">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.28em] text-black/45 mb-6">
                    <span> (about me) </span>

                    <span className="hidden md:block">
                        (19.0760° N, 72.8777° E)
                    </span>

                    <span> @03-29 </span>
                </div>

                <div className="relative w-full h-px bg-black/10 overflow-hidden">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-px bg-black/25" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-px bg-black/25" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-px bg-blue-300/70 blur-sm " />
                </div>
            </motion.div>

            <div className="relative z-10 px-6 md:px-16 pb-28 ">

                <div className="relative isolate pt-10">

                    <motion.div ref={parallax.ref}
                        style={{ ...parallax.style, willChange: "transform" }}
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true, amount: 0.15 }}
                        className="relative z-0 overflow-hidden rounded-4xl border border-black/10 bg-white/70 backdrop-blur-2xl grid grid-cols-12 shadow-[0_10px_80px_rgba(120,160,255,0.12)]">

                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,170,255,0.12),transparent_55%)] pointer-events-none" />

                        <div className="col-span-12 md:col-span-4 relative min-h-105 overflow-hidden">
                            <motion.img src="/profile.png" alt="profile" initial={{ scale: 1.08 }} whileInView={{ scale: 1 }}
                                transition={{
                                    duration: 1.4,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                viewport={{ once: true }}
                                className="absolute inset-0 w-full h-full object-cover" />

                            <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
                        </div>


                        <div className="col-span-12 md:col-span-8 p-8 md:p-12 flex flex-col justify-between">
                            <motion.div {...fadeUp} className=" space-y-8 text-[clamp(1rem,1.3vw,1.15rem)]">
                                <SplitText text="I design and build high performance web products with a strong focus on scalability precision and system architecture." />

                                <SplitText text="My work blends engineering and design to create interfaces that are not only functional but also intentional and refined." />
                            </motion.div>

                            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mt-14 flex flex-wrap gap-6 md:gap-0 justify-between text-[10px] uppercase tracking-[0.25em] text-black/40">
                                <span>01. Engineering</span>
                                <span>02. Systems</span>
                                <span>03. UI / UX</span>
                            </motion.div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default InfoLayout;