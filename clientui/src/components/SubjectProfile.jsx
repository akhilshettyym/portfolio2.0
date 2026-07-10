"use client";

import Image from "next/image";
import { FADEUP } from "@/utils/basic-utils";
import { IoIdCardOutline } from "react-icons/io5";
import { useDeviceType } from "@/utils/useDeviceType";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const fadeInContainer = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            staggerChildren: 0.15,
        },
    },
};

const itemReveal = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
};

const ScrollMarquee = ({ texts = ["DEFAULT TEXT"], baseSpeed = 1, variant = "large", showIcon = false, className = "", direct = false }) => {

    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const containerRef = useRef(null);
    const { isTier2 } = usePerformanceTier();

    useEffect(() => {
        if (texts.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [texts]);

    const currentText = texts[currentTextIndex];

    const speed = Math.max(0.5, baseSpeed);
    const duration = 25 / speed;

    return (
        <div className={`w-full overflow-hidden whitespace-nowrap flex items-center select-none ${className}`}>

            {isTier2 ? (
                <h2 className={`font-black uppercase tracking-tight text-slate-900 bg-clip-text ${variant === "large" ? "text-[clamp(3.5rem,6vw,5.5rem)]" : "text-[clamp(1.1rem,4vw,1.4rem)]"}`}>
                    {currentText}
                </h2>
            ) : (
                <motion.div ref={containerRef}
                    className="flex items-center gap-10 will-change-transform"
                    animate={{ x: direct ? ["0%", "-50%"] : ["-50%", "0%"] }}
                    transition={{ duration: duration, ease: "linear", repeat: Infinity, repeatType: "loop" }}
                    style={{ transformOrigin: "left center" }}>

                    <MarqueeContent text={currentText} variant={variant} showIcon={showIcon} />
                    <MarqueeContent text={currentText} variant={variant} showIcon={showIcon} />
                </motion.div>
            )}

        </div>
    );
};

const MarqueeContent = ({ text, variant, showIcon }) => (
    <div className="flex items-center gap-10 shrink-0">
        <AnimatePresence mode="wait">
            <motion.h2 key={text} initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`font-black uppercase tracking-tight text-slate-900 bg-clip-text ${variant === "large" ? "text-[clamp(3.5rem,6vw,5.5rem)]" : "text-[clamp(1.1rem,4vw,1.4rem)]"}`}>
                {text}
            </motion.h2>
        </AnimatePresence>
        {showIcon && <IoIdCardOutline size={40} className="text-black/80" />}
    </div>
);

const SubjectProfile = () => {
    const [carouselIndex, setCarouselIndex] = useState(0);

    const { isMobile } = useDeviceType();

    const carouselData = [
        "I build fast, smooth websites where performance is baked in from the start — delivering excellent results.",
        "I write clean, well-structured, and maintainable code focused on clarity, scalability, and long-term reliability.",
        "I design intuitive, consistent, and responsive interfaces that feel natural across all devices and screen sizes.",
        "Strong technical SEO, accessibility, and modern best practices are built in from day one — not added later.",
        "From concept to launch, I ensure clear communication, thoughtful planning, and reliable, rigorously tested delivery.",
    ];

    const welcomeTexts = [
        "HELLO, GLAD YOU'RE HERE.",
        "WELCOME TO MY CREATIVE SPACE.",
        "LET'S CREATE SOMETHING REMARKABLE.",
        "CRAFTING DIGITAL EXPERIENCES FOR YOU.",
        "READY TO BRING IDEAS TO LIFE?",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCarouselIndex((prev) => (prev + 1) % carouselData.length);
        }, 4500);
        return () => clearInterval(interval);
    }, [carouselData.length]);

    return (
        <section id="about" className="relative w-full min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white py-12 px-4 md:px-12 overflow-hidden">
            <div className="relative z-10">
                <div className="grid grid-cols-1 items-end gap-y-14 md:grid-cols-12 md:gap-x-8">
                    <motion.div {...FADEUP} className="md:col-span-8">
                        <div className="overflow-hidden">
                            <h1 className="text-[clamp(3.4em,8vw,4.5rem)] md:text-[clamp(4.5rem,9vw,6rem)] font-black leading-[0.82] tracking-tighter md:tracking-[-0.09em] text-black will-change-transform" style={{ fontFeatureSettings: '"ss01" on, "ss02" on' }}>
                                FULL STACK
                            </h1>
                        </div>

                        <div className="-mt-3 overflow-hidden">
                            <h1 className="text-[clamp(3rem,5vw,3rem)] font-black leading-[0.82] tracking-[-0.12em] text-black/90 will-change-transform" style={{ fontFeatureSettings: '"ss01" on, "ss02" on' }}>
                                DEVELOPER
                            </h1>
                        </div>
                    </motion.div>

                    <motion.div {...FADEUP} transition={{ ...FADEUP.transition, delay: 0.08 }} className="flex flex-col items-start justify-end pb-2 text-left md:col-span-4 md:items-end md:text-right">
                        <h2 className="text-[clamp(2.3rem,4vw,4rem)] font-black leading-[0.9] tracking-[-0.08em] text-black/95 will-change-transform">
                            / FROM <br /> MUMBAI, MH
                        </h2>

                        <p className="mt-2 max-w-70 text-[11px] uppercase leading-relaxed tracking-normal text-black/45">
                            The art of hacking social
                        </p>
                    </motion.div>
                </div>
            </div>

            <motion.div {...FADEUP} className="relative z-20 pt-3 pb-3">
                <div className="mx-auto max-w-8xl">
                    <div className="relative flex items-center justify-between gap-6">
                        <span className="text-[12px] uppercase tracking-normal text-black/50">
                            / Subject Profile
                        </span>

                        <div className="hidden items-center gap-5 font-mono text-[10px] uppercase tracking-normal text-black/35 md:flex">
                            <span>12.8761 N</span>
                            <span>74.8316 E</span>
                        </div>

                        <div className="flex items-center gap-4 font-mono">
                            <span className="text-[10px] uppercase tracking-normal text-black/45">
                                @03-29
                            </span>

                            <div className="relative h-px w-14 overflow-hidden">
                                <div className="absolute inset-0 bg-black/8" />
                                <motion.div className="absolute top-0 h-px w-6 bg-black/40 blur-[0.5px]"
                                    animate={{ x: ["-120%", "250%"] }}
                                    transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }} />
                            </div>

                            <span className="text-[10px] uppercase tracking-normal text-black/70">
                                2026
                            </span>
                        </div>
                    </div>

                    <div className="relative mt-5 h-px overflow-hidden">
                        <div className="absolute inset-0 bg-black/6" />
                    </div>
                </div>
            </motion.div>

            <div className="absolute inset-0 z-0 opacity-15 pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

            <motion.div variants={fadeInContainer}
                initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="max-w-360 mx-auto relative z-10 flex flex-col gap-10">

                <div className="w-full flex flex-col lg:flex-row gap-8">
                    <motion.div variants={itemReveal} className="flex-1 border border-slate-200/80 bg-white p-6 flex flex-col justify-center overflow-hidden relative shadow-sm rounded-2xl group">

                        <ScrollMarquee texts={["ABOUT ME"]} baseSpeed={1.5} variant="large" showIcon={true} direct={true} className="border-b border-slate-200/80" />
                        <ScrollMarquee texts={welcomeTexts} baseSpeed={1.2} variant="small" className="mt-2" />

                        <div className="mt-4">
                            <p className="text-slate-600 text-lg leading-relaxed font-light text-justify">
                                I am a multidisciplinary creator{" "}
                                <span className="text-slate-900 font-semibold underline decoration-slate-300 decoration-2 underline-offset-4">
                                    engineering high-impact digital experiences
                                </span>{" "}
                                at the intersection of robust code and beautiful design. My
                                methodology is inherently systematic, architectural, and
                                scalable.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemReveal} className="flex-1 border border-slate-200/80 bg-white p-6 flex flex-col justify-between shadow-sm rounded-2xl">
                        <div className="relative w-full h-48 md:h-40 mb-6 border border-slate-100 bg-slate-950 overflow-hidden rounded-2xl group shadow-inner">
                            {/* <Image src="/akhil.svg" alt="System visualization workflow" fill unoptimized className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out mix-blend-luminosity group-hover:mix-blend-normal"
                            /> */}
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2 py-1 text-[10px] font-mono text-slate-300 tracking-wider rounded border border-white/10 uppercase">
                                live_node_status // active
                            </div>
                        </div>

                        <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light text-justify">
                            Every project I build intentionally bridges{" "}
                            <span className="text-slate-900 font-medium">
                                user psychology with comprehensive engineering strategy
                            </span>
                            . I build web ecosystems that are visually striking and
                            structurally bulletproof. By leveraging contemporary headless
                            stacks, tailored APIs, and purposeful interactions, I unlock
                            flawless deployment performance.
                        </p>
                    </motion.div>
                </div>

                <motion.div variants={itemReveal} className="w-full border border-slate-900 bg-white p-8 md:p-12 relative shadow-xl rounded-xl">
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-slate-900 -translate-x-3 translate-y-3" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-slate-900 translate-x-3 -translate-y-3" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                        <div className="lg:col-span-8 flex flex-col justify-between gap-10">
                            <div>
                                <h3 className="text-xl font-light leading-relaxed text-slate-800 tracking-tight text-justify">
                                    I craft technical design solutions that help forward-thinking
                                    brands truly differentiate. With over{" "}
                                    <span className="text-slate-950 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                                        3-4 years of tech experience
                                    </span>
                                    , I specialize in designing beautiful software interfaces and
                                    transforming them into high-performing reality—spanning
                                    frontend architectures, comprehensive backend infrastructures,
                                    headless CMS ecosystems, automated CI/CD automation pipelines,
                                    and specialized Salesforce CRM logic integrations.
                                </h3>
                            </div>

                            <div className="min-h-30 border-l-4 border-slate-900 pl-6 relative flex flex-col justify-center bg-slate-50/80 py-2 pr-4 shadow-sm">
                                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    Operational Workflow Ethos
                                </div>
                                <div className="relative min-h-18 w-full flex items-center">
                                    <AnimatePresence mode="popLayout">
                                        <motion.div key={carouselIndex}
                                            initial={{ y: 25, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -25, opacity: 0 }}
                                            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                            className="absolute w-full">

                                            <p className="text-sm md:text-base font-medium text-slate-700 leading-normal">
                                                <span className="text-black/60 font-bold mr-1.5">
                                                    &gt;
                                                </span>
                                                {carouselData[carouselIndex % carouselData.length]}
                                            </p>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
                                <motion.div whileHover={{ y: -4, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.08)" }} className="border border-slate-200 bg-slate-50/40 p-6 flex flex-col justify-between transition-all duration-300 rounded-xl group hover:border-slate-400">
                                    <p className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors text-justify">
                                        I design spaces with structural intention, merging the
                                        precise creative layouts of{" "}
                                        <span className="text-slate-950 font-semibold">Figma</span>,
                                        code flexibility of modern frameworks, and advanced scroll
                                        magic driven by{" "}
                                        <span className="text-slate-950 font-semibold">
                                            GSAP / Framer Motion
                                        </span>
                                        . These are strategic tools configured to capture complete
                                        market attention.
                                    </p>
                                </motion.div>

                                <motion.div whileHover={{ y: -4, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.08)" }}
                                    className="border  border-slate-200 bg-slate-50/40 p-6 flex flex-col justify-between transition-all duration-300 rounded-xl group hover:border-slate-400" >
                                    <p className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors text-justify">
                                        Available for select freelance contracts, engineering
                                        high-tier enterprise modules, standalone applications, and
                                        automated deployments. I maximize client trust through
                                        direct accountability, transparency, and scalable
                                        architecture buildouts.
                                    </p>
                                </motion.div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 relative h-full min-h-100 border border-slate-200 p-2 group bg-slate-50 shadow-inner">
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-slate-900 rounded-tl -translate-x-0.5 -translate-y-0.5" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-900 rounded-br translate-x-0.5 translate-y-0.5" />

                            <div className="relative w-full h-100 bg-slate-200 overflow-hidden rounded-lg">
                                {/* <Image src="/akhil.svg" alt="Professional Profile Visual Representation" fill unoptimized priority className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700 ease-out" /> */}
                            </div>

                            <div className={`absolute bottom-4 left-4 bg-slate-900/90 text-white backdrop-blur-md border border-slate-700/50 p-3 shadow-xl font-mono select-none rounded-lg ${isMobile ? "w-60" : "w-70"}`}>
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <p className="text-[10px] text-slate-200 font-bold tracking-wider">
                                            CORE_SYS // ENGR.AV2
                                        </p>
                                    </div>
                                </div>
                                <p className="text-[9px] text-slate-400 tracking-wide">
                                    LATENCY: OPTIMAL // LOC: GLOBAL
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default SubjectProfile;