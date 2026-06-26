import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CHARS, CLAMP, EASEOUTEXPO, ERRORBITS, LERP, SAMPLES } from "@/utils/basic-utils";

export function getCardState(progress, index) {
    const enterStart = 0.08 + index * 0.08;
    const enterEnd = 0.24 + index * 0.08;

    const reverseIndex = 3 - index;
    const exitStart = 0.68 + reverseIndex * 0.05;
    const exitEnd = 0.82 + reverseIndex * 0.05;

    const rawEnter = CLAMP((progress - enterStart) / (enterEnd - enterStart), 0, 1);
    const rawExit = CLAMP((progress - exitStart) / (exitEnd - exitStart), 0, 1);

    const enterT = EASEOUTEXPO(rawEnter);
    const exitT = EASEOUTEXPO(rawExit);

    const positions = [
        { x: -360, y: 0, rotate: -10 },
        { x: -120, y: -10, rotate: -3 },
        { x: 120, y: 10, rotate: -8 },
        { x: 360, y: 0, rotate: 5 },
    ];

    const final = positions[index];
    const x = LERP(0, final.x, enterT);

    const enteredY = LERP(480, final.y, enterT);
    const exitedY = LERP(final.y, final.y - 520, exitT);
    const y = rawExit > 0 ? exitedY : enteredY;

    const scaleIn = LERP(0.82, 1, enterT);
    const scaleOut = LERP(1, 0.92, exitT);
    const scale = scaleIn * scaleOut;

    const opacity = LERP(0, 1, enterT) * LERP(1, 0, exitT);
    const rotate = LERP(0, final.rotate, enterT);
    const blur = rawExit > 0 ? LERP(0, 18, exitT) : LERP(22, 0, enterT);

    return { x, y, scale, opacity, rotate, blur, rawExit };
}

export function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

export function useBodyLock(lock = true) {
    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        const prevTouch = document.body.style.touchAction;
        if (lock) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
        }
        return () => {
            document.body.style.overflow = prevOverflow;
            document.body.style.touchAction = prevTouch;
        };
    }, [lock]);
}

export function useWheelDeck(onDown, onUp, enabled = true) {
    useEffect(() => {
        if (!enabled) return undefined;

        const handleWheel = (e) => {
            e.preventDefault();
            if (Math.abs(e.deltaY) < 2) return;
            if (e.deltaY > 0) onDown?.();
            if (e.deltaY < 0) onUp?.();
        };

        let startY = 0;
        const handleTouchStart = (e) => {
            startY = e.touches?.[0]?.clientY ?? 0;
        };
        const handleTouchMove = (e) => {
            e.preventDefault();
            const currentY = e.touches?.[0]?.clientY ?? 0;
            const delta = startY - currentY;
            if (Math.abs(delta) < 12) return;
            if (delta > 0) onDown?.();
            if (delta < 0) onUp?.();
            startY = currentY;
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [onDown, onUp, enabled]);
}

export function CurtainText({ children, delay = 0, className = "" }) {
    return (
        <div className={`overflow-hidden ${className}`}>
            <motion.div initial={{ y: "108%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ duration: 0.9, delay, ease: [0.77, 0, 0.175, 1] }} >
                {children}
            </motion.div>
        </div>
    );
}

function GlitchText({ children, className = "" }) {
    return (
        <span className={`relative inline-block ${className}`}>
            <span className="glitch-layer glitch-layer-a"> {children} </span>
            <span className="glitch-layer glitch-layer-b"> {children} </span>
            <span className="relative z-10"> {children} </span>
        </span>
    );
}

export function CodeRain({ active }) {
    const [lines, setLines] = useState([]);

    useEffect(() => {
        if (!active) return undefined;

        const id = setInterval(() => {
            setLines((prev) => {
                const next = [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        text: SAMPLES[Math.floor(Math.random() * SAMPLES.length)],
                        x: Math.random() * 90 + 2,
                        y: Math.random() * 100,
                        delay: Math.random() * 0.6,
                    },
                ];

                return next.slice(-42);
            });
        }, 110);

        return () => clearInterval(id);
    }, [active]);

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_40%)]" />
            {active && lines.map((line, idx) => (
                <motion.div
                    key={line.id}
                    initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                    animate={{ opacity: 0.9, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.22, delay: line.delay }}
                    className="absolute font-mono text-[10px] leading-none tracking-[0.28em] text-white/75 md:text-[11px]"
                    style={{ left: `${line.x}%`, top: `${line.y}%`, transform: `translate(-50%, -50%) rotate(${(idx % 5) - 2}deg)` }}>
                    {line.text}
                </motion.div>
            ))}
        </div>
    );
}

export function GlitchField({ active, seed }) {
    const [tick, setTick] = useState(0);

    const glitchPositions = ERRORBITS.map((_, i) => {
        const seedNum = (seed || 1) * (i + 1);

        return {
            xShift: ((seedNum * 13) % 20) - 10,
            yShift: ((seedNum * 7) % 8) - 4,
            useGlitch: seedNum % 4 === 0,
            left: `${5 + (i * 11) % 80}%`,
            top: `${10 + (i * 12) % 75}%`,
        };
    });

    useEffect(() => {
        if (!active) return;

        const delay = 350 + Math.random() * 400;

        const id = setInterval(() => {
            if (Math.random() > 0.4) {
                setTick((t) => t + 1);
            }
        }, delay);

        return () => clearInterval(id);
    }, [active]);

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div animate={{ opacity: tick % 7 === 0 ? [0, 0.18, 0] : 0 }} transition={{ duration: 0.08 }} className="absolute inset-0 bg-white mix-blend-screen" />

            <div className="absolute inset-0 opacity-[0.035] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.15)_3px)]" />

            <motion.div key={`flash-${seed}-${tick}`} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.12, 0.04, 0], scale: [1, 1.02, 1] }} transition={{ duration: 0.25 }} className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_45%)] mix-blend-screen" />

            {ERRORBITS.map((bit, i) => {
                const config = glitchPositions[i];

                return (
                    <motion.div key={`${bit}-${tick}-${i}`}
                        initial={{ opacity: 0, x: i % 2 ? 120 : -120 }}
                        animate={{ opacity: [0, 0.8, 0.3], x: [0, config.xShift, 0], y: [0, config.yShift, 0] }}
                        transition={{ duration: 0.18, delay: i * 0.03, ease: "linear" }}
                        className="absolute font-mono text-[10px] uppercase tracking-[0.35em] text-white/70 md:text-[11px]"
                        style={{ left: config.left, top: config.top }}>

                        {config.useGlitch ? (
                            <GlitchText>{bit}</GlitchText>
                        ) : (
                            bit
                        )}

                    </motion.div>
                );
            })}
        </div>
    );
}

function BottomCurtain({ active }) {
    return (
        <motion.div initial={false}
            animate={active ? { width: "100vw", height: "100vh", borderRadius: 0, x: 0, y: 0 } : { width: "92vw", height: "88vh", borderRadius: 32, x: "4vw", y: 0 }}
            transition={{ duration: 1.05, ease: [0.77, 0, 0.175, 1] }}
            className="absolute bottom-0 left-0 bg-black"
            style={{ transformOrigin: "bottom center" }} />
    );
}

export function SceneShell({ dark, curtain = false, children }) {
    return (
        <div className={`relative h-screen w-full overflow-hidden ${dark ? "bg-black text-white" : "bg-white text-black"}`}>
            {curtain ? <BottomCurtain active /> : null}
            <div className={`absolute inset-0 ${dark ? "bg-black" : "bg-white"}`} />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),transparent_40%)] opacity-40" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[linear-gradient(rgba(0,0,0,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.25)_1px,transparent_1px)] bg-size-[100%_100%,100%_100%]" />
            <div className="relative z-10 h-full w-full"> {children} </div>
        </div>
    );
}

export function SceneShell2({ dark, curtain = false, children }) {
    return (
        <div
            className={`relative h-screen w-full overflow-hidden ${dark ? "bg-black text-white" : "bg-white text-black"}`}>
            {curtain ? <BottomCurtain active /> : null}

            <div className={`absolute inset-0 z-0 ${dark ? "bg-black" : "bg-white"}`} />
            <div className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),transparent_40%)] opacity-40" />
            <div className="pointer-events-none absolute inset-0 z-2 opacity-[0.08] mix-blend-overlay bg-[linear-gradient(rgba(0,0,0,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.25)_1px,transparent_1px)] bg-size-[100%_100%,100%_100%]" />

            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </div>
    );
}

/* GlitchText */
export function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
}