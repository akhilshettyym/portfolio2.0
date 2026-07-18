"use client";

import Link from "next/link";
import Image from "next/image";
import { SOCIALS } from "@/utils/basic";
import { goToTop } from "@/utils/funct";
import { useRouter } from "next/navigation";
import { FaRegCopyright } from "react-icons/fa6";
import { useDeviceType } from "@/hooks/useDeviceType";
import CustomButton from "@/components/basic/CustomButton";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

function splitLetters(text) {
    return Array.from(text);
}

function AnimatedWord({ text, className = "", delay = 0 }) {
    const chars = useMemo(() => splitLetters(text), [text]);

    return (
        <span className={className} aria-label={text}>
            {chars.map((char, index) => (
                <motion.span key={`${char}-${index}`}
                    initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: delay + index * 0.015 }}
                    className="inline-block"
                    style={{ whiteSpace: char === " " ? "pre" : "normal" }}>
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
}

const MarqueeLine = ({ text, large }) => {
    const marqueeAnimation = large ? { x: [0, -2400] } : { x: [-2400, 0] };

    return (
        <div className="relative overflow-hidden py-2">
            <motion.div className="flex w-max items-center gap-6 whitespace-nowrap"
                transition={{ duration: 46, ease: "linear", repeat: Infinity }}
                animate={marqueeAnimation}>

                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-6">
                        <span className={`font-bold text-black/90 ${large ? "text-[5rem]" : "text-[2rem]"}`}>
                            {" "}{text}{" "}
                        </span>
                        <span className="h-3 w-3 rounded-full bg-black/90 sm:h-4 sm:w-4" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const MarqueeLineLow = ({ text, large, isMobile }) => {

    return (
        <div className="relative overflow-hidden py-2">
            <motion.div className="flex w-max items-center gap-6 whitespace-nowrap"
                transition={{ duration: 46, ease: "linear", repeat: Infinity }}>

                <div className="flex items-center gap-6">
                    <span className={`font-bold text-black/90 ${large ? (isMobile ? "text-[3rem]" : "text-[5rem]") : "text-[2rem]"}`}>
                        {" "}{text}{" "}
                    </span>
                    <span className="h-3 w-3 rounded-full bg-black/90 sm:h-4 sm:w-4" />
                </div>
            </motion.div>
        </div>
    );
};

const Footer = () => {
    const router = useRouter();
    const sectionRef = useRef(null);
    const [shouldSnap, setShouldSnap] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const { isMobile } = useDeviceType();
    const { isTier2 } = usePerformanceTier();

    useEffect(() => {
        const handle = window.setTimeout(() => setIsHydrated(true), 0);
        return () => window.clearTimeout(handle);
    }, []);

    const { scrollYProgress } = useScroll({
        target: isHydrated ? sectionRef : null,
        offset: ["start end", "end start"],
    });

    const sectionPadding = useSpring(
        useTransform(scrollYProgress, [0, 0.28, 0.42, 0.56, 1], [50, 50, 30, 0, 0]),
        { stiffness: 72, damping: 20, mass: 0.9 },
    );

    const revealLift = useSpring(
        useTransform(scrollYProgress, [0, 0.28, 0.55, 1], [16, 10, 0, 0]),
        { stiffness: 80, damping: 22, mass: 0.8 },
    );

    const shellShadow = useTransform(
        scrollYProgress,
        [0, 0.16, 0.42, 1],
        ["0 10px 32px rgba(0,0,0,0.08)",
            "0 18px 48px rgba(0,0,0,0.12)",
            "0 28px 70px rgba(0,0,0,0.16)",
            "0 36px 90px rgba(0,0,0,0.20)"],
    );

    const curtainOpacity = useTransform(
        scrollYProgress,
        [0, 0.12, 0.3, 0.56, 1],
        [1, 0.96, 0.84, 0.42, 0],
    );

    const gridOpacity = useTransform(
        scrollYProgress,
        [0, 0.18, 0.5, 1],
        [0.18, 0.14, 0.08, 0],
    );

    const glowOpacity = useTransform(
        scrollYProgress,
        [0, 0.12, 0.34, 0.7, 1],
        [0.32, 0.22, 0.12, 0.04, 0],
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
            { threshold: 0.4 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [prefersReducedMotion]);

    const animatedCard = prefersReducedMotion
        ? {}
        : {
            initial: { opacity: 0, y: 24, filter: "blur(10px)" },
            whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
            viewport: { once: true, amount: 0.25 },
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        };

    const handleNavigation = () => {
        router.push("/start");
        goToTop();
    };

    const topOverlayOpacity = useTransform(
        scrollYProgress,
        [0, 0.2, 0.5, 1],
        [0.7, 0.5, 0.2, 0],
    );

    const topBorderOpacity = useTransform(
        scrollYProgress,
        [0, 0.18, 0.45, 1],
        [0.85, 0.5, 0.18, 0],
    );

    const renderTierOneFooter = () => {
        return (
            <motion.section ref={sectionRef} style={prefersReducedMotion ? undefined : { padding: sectionPadding }} className="relative z-50 w-full bg-white text-black p-12.5">

                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <motion.div style={{ opacity: glowOpacity }}
                        className="absolute left-1/2 top-10 h-128 w-lg -translate-x-1/2 rounded-full bg-white blur-3xl sm:h-184 sm:w-184" />

                    <motion.div style={{ opacity: gridOpacity }}
                        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[64px_64px]" />

                    <motion.div style={{ opacity: curtainOpacity }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_52%)]" />
                </div>

                <motion.div style={prefersReducedMotion ? undefined : { y: revealLift, boxShadow: shellShadow }}
                    className="relative mx-auto min-h-svh w-full overflow-hidden bg-white z-10">

                    <motion.div aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_20%,transparent_45%)]"
                        style={{ opacity: topOverlayOpacity }} />

                    <motion.div aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-black/10"
                        style={{ opacity: topBorderOpacity }} />

                    <div className="relative z-40">
                        <div className="mx-auto flex w-full max-w-[1600px] flex-col justify-between px-4 py-5">
                            <div className="mb-5 flex h-[55vh] w-full flex-col gap-4 md:flex-row">
                                <div className="w-full text-white md:w-[60%]">
                                    <div className="flex h-full w-full flex-col gap-4">
                                        <div className="flex flex-1 items-center justify-center p-4 text-indigo-900">
                                            <div className="overflow-hidden">
                                                <MarqueeLine large={true} text="A DESIGNER & DEVELOPER. CREATIVELY DRIVEN." />
                                                <MarqueeLine text="A DESIGNER & DEVELOPER. CREATIVELY DRIVEN." />
                                            </div>
                                        </div>

                                        <div className="relative flex-1 overflow-hidden rounded-md bg-gray-200 p-6 text-black">
                                            <div className="flex h-full w-full flex-col gap-4">
                                                <div className="flex-1 rounded-md">
                                                    <div className="flex flex-row gap-4 h-full w-full">
                                                        <div className="flex-1 bg-gray-300 rounded-md p-4">
                                                            This section is built to feel alive
                                                        </div>

                                                        <div className="flex-1 bg-gray-200 rounded-md p-4">
                                                            <div className="absolute top-4 right-5 z-10 bg-gray-200 mt-1">
                                                                <Image src="/footer/animated_zigzag.gif" alt="Animated zigzag pattern" width={200} height={80} unoptimized className="h-20 w-auto object-contain mix-blend-multiply" style={{ width: 'auto', height: 'auto' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-1 rounded-md">
                                                    <motion.p {...animatedCard} className="text-balance text-[15px] text-black/80">
                                                        <AnimatedWord delay={0.06} text="This section is built to feel alive: the footer peeks into the viewport, then smoothly expands to fill the screen with a clean white background, subtle grain, repeated typography, and an award-inspired content layout that feels both playful and intentional." />
                                                    </motion.p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex h-full w-full flex-col gap-4 bg-white p-6 shadow-sm md:w-[40%]">
                                    <div className="h-[35%] bg-slate-50 rounded-md p-4 flex flex-row gap-4 w-full">
                                        <div className="w-[50%] p-3">
                                            <Image src="/footer/animated_blob_gloop.gif" alt="animated blob gloop" width={380} height={35} loading="lazy" unoptimized className="w-full h-auto object-contain mix-blend-multiply" />
                                        </div>

                                        <div className="w-[50%] bg-white rounded-md p-3 border border-slate-100">
                                            ABOUT
                                        </div>
                                    </div>

                                    <div className="relative flex h-[65%] flex-col justify-between overflow-hidden rounded-md border border-slate-200 p-5">
                                        <div className="absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl pointer-events-none" />
                                        <div className="relative z-10 flex flex-col gap-2">
                                            <div className="grid grid-cols-2 gap-3">
                                                {SOCIALS.map((social) => {
                                                    const Icon = social.icon;

                                                    return (
                                                        <Link key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden bg-white px-4 py-1 transition-all duration-300 hover:-translate-y-1">
                                                            <div className="relative flex items-center gap-3">
                                                                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100">
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
                                <div className="flex h-full w-[20%] flex-col rounded-md border border-slate-200 bg-white p-4 text-black shadow-sm">
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
                                <button onClick={goToTop} className="flex items-center gap-1.5 text-sm font-bold text-black/50 hover:opacity-70 transition-opacity cursor-pointer">
                                    <span className="uppercase"> Back To Top </span>
                                    <Image src="/footer/barcode_name.svg" alt="barcode name" width={30} height={14} priority unoptimized className="h-[0.95em] w-auto object-contain mix-blend-multiply opacity-80" />
                                </button>
                            </div>

                            <div className="absolute top-8 left-15 z-10">
                                <button onClick={handleNavigation}>
                                    <span className="uppercase text-xs font-bold text-black/50 hover:text-black cursor-pointer">
                                        {" "} Am probably not sleeping, Hit me up{" "}
                                    </span>
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

    const renderTierTwoFooter = () => {
        return (
            <motion.section ref={sectionRef} className="relative z-50 w-full bg-white text-black overflow-hidden">

                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <motion.div style={{ opacity: glowOpacity }} className="absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-white blur-3xl sm:h-184 sm:w-184 lg:h-128 lg:w-lg" />

                    <motion.div style={{ opacity: gridOpacity }} className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[48px_48px] sm:bg-size-[64px_64px]" />

                    <motion.div style={{ opacity: curtainOpacity }} className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_52%)]" />
                </div>

                <motion.div style={prefersReducedMotion ? undefined : { y: revealLift, boxShadow: shellShadow }} className="relative mx-auto min-h-svh w-full overflow-hidden rounded-none bg-white z-10 flex flex-col justify-between">

                    <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_20%,transparent_45%)]"
                        style={{ opacity: topOverlayOpacity }} />

                    <motion.div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-black/10" style={{ opacity: topBorderOpacity }} />

                    <div className="relative z-40 w-full grow flex flex-col justify-between">

                        <div className="mx-auto flex w-full max-w-[1600px] flex-col justify-between px-4 pt-10 md:pt-16 lg:pt-20">
                            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:h-[70vh] min-h-fit">

                                <div className="w-full text-white lg:w-[60%] flex flex-col gap-4">
                                    <div className="flex flex-col items-center justify-center p-4 text-indigo-900 bg-slate-50 rounded-md min-h-37.5 lg:flex-1">
                                        <div className="overflow-hidden w-full text-center">
                                            {isTier2 ? (
                                                <>
                                                    <MarqueeLineLow isMobile={isMobile} large={true} text={isMobile ? "CREATIVELY" : "A DESIGNER & DEVELOPER. CREATIVELY DRIVEN."} />
                                                    <MarqueeLineLow isMobile={isMobile} text={isMobile ? "DRIVEN DESIGNER" : "DRIVEN DESIGNER & DEVELOPER."} />
                                                </>
                                            ) : (
                                                <>
                                                    <MarqueeLine large={true} text="A DESIGNER & DEVELOPER. CREATIVELY DRIVEN." />
                                                    <MarqueeLine isMobile={isMobile} text={isMobile ? "DRIVEN DESIGNER" : "DRIVEN DESIGNER & DEVELOPER."} />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="relative flex-1 overflow-hidden rounded-md bg-gray-200 p-4 sm:p-6 text-black">
                                        <div className="flex h-full w-full flex-col gap-4 justify-between">
                                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                                <div className="flex-1 bg-gray-300 rounded-md p-4 text-sm sm:text-base">
                                                    This section is built to feel alive
                                                </div>

                                                <div className={`flex-1 bg-gray-200 rounded-md relative ${isMobile ? "min-h-15" : "p-4 min-h-20"}`}>
                                                    <div className="absolute top-2 sm:top-4 sm:right-5 z-10 bg-gray-200">
                                                        <Image src="/footer/animated_zigzag.gif" alt="Animated zigzag pattern" width={200} height={80} unoptimized className="h-14 sm:h-20 w-auto object-contain mix-blend-multiply" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full rounded-md mt-2">
                                                <p className="text-balance text-xs sm:text-[15px] text-black/80 text-justify leading-relaxed">
                                                    This section is built to feel alive: the footer peeks into the viewport, then smoothly expands to fill the screen with a clean white background, subtle grain, repeated typography, and an award-inspired content layout that feels both playful and intentional.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full flex-col gap-4 bg-white p-4 sm:p-6 shadow-sm border border-slate-100 rounded-md lg:w-[40%] lg:h-full">

                                    <div className="flex flex-row gap-4 w-full min-h-25 lg:h-[35%] bg-slate-50 rounded-md p-4">
                                        <div className="w-1/2 p-2 flex items-center justify-center">
                                            <Image src="/footer/animated_blob_gloop.gif" alt="animated blob gloop" width={380} height={35} loading="lazy" unoptimized className="w-full h-auto max-h-16 object-contain mix-blend-multiply" />
                                        </div>

                                        <div className="w-1/2 bg-white rounded-md p-3 border border-slate-100 flex items-center justify-center font-bold text-sm tracking-wider">
                                            ABOUT
                                        </div>
                                    </div>


                                    <div className="relative flex flex-col justify-between overflow-hidden rounded-md border border-slate-200 p-4 sm:p-5 lg:h-[65%] gap-6">
                                        <div className="absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl pointer-events-none" />

                                        <div className="relative z-10 w-full">
                                            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
                                                {SOCIALS.map((social) => {
                                                    const Icon = social.icon;

                                                    return (
                                                        <Link key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden bg-white px-3 py-1.5 border border-slate-50 rounded-md transition-all duration-300 hover:-translate-y-1">
                                                            <div className="relative flex items-center gap-3">
                                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100">
                                                                    <Icon className="text-sm text-slate-600 group-hover:text-indigo-600" />
                                                                </div>
                                                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 truncate">
                                                                    {social.label}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex justify-center sm:justify-end mt-auto w-full">
                                            <CustomButton title="Let's Get In Contact" onClick={handleNavigation} width={isMobile ? "100%" : "250"} height="45" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mx-auto flex w-full max-w-[1600px] flex-col justify-between px-4 py-5 mt-auto">
                            <div className="mb-5 flex flex-col md:flex-row w-full gap-3 bg-gray-100 md:bg-gray-300 p-2 rounded-md">

                                <div className="flex h-auto md:h-full w-full md:w-[25%] lg:w-[20%] flex-col justify-between rounded-md border border-slate-200 bg-white p-4 text-black shadow-sm gap-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Made in india
                                    </p>

                                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                                        <span> 2026 </span> <span> v1.0 </span>
                                    </div>

                                    <div className="w-full flex justify-center pt-2 border-t border-slate-100">
                                        <Image src="/footer/animated_binary_code.gif" alt="animated binary code" width={300} height={100} priority unoptimized className="max-h-12 w-auto object-contain mix-blend-multiply" />
                                    </div>
                                </div>

                                <div className="flex w-full md:w-[75%] lg:w-[80%] flex-col gap-2">
                                    <div className="group relative flex-1 overflow-hidden border border-slate-200 bg-white p-2 sm:p-4 rounded-md shadow-sm">
                                        <p className="text-xs sm:text-sm leading-relaxed text-slate-700 text-pretty">
                                            Think more, design less. Build intentionally. Refactor ruthlessly. Simplify until it breaks. Ship often. Leave the web better than you found it. Build hooks, not walls. For best results, pair with coffee, curiosity, and a dash of skepticism.
                                        </p>
                                    </div>

                                    <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-3 overflow-hidden border border-slate-100 px-4 py-2 bg-white shadow-sm rounded-md">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Independent Developer
                                        </span>

                                        <div className="hidden sm:block min-w-0">
                                            <Image src="/footer/animated_decorative_dashes.gif" alt="animated decorative dashes" width={100} height={24} priority unoptimized className="h-4 w-auto object-contain mix-blend-multiply opacity-80" />
                                        </div>

                                        <span className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500">
                                            <FaRegCopyright className="shrink-0" />
                                            <span>2026 Akhil Shetty M.</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-18 sm:h-20 md:h-40 lg:h-35 w-full overflow-hidden bg-white">
                            <div className="absolute top-2 right-4 sm:top-5 sm:right-5 z-20">
                                <button onClick={goToTop} className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-black/50 hover:opacity-70 transition-opacity cursor-pointer">
                                    <span className="uppercase"> Back To Top </span>
                                    <Image src="/footer/barcode_name.svg" alt="barcode name" width={30} height={14} priority unoptimized className="h-[0.95em] w-auto object-contain mix-blend-multiply opacity-80" />
                                </button>
                            </div>

                            <div className="absolute top-2 left-4 sm:top-5 sm:left-10 z-20">
                                <button onClick={handleNavigation} className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-black/50 hover:opacity-70 transition-opacity cursor-pointer">
                                    <span className="uppercase">
                                        Am probably not sleeping, Hit me up
                                    </span>
                                </button>
                            </div>

                            <h2 className="absolute left-1/2 bottom-[-0.28em] -translate-x-1/2 select-none whitespace-nowrap text-[clamp(2.9rem,12vw,12rem)] font-extrabold uppercase leading-none tracking-[-0.06em] text-black origin-center scale-x-[1.1] sm:scale-x-[1.2]">
                                AKHIL SHETTY
                            </h2>
                        </div>
                    </div>
                </motion.div>
            </motion.section>
        );
    }

    const render = () => {
        const renderFooter = isMobile || isTier2;

        if (!isHydrated) {
            return null;
        }

        return (
            <footer key={renderFooter ? "tier2" : "tier1"}>
                {renderFooter ? renderTierTwoFooter() : renderTierOneFooter()}
            </footer>
        );
    };

    return render();

};

export default memo(Footer);