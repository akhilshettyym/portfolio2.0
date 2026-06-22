"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

import { TbCircleArrowUpFilled } from "react-icons/tb";
import { SiPerplexity } from "react-icons/si";
import { IoIosMail } from "react-icons/io";
import { FaMapPin, FaGithub, FaLinkedin } from "react-icons/fa6";

const awardsLeft = [
    {
        label: "Awwwards",
        items: ["5x Honorable Mentions", "1x Mobile Excellence"],
    },
    {
        label: "Muzli",
        items: ["1x Featured Project"],
    },
];

const awardsRight = [
    {
        label: "CSSDA",
        items: ["2x UI Design Awards", "2x UX Design Awards", "2x Innovation Awards", "2x Special Kudos", "1x Site Of The Day"],
    },
    {
        label: "CSS Winner",
        items: ["1x Site Of The Day"],
    },
    {
        label: "WD",
        items: ["1x Site Of The Day"],
    },
];

const socials = [
    { icon: FaGithub, label: "GitHub", href: "#" },
    { icon: FaLinkedin, label: "LinkedIn", href: "#" },
];

function splitLetters(text) {
    return Array.from(text);
}

function AnimatedWord({ text, className = "", delay = 0 }) {
    const chars = useMemo(() => splitLetters(text), [text]);

    return (
        <span className={className} aria-label={text}>
            {chars.map((char, index) => (
                <motion.span
                    key={`${char}-${index}`}
                    initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: delay + index * 0.015 }}
                    className="inline-block"
                    style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
}

function MarqueeLine({ text }) {
    return (
        <div className="relative overflow-hidden py-2 sm:py-3">
            <motion.div
                className="flex w-max items-center gap-6 whitespace-nowrap"
                animate={{ x: [0, -2400] }}
                transition={{ duration: 46, ease: "linear", repeat: Infinity }}
            >
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-6">
                        <span className="text-[2.65rem] font-semibold tracking-[-0.08em] text-black/90 sm:text-[4.2rem] lg:text-[5.8rem]">
                            {text}
                        </span>
                        <span className="h-3 w-3 rounded-full bg-black/90 sm:h-4 sm:w-4" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

function AwardBlock({ title, items }) {
    return (
        <div className="space-y-2 border-l border-black/10 pl-4 sm:pl-5">
            <h5 className="text-xs font-semibold uppercase tracking-[0.28em] text-black/55">{title}</h5>
            <div className="space-y-2">
                {items.map((item) => (
                    <p key={item} className="text-sm leading-none text-black/88 sm:text-base">
                        {item}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default function Footer() {
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

    return (
        <section ref={sectionRef} className="relative w-full bg-white text-black">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    style={{ opacity: opacityGlow }}
                    className="absolute left-1/2 top-12 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-black/5 blur-3xl sm:h-[38rem] sm:w-[38rem]"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.03),transparent_45%),linear-gradient(to_bottom,rgba(0,0,0,0.03),transparent_18%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_78%)]" />
            </div>



            <div className="relative flex items-center overflow-hidden border-y border-black/10 py-4">
                <img
                    src="/QR-Border-Icon.gif"
                    alt=""
                    className="absolute left-4 z-10 h-15 w-100"
                />
                <div className="w-full overflow-hidden">
                    <div className="animate-marquee flex whitespace-nowrap">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <span
                                key={i}
                                className="mx-8 text-xs md:text-sm uppercase tracking-[0.3em]"
                            >
                                IN CASE OF EMERGENCY. PLEASE GO BACK AND VIEW ALL PROJECTS
                            </span>
                        ))}
                    </div>
                </div>
                <img
                    src="/QR-Border-Icon.gif"
                    alt=""
                    className="absolute right-4 z-10 h-15 w-100"
                />
            </div>




            <motion.div
                style={prefersReducedMotion ? undefined : { scale: snapScale, y: snapY, borderRadius: snapRadius }}
                animate={
                    prefersReducedMotion
                        ? undefined
                        : {
                            boxShadow: shouldSnap ? "0 30px 80px rgba(0,0,0,0.12)" : "0 10px 32px rgba(0,0,0,0.06)",
                        }
                }
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto min-h-[100svh] w-full overflow-hidden bg-white"
            >

                <div className="mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col justify-between px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
                    <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-4 text-[10px] uppercase tracking-[0.35em] text-black/55 sm:text-xs">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-black" />
                            <span>Footer / Immersive snap section</span>
                        </div>
                        <a href="#top" className="inline-flex items-center gap-2 transition hover:text-black">
                            Back to top <TbCircleArrowUpFilled size={20} />
                        </a>
                    </div>

                    <div className="grid flex-1 grid-rows-[auto_auto_auto] gap-8 py-6 lg:grid-rows-[auto_1fr_auto] lg:gap-10 lg:py-10">
                        <div className="space-y-1">
                            <div className="flex items-center justify-between gap-4">
                                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-[10px] uppercase tracking-[0.34em] text-black/55 sm:text-xs">
                                    <SiPerplexity size={20} />
                                    In case of emergency
                                </div>
                                <div className="hidden items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-black/45 sm:flex">
                                    <FaMapPin size={20} />
                                    Scroll-triggered full-screen mode
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <motion.p
                                    initial={{ y: 16, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true, amount: 0.9 }}
                                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                    className="mt-3 max-w-[70ch] text-sm leading-[1.7] text-black/75 sm:text-base lg:text-lg"
                                >
                                    <AnimatedWord
                                        text="Please go back and view all projects. This footer expands from a partial peek into a full-screen immersive panel, keeping the same soft white canvas, bold typography, and layered motion language from the pasted reference."
                                    />
                                </motion.p>
                            </div>
                        </div>

                        <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
                            <div className="space-y-6">
                                <div className="overflow-hidden">
                                    <MarqueeLine text="A DESIGNER & DEVELOPER. CREATIVELY DRIVEN." />
                                    <MarqueeLine text="A DESIGNER & DEVELOPER. CREATIVELY DRIVEN." />
                                </div>

                                <div className="max-w-3xl">
                                    <motion.p
                                        {...animatedCard}
                                        className="text-balance text-[clamp(1rem,1.15vw,1.25rem)] leading-[1.85] text-black/80 sm:text-[clamp(1.05rem,1.1vw,1.35rem)]"
                                    >
                                        <AnimatedWord
                                            delay={0.06}
                                            text="This section is built to feel alive: the footer peeks into the viewport, then smoothly expands to fill the screen with a clean white background, subtle grain, repeated type, and an award-style content layout."
                                        />
                                    </motion.p>
                                </div>

                                <motion.div
                                    {...animatedCard}
                                    className="flex flex-wrap items-center gap-3 pt-1"
                                >
                                    {socials.map(({ icon: Icon, label, href }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            className="group inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm text-black/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-black/20 hover:text-black"
                                        >
                                            <Icon className="h-4 w-4 transition group-hover:scale-110" />
                                            {label}
                                        </a>
                                    ))}
                                </motion.div>
                            </div>

                            <motion.div
                                {...animatedCard}
                                className="grid gap-5 rounded-[28px] border border-black/10 bg-white/80 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:rounded-[34px] sm:p-6 lg:p-7"
                            >
                                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold tracking-[-0.05em] sm:text-2xl">ABOUT</h2>
                                        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-black/45">Selected recognition</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg shadow-black/10">
                                        <SiPerplexity size={20} />
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-6">
                                        {awardsLeft.map((group) => (
                                            <AwardBlock key={group.label} title={group.label} items={group.items} />
                                        ))}
                                    </div>
                                    <div className="space-y-6">
                                        {awardsRight.map((group) => (
                                            <AwardBlock key={group.label} title={group.label} items={group.items} />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            {...animatedCard}
                            className="grid gap-4 rounded-[24px] border border-black/10 bg-black/[0.03] p-4 sm:grid-cols-2 sm:items-center sm:gap-6 sm:p-5"
                        >
                            <div className="space-y-1">
                                <p className="text-xs uppercase tracking-[0.34em] text-black/45">Contact</p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-black/72 sm:text-base">
                                    <a className="inline-flex items-center gap-2 transition hover:text-black" href="mailto:hello@example.com">
                                        <IoIosMail size={20} /> hello@example.com
                                    </a>
                                    <span className="hidden h-4 w-px bg-black/10 sm:block" />
                                    <span className="text-black/55">Available for product, motion, and interaction design.</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-start gap-3 sm:justify-end">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ once: true, amount: 0.8 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.32em] text-black/55"
                                >
                                    Designed to snap at ~80%
                                </motion.div>
                                <motion.div
                                    initial={{ scale: 0.92, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ once: true, amount: 0.8 }}
                                    transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                                    className="rounded-full bg-black px-4 py-2 text-xs uppercase tracking-[0.32em] text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                                >
                                    Full screen on reveal
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex items-center justify-between border-t border-black/10 pt-4 text-[10px] uppercase tracking-[0.34em] text-black/45 sm:text-xs">
                        <span>© {new Date().getFullYear()} Footer concept</span>
                        <span>Next.js · React · Tailwind · Framer Motion</span>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}