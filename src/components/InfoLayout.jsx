"use client";

import React from "react";
import { motion } from "framer-motion";
import { useScrollParallax } from "@/hooks/useScrollParallax";

const SplitText = ({ text }) => {
    return (
        <p className="flex flex-wrap gap-x-2 leading-relaxed">
            {text.split(" ").map((word, i) => (
                <span
                    key={i}
                    className="text-black/40 hover:text-black transition-colors duration-300"
                >
                    {word}
                </span>
            ))}
        </p>
    );
};

const InfoLayout = () => {
    const parallax = useScrollParallax(0.25);

    return (
        <section className="w-full min-h-screen bg-white text-black overflow-hidden">

            <div className="h-[30vh] grid grid-cols-2 px-8 md:px-16 items-center">

                <div>
                    <h1 className="text-[clamp(2.8rem,6vw,6rem)] leading-[0.9] font-semibold tracking-[-0.05em]">
                        FULL STACK <br />
                        DEVELOPER
                    </h1>
                    <p className="text-sm mt-2 uppercase tracking-[0.2em] text-black/60">
                        @dev · building scalable systems
                    </p>
                </div>

                <div className="text-right">
                    <h1 className="text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] font-semibold tracking-[-0.05em]">
                        / FROM <br /> MUMBAI, MH
                    </h1>
                    <p className="text-sm mt-2 uppercase tracking-[0.2em] text-black/60">
                        @23 years
                    </p>
                </div>
            </div>

            <div
                ref={parallax.ref}
                style={parallax.style}
                className="w-full"
            >

                <div className="relative w-full py-6">
                    <svg viewBox="0 0 1000 60" className="w-full h-10">
                        <path
                            d="M0 30 Q500 50 1000 30"
                            stroke="black"
                            strokeOpacity="0.2"
                            fill="transparent"
                        />
                    </svg>

                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-6 bg-black/20" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-6 bg-black/20" />
                </div>

                <div className="flex justify-between items-center px-8 md:px-16 text-[11px] uppercase tracking-[0.25em] text-black/50 pb-6">
                    <span>(about me)</span>
                    <span>(19.0760° N, 72.8777° E)</span>
                    <span>@03-29</span>
                </div>

                <div className="px-6 md:px-16 pb-16">
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        className="w-full rounded-2xl border border-black/10 overflow-hidden grid grid-cols-12 bg-[#fafafa]"
                    >

                        <div className="col-span-12 md:col-span-4 h-65 md:h-auto relative">
                            <img
                                src="/your-image.jpg"
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="col-span-12 md:col-span-8 p-6 md:p-10 flex flex-col justify-between">

                            <div className="space-y-6">
                                <SplitText text="I design and build high performance web products with a strong focus on scalability precision and system architecture." />
                                <SplitText text="My work blends engineering and design to create interfaces that are not only functional but also intentional and refined." />
                            </div>

                            <div className="mt-8 flex justify-between text-[11px] uppercase tracking-[0.25em] text-black/40">
                                <span>01. Engineering</span>
                                <span>02. Systems</span>
                                <span>03. UI/UX</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export default InfoLayout;