"use client";

import Image from "next/image";
import { FaFileAlt } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import CustomButton from "./basic/CustomButton";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaInstagram, FaGithub, FaLinkedin, FaSalesforce } from "react-icons/fa6";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";


const socials = [
    { icon: FaGithub, label: "GitHub", href: "#" },
    { icon: FaLinkedin, label: "LinkedIn", href: "#" },
    { icon: FaInstagram, label: "Instagram", href: "#" },
    { icon: FaFileAlt, label: "Resume", href: "#" },
    { icon: FaSalesforce, label: "Salesforce", href: "#" },
    { icon: SiLeetcode, label: "LeetCode", href: "#" },
];

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

function MarqueeLine({ text }) {
    return (
        <div className="relative overflow-hidden py-2">
            <motion.div className="flex w-max items-center gap-6 whitespace-nowrap" animate={{ x: [0, -2400] }} transition={{ duration: 46, ease: "linear", repeat: Infinity }}>
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-6">
                        <span className="text-[5.0rem] font-bold tracking-[-0.08em] text-black/90"> {text} </span>
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
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-6">
                        <span className="text-[2.0rem] font-bold tracking-normal text-black/90"> {text} </span>
                        <span className="h-3 w-3 rounded-full bg-black/90" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

const Footer = () => {
    const sectionRef = useRef(null);
    const [shouldSnap, setShouldSnap] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const snapScale = useSpring(useTransform(scrollYProgress, [0, 0.18, 0.46, 1], [0.94, 0.97, 1, 1]), {
        stiffness: 90,
        damping: 22,
        mass: 0.7,
    });
    const snapY = useSpring(useTransform(scrollYProgress, [0, 0.22, 0.48, 1], [72, 32, 0, 0]), {
        stiffness: 90,
        damping: 22,
        mass: 0.7,
    });
    const snapRadius = useTransform(scrollYProgress, [0, 0.2, 0.5, 1], [32, 24, 18, 0]);
    const opacityGlow = useTransform(scrollYProgress, [0, 0.15, 0.45, 1], [0, 0.22, 0.4, 0.48]);

    useEffect(() => {
        if (prefersReducedMotion) return;

        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const ratio = entry.intersectionRatio;
                setShouldSnap(ratio > 0.38);
            },
            { threshold: [0, 0.15, 0.25, 0.38, 0.55, 0.75, 1] }
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
        console.log("navigate to start page")
    }

    return (
        <section ref={sectionRef} className="relative w-full bg-white text-black">

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div style={{ opacity: opacityGlow }}
                    className="absolute left-1/2 top-12 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-black/5 blur-3xl sm:h-[38rem] sm:w-[38rem]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.03),transparent_45%),linear-gradient(to_bottom,rgba(0,0,0,0.03),transparent_18%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_78%)]" />
            </div>


            <div className="relative flex flex-row items-center overflow-hidden py-5 w-full">
                <div className="flex-1 rounded-lg text-sm p-4 flex items-center justify-start min-w-0">
                    <Image src="/QR-Border-Icon.gif" alt="QR Border Graphic Left" width={200} height={56} priority unoptimized style={{ width: 'auto' }} className="z-10 h-14 object-contain mix-blend-multiply" />
                </div>

                <div className="flex-1 rounded-lg text-sm p-4 overflow-hidden min-w-0 flex items-center">
                    <div className="animate-marquee flex whitespace-nowrap">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <span key={i} className="mx-8 text-xs md:text-sm uppercase tracking-[0.3em] font-medium text-black">
                                IN CASE OF EMERGENCY. PLEASE GO BACK AND VIEW ALL PROJECTS
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex-1 rounded-lg text-sm p-4 flex items-center justify-end min-w-0">
                    <Image src="/QR-Border-Icon.gif" alt="QR Border Graphic Right" width={200} height={56} priority unoptimized style={{ width: 'auto' }} className="z-10 h-14 object-contain mix-blend-multiply" />
                </div>
            </div>


            <motion.div style={prefersReducedMotion ? undefined : { scale: snapScale, y: snapY, borderRadius: snapRadius }} animate={prefersReducedMotion ? undefined : { boxShadow: shouldSnap ? "0 30px 80px rgba(0,0,0,0.12)" : "0 10px 32px rgba(0,0,0,0.06)" }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto min-h-[100svh] w-full overflow-hidden bg-white">

                <div className="mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col justify-between px-4 py-5">
                    <div className="flex flex-col md:flex-row h-[75vh] w-full gap-4 mb-5">

                        <div className="w-full md:w-[60%] text-white">
                            <div className="flex flex-col gap-4 h-full w-full">
                                <div className="flex-1 p-4 flex items-center justify-center text-indigo-900">
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
                                                    <div className="absolute top-4 right-5 z-10 bg-gray-200 pt-3">
                                                        <Image src="/ZIGZAG_ANI.gif" alt="Animated zigzag pattern" width={380} height={30} priority unoptimized className="object-contain mix-blend-multiply" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 rounded-lg">
                                            <motion.p {...animatedCard} className="text-balance text-[clamp(1rem,1.15vw,1.25rem)] leading-[1.85] text-black/80 sm:text-[clamp(1.05rem,1.1vw,1.35rem)]">
                                                <AnimatedWord delay={0.06} text="This section is built to feel alive: the footer peeks into the viewport, then smoothly expands to fill the screen with a clean white background, subtle grain, repeated typography, and an award-inspired content layout that feels both playful and intentional." />
                                            </motion.p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="w-full md:w-[40%] bg-white p-6 border border-slate-200 shadow-sm flex flex-col gap-4 h-full">
                            <div className="h-[35%] bg-slate-50 rounded-xl p-4 flex flex-row gap-4 w-full">
                                <div className="w-[50%] p-3">
                                    <Image src="/Blob-Gloop-Icon.gif" alt="Animated zigzag pattern" width={380} height={35} priority unoptimized className="object-contain mix-blend-multiply" />
                                </div>

                                <div className="w-[50%] bg-white rounded-lg p-3 border border-slate-100">
                                    ABOUT
                                </div>
                            </div>


                            <div className="h-[65%] rounded-2xl border border-slate-200 p-5 flex flex-col justify-between overflow-hidden relative">

                                <div className="absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl pointer-events-none" />
                                <div className="relative z-10 flex flex-col gap-2">

                                    <div className="grid grid-cols-2 gap-3">

                                        {socials.map((social) => {
                                            const Icon = social.icon;

                                            return (
                                                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden bg-white px-4 py-1 transition-all duration-300 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10  hover:-translate-y-1">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                    <div className="relative flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                                            <Icon className="text-base text-slate-600 group-hover:text-indigo-600" />
                                                        </div>

                                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                                            {social.label}
                                                        </span>
                                                    </div>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <CustomButton title="Let's Get In Contact" onClick={handleNavigation} width="250" height="45" />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-row h-[20vh] w-full gap-2 bg-gray-300 p-2 mb-5">
                        <div className="w-[20%] text-black bg-white p-4 rounded-xl flex flex-col h-full border border-slate-200 shadow-sm">
                            <p className="uppercase tracking-normal text-xs font-semibold text-slate-500">
                                Made in india
                            </p>

                            <div className="mt-auto flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400">
                                <span>2026</span> <span>v1.0</span>
                            </div>

                            <Image src="/Binary-Code-Icon.gif" alt="Animated zigzag pattern" width={300} height={100} priority unoptimized className="object-contain mix-blend-multiply mt-auto" />
                        </div>

                        <div className="flex w-[80%] flex-col gap-2">
                            <div className="group relative flex-[2] overflow-hidden border border-slate-200 bg-white p-2 shadow-sm">
                                <p className="text-sm leading-relaxed text-slate-700">
                                    Think more, design less. Build intentionally. Refactor ruthlessly. Simplify until it breaks. Ship often. Leave the web better than you found it. Build hooks, not walls. For best results, pair with coffee, curiosity, and a dash of skepticism.
                                </p>
                            </div>

                            <div className="flex flex-1 items-center justify-between overflow-hidden border border-slate-50 px-4 shadow-sm">
                                <div className="flex flex-col">
                                    <span className="text-sm text-slate-600 font-semibold uppercase"> Independent Developer </span>
                                </div>

                                <Image src="/dashes.gif" alt="Decorative Dashes" width={280} height={32} priority unoptimized className="h-6 w-auto object-contain mix-blend-multiply opacity-80" />

                                <div className="flex flex-col">
                                    <span className="text-sm uppercase"> akhil@2026 </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="relative w-full h-[150px] overflow-hidden bg-white">
                    <h2 className="absolute left-1/2 bottom-[-0.35em] -translate-x-1/2 whitespace-nowrap select-none text-[clamp(1rem,12vw,15rem)] font-extrabold uppercase leading-none tracking-[-0.08em] text-black flex items-baseline">
                        AKHIL{"\u00A0"} SHETTY{"\u00A0"}{"\u00A0"}

                        <Image src="/akhil2.svg" alt="Animated zigzag pattern" width={30} height={100} priority unoptimized className="inline-block w-[0.2em] h-[0.95em] object-contain mix-blend-multiply translate-y-[0.05em]" />
                    </h2>
                </div>

            </motion.div>
        </section>
    );
}

export default Footer;