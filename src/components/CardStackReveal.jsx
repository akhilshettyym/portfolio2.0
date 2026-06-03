"use client";

import React from "react";
import { DEFAULT_CARDS } from "../utils/basic-utils";
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function lerp(from, to, t) {
    return from + (to - from) * t;
}

function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function getCardState(progress, index) {
    const enterStart = 0.08 + index * 0.08;
    const enterEnd = 0.24 + index * 0.08;

    const reverseIndex = 3 - index;
    const exitStart = 0.68 + reverseIndex * 0.05;
    const exitEnd = 0.82 + reverseIndex * 0.05;

    const rawEnter = clamp((progress - enterStart) / (enterEnd - enterStart), 0, 1);
    const rawExit = clamp((progress - exitStart) / (exitEnd - exitStart), 0, 1);

    const enterT = easeOutExpo(rawEnter);
    const exitT = easeOutExpo(rawExit);

    const positions = [
        { x: -360, y: 0, rotate: -10 },
        { x: -120, y: -10, rotate: -3 },
        { x: 120, y: 10, rotate: -8 },
        { x: 360, y: 0, rotate: 5 },
    ];

    const final = positions[index];

    const x = lerp(0, final.x, enterT);

    const enteredY = lerp(480, final.y, enterT);
    const exitedY = lerp(final.y, final.y - 520, exitT);
    const y = rawExit > 0 ? exitedY : enteredY;

    const scaleIn = lerp(0.82, 1, enterT);
    const scaleOut = lerp(1, 0.92, exitT);
    const scale = scaleIn * scaleOut;

    const opacity = lerp(0, 1, enterT) * lerp(1, 0, exitT);

    const rotate = lerp(0, final.rotate, enterT);

    const blur = rawExit > 0 ? lerp(0, 18, exitT) : lerp(22, 0, enterT);

    return { x, y, scale, opacity, rotate, blur, rawExit };
}

function FloatingCard({ card, index, progress, hoveredCard, setHoveredCard }) {
    const stateX = useTransform(progress, (v) => getCardState(v, index).x);
    const stateY = useTransform(progress, (v) => getCardState(v, index).y);
    const stateScale = useTransform(progress, (v) => getCardState(v, index).scale);
    const stateOpacity = useTransform(progress, (v) => getCardState(v, index).opacity);
    const stateRotate = useTransform(progress, (v) => getCardState(v, index).rotate);
    const stateBlur = useTransform(progress, (v) => getCardState(v, index).blur);
    const blurFilter = useMotionTemplate`blur(${stateBlur}px)`;
    const finalized = useTransform(progress, [0.5, 0.9], [0, 1]);

    const background = useTransform(
        finalized,
        [0, 1],
        ["rgba(255,255,255,0.42)", "rgba(255,255,255,0.98)"]
    );
    const border = useTransform(
        finalized,
        [0, 1],
        ["rgba(255,255,255,0.70)", "rgba(0,0,0,0.08)"]
    );
    const shadow = useTransform(
        finalized,
        [0, 1],
        ["0 30px 80px rgba(0,0,0,0.08)", "0 40px 120px rgba(0,0,0,0.14)"]
    );

    const whiteWash = useTransform(finalized, [0, 1], [0, 1]);
    const glow = useTransform(finalized, [0, 1], [0.35, 0.12]);
    const isHovered = hoveredCard === index;
    const hasHoveredCard = hoveredCard !== null;

    return (
        <motion.div className="absolute left-1/2 top-1/2 w-[min(90vw,20rem)] -translate-x-1/2 -translate-y-1/2"
            style={{ x: stateX, y: stateY, scale: stateScale, opacity: stateOpacity, rotate: stateRotate, filter: blurFilter, zIndex: isHovered ? 999 : 20 + index }} animate={{ filter: hasHoveredCard && !isHovered ? "blur(6px)" : "blur(0px)", opacity: hasHoveredCard && !isHovered ? 0.55 : 1, }} transition={{ duration: 0.35, ease: "easeOut" }}>
            <motion.article
                className="relative overflow-hidden rounded-[2rem] border backdrop-blur-3xl"
                style={{ background, borderColor: border, boxShadow: shadow }}
                animate={{ y: isHovered ? -8 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}>
                <motion.div className="pointer-events-none absolute inset-0 rounded-[2rem]"
                    animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.25 }}
                    style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.9), 0 0 25px rgba(255,255,255,0.65), 0 0 60px rgba(255,255,255,0.35)" }} />
                <motion.div className="pointer-events-none absolute -inset-[1px] rounded-[2rem]"
                    animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.25 }}
                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,.9), rgba(255,255,255,.1), rgba(255,255,255,.9))", filter: "blur(12px)" }} />
                <motion.div className="absolute inset-0 bg-white" style={{ opacity: whiteWash }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_55%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.02),transparent_40%,rgba(255,255,255,0.35))]" />
                <div className="absolute left-0 top-0 h-1 w-full bg-[linear-gradient(90deg,rgba(0,0,0,0.10),rgba(0,0,0,0.02),rgba(0,0,0,0.08))]" />
                <motion.div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-black/5 blur-3xl" style={{ opacity: glow }} />
                <div className="relative flex min-h-[30rem] flex-col p-6">
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-black/55">
                            ©0{String(index + 1).padStart(2, "")}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="overflow-hidden">
                            <h1 className="text-[35px] leading-[0.75] font-black tracking-[-0.08em] text-black will-change-transform uppercase" style={{ fontFeatureSettings: '"ss01" on, "ss02" on' }}>
                                {card.title}
                            </h1>
                        </div>
                        <p className="mt-3 max-w-[20rem] text-sm font-medium tracking-tight text-black/45">
                            {card.caption}
                        </p>
                        <p className="mt-5 text-md text-black/68">
                            {card.description}
                        </p>
                    </div>
                    <div className="mt-7">
                        <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-normal text-black/45">
                            <span> Timeline </span>
                            <span> {card.year} </span>
                        </div>
                        <div className="h-px w-full bg-black/10" />
                        <div className="mt-5 flex items-center justify-between gap-3">
                            <div className="text-xs text-black/45"> Decrypt </div>
                            <motion.a href={card.href} target="_blank" rel="noopener noreferrer" whileTap={{ scale: 0.98 }} whileHover={{ y: -1 }} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black px-5 py-3 text-xs font-semibold  text-white tracking-tight shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all hover:bg-black/90">
                                <span> {card.cta} </span>
                                <span aria-hidden="true"> ↗ </span>
                            </motion.a>
                        </div>
                    </div>
                </div>
            </motion.article>
        </motion.div>
    );
}

const CardStackReveal = ({ cards = DEFAULT_CARDS }) => {
    const sectionRef = React.useRef(null);
    const [hoveredCard, setHoveredCard] = React.useState(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    const progress = useSpring(scrollYProgress, {
        stiffness: 26,
        damping: 22,
        mass: 1.1,
    });

    const backgroundBlur = useTransform(progress, [0, 0.4, 0.8], [0, 5, 12]);
    const backgroundFilter = useMotionTemplate`blur(${backgroundBlur}px)`;

    return (
        <section ref={sectionRef} className="relative h-[425vh] bg-white">
            <div className="sticky top-0 h-screen overflow-hidden bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),transparent_55%)]" />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <motion.div className="flex flex-col items-center gap-3 text-center" style={{ filter: backgroundFilter }}>
                        <div className="text-3xl font-black uppercase text-black/50">
                            Achievements
                        </div>
                        <p className="max-w-xl px-6 text-sm leading-6 text-black/35">
                            A visual story of growth, recognition, and consistent progress.
                        </p>
                    </motion.div>
                </div>

                <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                    <div className="relative h-full w-full max-w-[90rem]">
                        {cards.map((card, index) => (
                            <FloatingCard key={`${card.title}-${index}`} card={card} index={index} progress={progress} hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CardStackReveal;