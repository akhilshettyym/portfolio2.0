"use client";

import React from "react";
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";

const DEFAULT_CARDS = [
    {
        amount: "$12B",
        badge: "SEQUOIA",
        caption: "",
    },
    {
        amount: "$14B",
        badge: "A16Z",
        caption: "",
    },
    {
        amount: "$8B",
        badge: "FOUNDERS",
        caption: "",
    },
    {
        amount: "$4B",
        badge: "YC",
        caption: "",
    },
];

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

function FloatingCard({ card, index, progress }) {
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
        ["rgba(255,255,255,0.40)", "rgba(255,255,255,0.98)"]
    );

    const border = useTransform(
        finalized,
        [0, 1],
        ["rgba(255,255,255,0.60)", "rgba(0,0,0,0.08)"]
    );

    const shadow = useTransform(
        finalized,
        [0, 1],
        ["0 40px 100px rgba(0,0,0,0.10)", "0 40px 120px rgba(0,0,0,0.14)"]
    );

    const whiteWash = useTransform(finalized, [0, 1], [0, 1]);

    return (
        <motion.div className="absolute left-1/2 top-1/2 w-75 -translate-x-1/2 -translate-y-1/2" style={{ x: stateX, y: stateY, scale: stateScale, opacity: stateOpacity, rotate: stateRotate, filter: blurFilter, zIndex: 20 + index }}>
            <motion.div className="relative overflow-hidden rounded-3xl border backdrop-blur-3xl" style={{ background, borderColor: border, boxShadow: shadow }}>
                <motion.div className="absolute inset-0 bg-white" style={{ opacity: whiteWash }} />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_60%)]" />

                <div className="absolute inset-px rounded-[calc(2.6rem-1px)] border border-white/30" />

                <div className="relative flex min-h-110 flex-col justify-between p-9">
                    <div className="flex items-start justify-between">
                        <h2 className="text-[3.6rem] font-semibold tracking-tight text-black">
                            {/* {card.amount} */}
                        </h2>

                        <div className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.32em] text-black/60">
                            {card.badge}
                        </div>
                    </div>

                    <div>
                        <p className="max-w-[15ch] text-xl leading-10 text-black/60">
                            {/* {card.caption} */}
                        </p>

                        <div className="mt-7 h-px w-full bg-black/10" />

                        <div className="mt-5 flex items-center justify-between">
                            <span className="text-[11px] uppercase tracking-[0.3em] text-black/40">
                                {/* Portfolio */}
                            </span>

                            <span className="text-[11px] uppercase tracking-[0.3em] text-black/40">
                                {/* 2026 */}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function ScrollCardStackReveal({ cards = DEFAULT_CARDS }) {
    const sectionRef = React.useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    const progress = useSpring(scrollYProgress, {
        stiffness: 26,
        damping: 22,
        mass: 1.1,
    });

    const backgroundBlur = useTransform(
        progress,
        [0, 0.4, 0.8],
        [0, 5, 12]
    );

    const backgroundFilter = useMotionTemplate`blur(${backgroundBlur}px)`;

    return (
        <section ref={sectionRef} className="relative h-[425vh] bg-white">
            <div className="sticky top-0 h-screen overflow-hidden bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),transparent_55%)]" />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <motion.div className="flex flex-col items-center gap-2 text-center" style={{ filter: backgroundFilter }}>
                        <div className="text-[clamp(2rem,4vw,4rem)] font-black uppercase text-black/50">
                            ACHIEVEMENTS
                        </div>
                    </motion.div>
                </div>

                <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                    <div className="relative h-full w-full max-w-400">
                        {cards.map((card, index) => (
                            <FloatingCard key={`${card.amount}-${index}`} card={card} index={index} progress={progress} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}