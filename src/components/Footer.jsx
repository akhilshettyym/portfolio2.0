"use client";

import Link from "next/link";
import Image from "next/image";
import { SOCIALS } from "@/utils/basic-utils";
import CustomButton from "./basic/CustomButton";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { FaRegCopyright } from "react-icons/fa6";
import { useRouter } from "next/navigation";

function splitLetters(text) {
    return Array.from(text);
}

function AnimatedWord({ text, className = "", delay = 0 }) {
    const chars = useMemo(() => splitLetters(text), [text]);

    return (
        <span className={className} aria-label={text}>
            {chars.map((char, index) => (
                <motion.span key={`${char}-${index}`} initial={{ opacity: 0, y: 24, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: delay + index * 0.015 }} className="inline-block" style={{ whiteSpace: char === " " ? "pre" : "normal" }}>
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
}

function MarqueeLine({ text }) {
    return (
        <div className="relative overflow-hidden py-2">
            <motion.div className="flex w-max items-center gap-6 whitespace-nowrap" animate={{ x: [0, -2400] }} transition={{ duration: 46, ease: "linear", repeat: Infinity }}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-6">
                        <span className="text-[5rem] font-bold tracking-[-0.08em] text-black/90"> {text} </span>
                        <span className="h-3 w-3 rounded-full bg-black/90 sm:h-4 sm:w-4" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

function MarqueeLine2({ text }) {
    return (
        <div className="relative overflow-hidden py-2">
            <motion.div className="flex w-max items-center gap-6 whitespace-nowrap" animate={{ x: [-2400, 0] }} transition={{ duration: 46, ease: "linear", repeat: Infinity }}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-6">
                        <span className="text-[2rem] font-bold tracking-normal text-black/90"> {text} </span>
                        <span className="h-3 w-3 rounded-full bg-black/90" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

const Footer = () => {
    const router = useRouter();
    const sectionRef = useRef(null);
    const [shouldSnap, setShouldSnap] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const sectionPadding = useSpring(
        useTransform(
            scrollYProgress,
            [0, 0.28, 0.42, 0.56, 1],
            [50, 50, 30, 0, 0]
        ),
        { stiffness: 72, damping: 20, mass: 0.9 }
    );

    const revealLift = useSpring(
        useTransform(scrollYProgress, [0, 0.28, 0.55, 1], [16, 10, 0, 0]),
        { stiffness: 80, damping: 22, mass: 0.8 }
    );

    const shellShadow = useTransform(
        scrollYProgress,
        [0, 0.16, 0.42, 1],
        [
            "0 10px 32px rgba(0,0,0,0.08)",
            "0 18px 48px rgba(0,0,0,0.12)",
            "0 28px 70px rgba(0,0,0,0.16)",
            "0 36px 90px rgba(0,0,0,0.20)",
        ]
    );

    const curtainOpacity = useTransform(
        scrollYProgress,
        [0, 0.12, 0.3, 0.56, 1],
        [1, 0.96, 0.84, 0.42, 0]
    );

    const gridOpacity = useTransform(
        scrollYProgress,
        [0, 0.18, 0.5, 1],
        [0.18, 0.14, 0.08, 0]
    );

    const glowOpacity = useTransform(
        scrollYProgress,
        [0, 0.12, 0.34, 0.7, 1],
        [0.32, 0.22, 0.12, 0.04, 0]
    );

    useEffect(() => {
        if (prefersReducedMotion) return;

        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const ratio = entry.intersectionRatio;
                setShouldSnap(ratio > 0.38);
            },
            { threshold: 0.4 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [prefersReducedMotion]);

    const animatedCard = prefersReducedMotion ? {}
        : {
            initial: { opacity: 0, y: 24, filter: "blur(10px)" },
            whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
            viewport: { once: true, amount: 0.25 },
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        };

    const handleNavigation = () => {
        console.log("navigate to start page");
    };


    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleHitMeUp = () => {
        router.push("/start");

        window.scrollTo({
            top: 0, left: 0, behavior: "smooth",
        });
    };

    const topOverlayOpacity = useTransform(
        scrollYProgress,
        [0, 0.2, 0.5, 1],
        [0.7, 0.5, 0.2, 0]
    );

    const topBorderOpacity = useTransform(
        scrollYProgress,
        [0, 0.18, 0.45, 1],
        [0.85, 0.5, 0.18, 0]
    );

    return (
        <motion.section ref={sectionRef}
            style={prefersReducedMotion ? undefined : { padding: sectionPadding }} className="relative w-full bg-white text-black p-12.5">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div style={{ opacity: glowOpacity }} className="absolute left-1/2 top-10 h-128 w-lg -translate-x-1/2 rounded-full bg-white blur-3xl sm:h-184 sm:w-184" />
                <motion.div style={{ opacity: gridOpacity }} className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[64px_64px]" />
                <motion.div style={{ opacity: curtainOpacity }} className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_52%)]" />
            </div>

            <motion.div style={prefersReducedMotion ? undefined : { y: revealLift, boxShadow: shellShadow }} className="relative mx-auto min-h-svh w-full overflow-hidden rounded-none bg-white">
                <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_20%,transparent_45%)]"
                    style={{ opacity: topOverlayOpacity }} />

                <motion.div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-black/10"
                    style={{ opacity: topBorderOpacity }} />

                <div className="relative z-40">
                    <div className="mx-auto flex w-full max-w-[1600px] flex-col justify-between px-4 py-5">
                        <div className="mb-5 flex h-[55vh] w-full flex-col gap-4 md:flex-row">
                            <div className="w-full text-white md:w-[60%]">
                                <div className="flex h-full w-full flex-col gap-4">
                                    <div className="flex flex-1 items-center justify-center p-4 text-indigo-900">
                                        <div className="overflow-hidden">
                                            <MarqueeLine text="A DESIGNER & DEVELOPER. CREATIVELY DRIVEN." />
                                            <MarqueeLine2 text="A DESIGNER & DEVELOPER. CREATIVELY DRIVEN." />
                                        </div>
                                    </div>

                                    <div className="relative flex-1 overflow-hidden rounded-xl bg-gray-200 p-6 text-black">
                                        <div className="flex h-full w-full flex-col gap-4">
                                            <div className="flex-1 rounded-lg">
                                                <div className="flex flex-row gap-4 h-full w-full">
                                                    <div className="flex-1 bg-gray-300 rounded-md p-4">
                                                        This section is built to feel alive
                                                    </div>

                                                    <div className="flex-1 bg-gray-200 rounded-md p-4">
                                                        {/* <div className="absolute top-4 right-5 z-10 bg-gray-200">
                                                            <Image src="/footer/animated_zigzag.gif" alt="Animated zigzag pattern" width={350} height={20} priority unoptimized className="w-full h-auto object-contain mix-blend-multiply" />
                                                        </div> */}
                                                        <div className="absolute top-4 right-5 z-10 bg-gray-200 mt-1">
                                                            <Image
                                                                src="/footer/animated_zigzag.gif"
                                                                alt="Animated zigzag pattern"
                                                                width={200}
                                                                height={80}
                                                                unoptimized
                                                                className="h-20 w-auto object-contain mix-blend-multiply"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 rounded-lg">
                                                <motion.p {...animatedCard} className="text-balance text-[15px] text-black/80">
                                                    <AnimatedWord delay={0.06} text="This section is built to feel alive: the footer peeks into the viewport, then smoothly expands to fill the screen with a clean white background, subtle grain, repeated typography, and an award-inspired content layout that feels both playful and intentional." />
                                                </motion.p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex h-full w-full flex-col gap-4 bg-white p-6 shadow-sm md:w-[40%]">
                                <div className="h-[35%] bg-slate-50 rounded-xl p-4 flex flex-row gap-4 w-full">
                                    <div className="w-[50%] p-3">
                                        <Image src="/footer/animated_blob_gloop.gif" alt="animated blob gloop" width={380} height={35} loading="lazy" unoptimized className="w-full h-auto object-contain mix-blend-multiply" />
                                    </div>

                                    <div className="w-[50%] bg-white rounded-lg p-3 border border-slate-100">
                                        ABOUT
                                    </div>
                                </div>

                                <div className="relative flex h-[65%] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 p-5">
                                    <div className="absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl pointer-events-none" />
                                    <div className="relative z-10 flex flex-col gap-2">
                                        <div className="grid grid-cols-2 gap-3">
                                            {SOCIALS.map((social) => {
                                                const Icon = social.icon;

                                                return (
                                                    <Link key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden bg-white px-4 py-1 transition-all duration-300 hover:-translate-y-1">
                                                        <div className="relative flex items-center gap-3">
                                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                                                <Icon className="text-base text-slate-600 group-hover:text-indigo-600" />
                                                            </div>
                                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                                                {social.label}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-2">
                                        <CustomButton title="Let's Get In Contact" onClick={handleNavigation} width="250" height="45" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="mx-auto flex max-w-[1600px] flex-col justify-between px-4 py-5">
                        <div className="mb-5 flex h-[20vh] w-full gap-2 bg-gray-300 p-2">
                            <div className="flex h-full w-[20%] flex-col rounded-xl border border-slate-200 bg-white p-4 text-black shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">
                                    Made in india
                                </p>

                                <div className="mt-auto flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400">
                                    <span> 2026 </span> <span> v1.0 </span>
                                </div>

                                <Image src="/footer/animated_binary_code.gif" alt="animated binary code" width={300} height={100} priority unoptimized className="mt-auto object-contain mix-blend-multiply" />
                            </div>

                            <div className="flex w-[80%] flex-col gap-2">
                                <div className="group relative flex-2 overflow-hidden border border-slate-200 bg-white p-2 shadow-sm">
                                    <p className="text-sm leading-relaxed text-slate-700">
                                        Think more, design less. Build intentionally. Refactor ruthlessly. Simplify until it breaks. Ship often. Leave the web better than you found it. Build hooks, not walls. For best results, pair with coffee, curiosity, and a dash of skepticism.
                                    </p>
                                </div>

                                <div className="flex w-full items-center justify-between gap-4 overflow-hidden border border-slate-50 px-4 py-1/2 bg-white shadow-sm whitespace-nowrap">
                                    <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-600 shrink">
                                        Independent Developer
                                    </span>

                                    <div className="min-w-0 shrink">
                                        <Image src="/footer/animated_decorative_dashes.gif" alt="animated decorative dashes" width={100} height={24} priority unoptimized className="h-5 w-auto object-contain mix-blend-multiply opacity-80" />
                                    </div>

                                    <span className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 shrink-0">
                                        <FaRegCopyright className="shrink-0" />
                                        <span>2026 Akhil Shetty M.</span>
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="relative h-35 w-full overflow-hidden bg-white">
                        <div className="absolute top-5 right-5 z-10">
                            <button onClick={scrollToTop} className="flex items-center gap-1.5 text-sm font-bold text-black/50 hover:opacity-70 transition-opacity cursor-pointer">
                                <span className="uppercase"> Back To Top </span>
                                <Image src="/footer/barcode_name.svg" alt="barcode name" width={30} height={14} priority unoptimized className="h-[0.95em] w-auto object-contain mix-blend-multiply opacity-80" />
                            </button>
                        </div>

                        <div className="absolute top-8 left-15 z-10">
                            <button onClick={handleHitMeUp}>
                                <span className="uppercase text-xs font-bold text-black/50 hover:text-black cursor-pointer"> Am probably not sleeping, Hit me up </span>
                            </button>
                        </div>

                        <h2 className="absolute left-1/2 bottom-[-0.36em] -translate-x-1/2 select-none whitespace-nowrap text-[clamp(1rem,12vw,15rem)] font-extrabold uppercase leading-none tracking-[-0.08em] text-black origin-center scale-x-[1.2]">
                            AKHIL SHETTY{"\u00A0"}
                        </h2>
                    </div>

                </div>
            </motion.div>
        </motion.section>
    );
};

export default Footer;