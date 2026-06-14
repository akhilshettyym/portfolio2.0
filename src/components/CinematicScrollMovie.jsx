"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const introLines = [
    "Asking questions is important...",
    "Right ?...",
    "So let's start with one.",
];

const buildingLines = [
    "Building isn't hard.",
    "Knowing what to build is.",
    "Knowing WHY to build it...",
    "is even harder.",
];

const problemQuestions = [
    "I don't start with code.",
    "I start with questions.",
    "Who uses it?",
    "Why does it exist?",
    "What breaks if it fails?",
    "How will it scale?",
    "How will it survive?",
    "Code is the last step.",
];

const aiClaims = [
    "YES.",
    "AI can write code.",
    "AI can refactor code.",
    "AI can deploy code.",
];

const businessQuestions = [
    "Can it understand your business?",
    "Can it protect your data?",
    "Can it see what isn't obvious?",
    "Can it predict what breaks six months later?",
];

const vulnerabilities = [
    "Silent data corruption.",
    "Race condition in production.",
    "Privilege escalation.",
    "Memory leak after 3 months.",
    "Multi-tenant data exposure.",
    "Distributed cache inconsistency.",
    "Deadlock under peak traffic.",
    "Event ordering failure.",
];

const philosophy = [
    "I don't build websites.",
    "I build experiences.",
    "I don't write code.",
    "I design systems.",
    "I don't chase trends.",
    "I solve problems.",
];

const rewindLines = [
    "I solve problems.",
    "I don't chase trends.",
    "I design systems.",
    "I don't write code.",
    "I build experiences.",
    "I don't build websites.",

    "Experience prevents disasters.",
    "Intelligence generates code.",

    "Distributed cache inconsistency.",
    "Race condition in production.",
    "Silent data corruption.",

    "Can it predict what breaks six months later?",
    "Can it protect your data?",
    "Can it understand your business?",

    "I specialize in tools.",

    "Great software isn't written.",
    "It's discovered.",

    "Code is the last step.",
    "Why does it exist?",
    "Who uses it?",

    "Knowing WHY to build it...",
    "Knowing what to build is.",

    "My name is AKHIL.",
];

const historyBands = [
    {
        year: "2018",
        text: "Learning. Experimenting. Breaking things. Building taste. Asking why. Shipping small.Learning. Experimenting. Breaking things. Building taste. Asking why. Shipping small.",
        dir: "left",
    },
    {
        year: "2020",
        text: "Building. Failing. Building again. Learning resilience. Reading systems. Staying curious.Building. Failing. Building again. Learning resilience. Reading systems. Staying curious.",
        dir: "right",
    },
    {
        year: "2022",
        text: "Understanding systems. Not just code. Thinking in flows. Constraints. Tradeoffs. Outcomes.Understanding systems. Not just code. Thinking in flows. Constraints. Tradeoffs. Outcomes.",
        dir: "left",
    },
    {
        year: "2024",
        text: "Engineering products. Solving real problems. Designing trust. Making things work beautifully.Engineering products. Solving real problems. Designing trust. Making things work beautifully.",
        dir: "right",
    },
];

const TOTAL_SCENES = 14;
const DARK_START_SCENE = 6;

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function useBodyLock(lock = true) {
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

function useWheelDeck(onDown, onUp, enabled = true) {
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

function CurtainText({ children, delay = 0, className = "" }) {
    return (
        <div className={`overflow-hidden ${className}`}>
            <motion.div
                initial={{ y: "108%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.9, delay, ease: [0.77, 0, 0.175, 1] }}
            >
                {children}
            </motion.div>
        </div>
    );
}

function GlitchText({ children, className = "" }) {
    return (
        <span className={`relative inline-block ${className}`}>
            <span className="glitch-layer glitch-layer-a">{children}</span>
            <span className="glitch-layer glitch-layer-b">{children}</span>
            <span className="relative z-10">{children}</span>
        </span>
    );
}

function CodeRain({ active }) {
    const [lines, setLines] = useState([]);

    useEffect(() => {
        if (!active) {
            setLines([]);
            return undefined;
        }

        const samples = [
            "const trust = await verify(user, data);",
            "if (!permission) throw new Error('403');",
            "query = sanitize(input);",
            "cache.invalidate('session:' + id);",
            "await deploy(build());",
            "for (let i = 0; i < n; i++) optimize();",
            "server.on('error', recover);",
            "try { render() } catch (e) { alert(e) }",
            "db.transaction(async (tx) => await tx.commit());",
            "security.scan();",
        ];

        const id = setInterval(() => {
            setLines((prev) => {
                const next = [
                    ...prev,
                    {
                        id: Math.random().toString(36).slice(2),
                        text: samples[Math.floor(Math.random() * samples.length)],
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
            {lines.map((line, idx) => (
                <motion.div
                    key={line.id}
                    initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                    animate={{ opacity: 0.9, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.22, delay: line.delay }}
                    className="absolute font-mono text-[10px] leading-none tracking-[0.28em] text-white/75 md:text-[11px]"
                    style={{
                        left: `${line.x}%`,
                        top: `${line.y}%`,
                        transform: `translate(-50%, -50%) rotate(${(idx % 5) - 2}deg)`,
                    }}
                >
                    {line.text}
                </motion.div>
            ))}
        </div>
    );
}

function GlitchField({ active, seed }) {
    const [tick, setTick] = useState(0);

    useEffect(() => {
        if (!active) return;

        const id = setInterval(() => {
            // irregular glitch bursts
            if (Math.random() > 0.4) {
                setTick((t) => t + 1);
            }
        }, 350 + Math.random() * 400);

        return () => clearInterval(id);
    }, [active]);

    const errorBits = [
        "RACE CONDITION DETECTED",
        "SILENT DATA CORRUPTION",
        "UNEXPECTED STATE MUTATION",
        "PERMISSION ESCALATION",
        "STALE CACHE WRITE",
        "MEMORY LEAK",
        "EVENT LOOP BLOCKED",
        "DANGLING REFERENCE",
        "INCONSISTENT REPLICA",
    ];

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">

            {/* Occasional white flash */}
            <motion.div
                animate={{
                    opacity: tick % 7 === 0
                        ? [0, 0.18, 0]
                        : 0,
                }}
                transition={{
                    duration: 0.08,
                }}
                className="absolute inset-0 bg-white mix-blend-screen"
            />

            {/* CRT scanlines */}
            <div
                className="
                    absolute inset-0 opacity-[0.035]
                    bg-[repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent_2px,
                        rgba(255,255,255,0.15)_3px
                    )]
                "
            />

            {/* Ambient pulse */}
            <motion.div
                key={`flash-${seed}-${tick}`}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 0.12, 0.04, 0],
                    scale: [1, 1.02, 1],
                }}
                transition={{
                    duration: 0.25,
                }}
                className="
                    absolute inset-0
                    bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_45%)]
                    mix-blend-screen
                "
            />

            {errorBits.map((bit, i) => {
                const xShift = Math.random() * 20 - 10;
                const yShift = Math.random() * 8 - 4;

                return (
                    <motion.div
                        key={`${bit}-${tick}-${i}`}
                        initial={{
                            opacity: 0,
                            x: i % 2 ? 120 : -120,
                        }}
                        animate={{
                            opacity: [0, 0.8, 0.3],
                            x: [0, xShift, 0],
                            y: [0, yShift, 0],
                        }}
                        transition={{
                            duration: 0.18,
                            delay: i * 0.03,
                            ease: "linear",
                        }}
                        className="
                            absolute
                            font-mono
                            text-[10px]
                            uppercase
                            tracking-[0.35em]
                            text-white/70
                            md:text-[11px]
                        "
                        style={{
                            left: `${5 + (i * 11) % 80}%`,
                            top: `${10 + (i * 12) % 75}%`,
                        }}
                    >
                        {Math.random() > 0.75 ? (
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
        <motion.div
            initial={false}
            animate={
                active
                    ? { width: "100vw", height: "100vh", borderRadius: 0, x: 0, y: 0 }
                    : { width: "92vw", height: "88vh", borderRadius: 32, x: "4vw", y: 0 }
            }
            transition={{ duration: 1.05, ease: [0.77, 0, 0.175, 1] }}
            className="absolute bottom-0 left-0 bg-black"
            style={{ transformOrigin: "bottom center" }}
        />
    );
}

function SceneShell({ dark, curtain = false, children }) {
    return (
        <div className={`relative h-screen w-full overflow-hidden ${dark ? "bg-black text-white" : "bg-white text-black"}`}>
            {curtain ? <BottomCurtain active /> : null}
            <div className={`absolute inset-0 ${dark ? "bg-black" : "bg-white"}`} />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),transparent_40%)] opacity-40" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[linear-gradient(rgba(0,0,0,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.25)_1px,transparent_1px)] bg-size-[100%_100%,100%_100%]" />
            <div className="relative z-10 h-full w-full">{children}</div>
        </div>
    );
}

function SceneShell2({
    dark,
    curtain = false,
    children,
}) {
    return (
        <div
            className={`relative h-screen w-full overflow-hidden ${dark
                ? "bg-black text-white"
                : "bg-white text-black"
                }`}
        >
            {curtain ? <BottomCurtain active /> : null}

            {/* Base Background */}
            <div
                className={`absolute inset-0 z-0 ${dark ? "bg-black" : "bg-white"
                    }`}
            />

            {/* Ambient Radial */}
            <div className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),transparent_40%)] opacity-40" />

            {/* Film Grain / Texture */}
            <div className="pointer-events-none absolute inset-0 z-2 opacity-[0.08] mix-blend-overlay bg-[linear-gradient(rgba(0,0,0,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.25)_1px,transparent_1px)] bg-size-[100%_100%,100%_100%]" />

            {/* Scene Content */}
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </div>
    );
}

export default function CinematicScrollMovie() {
    const [scene, setScene] = useState(0);
    const [ready, setReady] = useState(false);
    const [introStep, setIntroStep] = useState(0);
    const [whoChars, setWhoChars] = useState(0);
    const [nameStage, setNameStage] = useState(0);
    const [carouselProgress, setCarouselProgress] = useState(0);
    const [buildingStage, setBuildingStage] = useState(0);
    const [treeStage, setTreeStage] = useState(0);
    const [treePulse, setTreePulse] = useState(0);
    const [codeStage, setCodeStage] = useState(0);
    const [codeSeed, setCodeSeed] = useState(0);
    const [aiStage, setAiStage] = useState(0);
    const [butStage, setButStage] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [glitchSeed, setGlitchSeed] = useState(0);
    const [vulnTick, setVulnTick] = useState(0);
    const [dangerStage, setDangerStage] = useState(0);
    const [philosophyStage, setPhilosophyStage] = useState(0);
    const [darkCurtainDone, setDarkCurtainDone] = useState(false);
    const [whoHold, setWhoHold] = useState(false);
    const [timelineReveal, setTimelineReveal] = useState(false);


    const [finalFreeze, setFinalFreeze] = useState(false);

    const [rewindIndex, setRewindIndex] = useState(0);
    const [showFinalQuestion, setShowFinalQuestion] = useState(false);

    const sceneRef = useRef(scene);
    const readyRef = useRef(ready);
    sceneRef.current = scene;
    readyRef.current = ready;


    const rowRefs = useRef({});
    const [rowWidths, setRowWidths] = useState({});

    useBodyLock(true);

    const carouselRef = useRef(0);

    useEffect(() => {
        carouselRef.current = carouselProgress;
    }, [carouselProgress]);

    useEffect(() => {
        const measure = () => {
            const widths = {};

            Object.entries(rowRefs.current).forEach(([key, el]) => {
                if (el) {
                    widths[key] = el.scrollWidth;
                }
            });

            setRowWidths(widths);
        };

        measure();

        window.addEventListener("resize", measure);

        return () => {
            window.removeEventListener("resize", measure);
        };
    }, [timelineReveal]);

    const isDarkScene = scene > DARK_START_SCENE || (scene === DARK_START_SCENE && darkCurtainDone);
    const isFirstDarkScene = scene === DARK_START_SCENE && !darkCurtainDone;

    const nextScene = () => {
        if (!readyRef.current) return;
        setReady(false);
        setScene((s) => Math.min(s + 1, TOTAL_SCENES - 1));
    };

    const prevScene = () => {
        if (!readyRef.current) return;
        setReady(false);
        setScene((s) => Math.max(s - 1, 0));
    };

    useEffect(() => {
        if (scene === 3 && carouselProgress >= 1) {
            setReady(true);
            nextScene();
        }
    }, [scene, carouselProgress]);

    useWheelDeck(
        () => {
            if (sceneRef.current === 3) {

                if (carouselRef.current < 1) {
                    setCarouselProgress((p) =>
                        clamp(p + 0.015, 0, 1)
                    );
                    return;
                }

                nextScene();
                return;
            }

            if (!readyRef.current) return;

            nextScene();
        },

        () => {
            if (sceneRef.current === 3) {

                if (carouselRef.current > 0) {
                    setCarouselProgress((p) =>
                        clamp(p - 0.015, 0, 1)
                    );
                    return;
                }

                prevScene();
                return;
            }

            if (!readyRef.current) return;

            prevScene();
        },
        true
    );

    useEffect(() => {
        setReady(false);
        setIntroStep(0);
        setWhoChars(0);
        setNameStage(0);
        setCarouselProgress(0);
        setBuildingStage(0);
        setTreeStage(0);
        setTreePulse(0);
        setCodeStage(0);
        setCodeSeed((v) => v + 1);
        setAiStage(0);
        setButStage(0);
        setQuestionIndex(0);
        setGlitchSeed((v) => v + 1);
        setVulnTick(0);
        setDangerStage(0);
        setPhilosophyStage(0);
        setDarkCurtainDone(false);
        setWhoHold(false);
        setTimelineReveal(false);

        const timers = [];
        const intervals = [];

        if (scene === 0) {
            timers.push(setTimeout(() => setIntroStep(1), 1800));
            timers.push(setTimeout(() => setIntroStep(2), 3800));
            timers.push(setTimeout(() => setReady(true), 5800));
        }

        if (scene === 1) {
            const text = "WHO AM I ?";
            let i = 0;
            const id = setInterval(() => {
                i += 1;
                setWhoChars(i);
                if (i >= text.length) {
                    clearInterval(id);
                    setWhoHold(true);
                    timers.push(setTimeout(() => setReady(true), 900));
                }
            }, 90);
            intervals.push(id);
        }

        if (scene === 2) {
            timers.push(setTimeout(() => setNameStage(1), 1800));
            timers.push(setTimeout(() => setNameStage(2), 3600));
            timers.push(setTimeout(() => setReady(true), 5200));
        }

        if (scene === 3) {
            setCarouselProgress(0);

            timers.push(
                setTimeout(() => {
                    setTimelineReveal(true);
                    setReady(true);
                }, 250)
            );
        }

        if (scene === 4) {
            timers.push(setTimeout(() => setBuildingStage(1), 3000));
            timers.push(setTimeout(() => setBuildingStage(2), 7000));
            timers.push(setTimeout(() => setReady(true), 9500));
        }

        if (scene === 5) {
            setQuestionIndex(0);

            intervals.push(
                setInterval(() => {
                    setQuestionIndex((i) =>
                        Math.min(i + 1, problemQuestions.length - 1)
                    );
                }, 2000)
            );

            timers.push(
                setTimeout(() => {
                    setReady(true);
                }, problemQuestions.length * 1300 + 1200)
            );
        }

        if (scene === 6) {
            timers.push(setTimeout(() => setTreeStage(1), 800));
            timers.push(setTimeout(() => setTreeStage(2), 2100));
            timers.push(setTimeout(() => setReady(true), 3900));
            intervals.push(setInterval(() => setTreePulse((v) => v + 1), 140));
        }

        if (scene === 7) {
            timers.push(setTimeout(() => setCodeStage(1), 600));
            timers.push(setTimeout(() => setCodeStage(2), 4200));
            timers.push(setTimeout(() => setReady(true), 7500));

            intervals.push(
                setInterval(() => setCodeSeed((v) => v + 1), 1000)
            );

            timers.push(
                setTimeout(() => setDarkCurtainDone(true), 950)
            );
        }

        if (scene === 8) {
            timers.push(setTimeout(() => setAiStage(1), 900));
            timers.push(setTimeout(() => setAiStage(2), 2100));
            timers.push(setTimeout(() => setAiStage(3), 3200));
            timers.push(setTimeout(() => setReady(true), 4300));
        }

        if (scene === 9) {
            setButStage(1);

            timers.push(
                setTimeout(() => setButStage(2), 2500)
            );

            intervals.push(
                setInterval(
                    () =>
                        setQuestionIndex(
                            (i) => (i + 1) % businessQuestions.length
                        ),
                    2800
                )
            );

            timers.push(
                setTimeout(
                    () => setReady(true),
                    2500 + businessQuestions.length * 2800
                )
            );
        }

        if (scene === 10) {
            intervals.push(
                setInterval(() => {
                    if (Math.random() > 0.55) {
                        setGlitchSeed((g) => g + 1);
                    }

                    if (Math.random() > 0.75) {
                        setVulnTick((v) => v + 1);
                    }
                }, 450)
            );
            timers.push(setTimeout(() => setReady(true), 3700));
        }

        if (scene === 11) {
            timers.push(setTimeout(() => setDangerStage(1), 900));
            timers.push(setTimeout(() => setDangerStage(2), 2800));
            timers.push(setTimeout(() => setReady(true), 4300));
        }

        if (scene === 12) {
            setPhilosophyStage(0);

            philosophy.forEach((_, index) => {
                timers.push(
                    setTimeout(() => {
                        setPhilosophyStage(index);
                    }, index * 2500)
                );
            });

            timers.push(
                setTimeout(() => {
                    setReady(true);
                }, philosophy.length * 2500)
            );
        }

        // if (scene === 13) {
        //     timers.push(setTimeout(() => setRewindTick(1), 800));
        //     timers.push(setTimeout(() => setRewindTick(2), 1800));
        //     timers.push(setTimeout(() => setReady(true), 2600));
        // }

        if (scene === 13) {
            setRewindIndex(-1);
            setShowFinalQuestion(false);
            setFinalFreeze(false);

            reversedRewind.forEach((_, i) => {
                const delay =
                    i < reversedRewind.length - 5
                        ? i * 900
                        : (reversedRewind.length - 5) * 900 +
                        (i - (reversedRewind.length - 5)) * 1500;

                timers.push(
                    setTimeout(() => {
                        setRewindIndex(i);
                    }, delay)
                );
            });

            const totalDuration =
                (reversedRewind.length - 5) * 900 +
                5 * 1500;

            timers.push(
                setTimeout(() => {
                    setShowFinalQuestion(true);
                }, totalDuration + 800)
            );

            timers.push(
                setTimeout(() => {
                    setFinalFreeze(true);
                }, totalDuration + 2500)
            );
        }

        return () => {
            timers.forEach(clearTimeout);
            intervals.forEach(clearInterval);
        };
    }, [scene]);

    const renderScene = () => {

        if (scene === 0) {
            const displayed = introLines[introStep] ?? introLines[0];
            return (
                <SceneShell dark={false}>
                    <div className="flex h-full w-full items-center justify-center px-6">
                        <div className="max-w-6xl text-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={displayed}
                                    initial={{ opacity: 0, y: 24, scale: 1 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -18, scale: 1.01 }}
                                    transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
                                    className="text-[clamp(2.6rem,6vw,3rem)] font-bold tracking-tight"
                                >
                                    <CurtainText>{displayed}</CurtainText>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </SceneShell>
            );
        }

        if (scene === 1) {
            const word = "WHO AM I ?".slice(0, whoChars);
            return (
                <SceneShell dark={false}>
                    <div className="flex h-full w-full items-center justify-center px-6">
                        <div className="max-w-6xl text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-[clamp(3rem,10vw,4rem)] font-bold tracking-normal"
                            >
                                <span className="inline-block overflow-hidden">
                                    {word}
                                    <span className="ml-2 inline-block h-[0.9em] w-0.75 translate-y-[0.1em] animate-pulse bg-black align-middle" />
                                </span>
                            </motion.div>
                        </div>
                    </div>
                </SceneShell>
            );
        }

        if (scene === 2) {
            return (
                <SceneShell dark={false}>
                    <div className="flex h-full w-full items-center justify-center px-6">
                        <div className="relative h-65 w-full max-w-6xl text-center">

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 1.05,
                                    y: 20,
                                    filter: "blur(12px)",
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0,
                                    filter: "blur(0px)",
                                }}
                                transition={{
                                    duration: 1.2,
                                    ease: [0.77, 0, 0.175, 1],
                                }}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[-80%]"
                            >
                                <div className="text-[clamp(2.8rem,8vw,4rem)] font-semibold tracking-tight whitespace-nowrap">
                                    <CurtainText>
                                        My name is{" "}
                                        <span className="font-bold">
                                            AKHIL
                                        </span>
                                    </CurtainText>
                                </div>
                            </motion.div>

                            {/* Subtitle */}
                            <AnimatePresence>
                                {nameStage >= 1 && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 30,
                                            filter: "blur(10px)",
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            filter: "blur(0px)",
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -10,
                                        }}
                                        transition={{
                                            duration: 0.9,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                        className="
                                    absolute
                                    left-1/2
                                    top-1/2
                                    mt-12
                                    -translate-x-1/2
                                    text-[clamp(1.5rem,3.4vw,2rem)]
                                    text-black/70
                                    whitespace-nowrap
                                "
                                    >
                                        <CurtainText delay={0.15}>
                                            But that doesn't tell you much.
                                        </CurtainText>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                    </div>
                </SceneShell>
            );
        }

        if (scene === 3) {
            return (
                <SceneShell dark={false}>
                    <motion.div
                        initial={{ scaleY: 1 }}
                        animate={{ scaleY: timelineReveal ? 0 : 1 }}
                        transition={{
                            duration: 1.2,
                            ease: [0.77, 0, 0.175, 1],
                        }}
                        className="absolute inset-0 z-30 origin-top bg-white"
                    />

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 1.03,
                            filter: "blur(16px)",
                        }}
                        animate={{
                            opacity: timelineReveal ? 1 : 0,
                            scale: timelineReveal ? 1 : 1.03,
                            filter: timelineReveal ? "blur(0px)" : "blur(16px)",
                        }}
                        transition={{
                            duration: 1.15,
                            ease: [0.77, 0, 0.175, 1],
                        }}
                        className="flex h-full w-full flex-col overflow-hidden"
                    >
                        {historyBands.map((band, index) => {
                            const depth = 1 - index * 0.12;

                            const eased =
                                1 - Math.pow(1 - carouselProgress, 3);

                            const rowText = Array.from(
                                { length: 12 }
                            )
                                .fill(`${band.year} • ${band.text}`)
                                .join("     ");

                            const rowWidth =
                                rowWidths[band.year] || 0;

                            const viewportWidth =
                                typeof window !== "undefined"
                                    ? window.innerWidth
                                    : 1200;

                            const travelDistance =
                                Math.max(
                                    0,
                                    rowWidth - viewportWidth
                                );

                            const travelVW =
                                (travelDistance /
                                    viewportWidth) *
                                100;

                            const startOffset =
                                band.dir === "left"
                                    ? 0
                                    : -travelVW;

                            const endOffset =
                                band.dir === "left"
                                    ? -travelVW
                                    : 0;

                            const x =
                                startOffset +
                                (endOffset - startOffset) *
                                eased *
                                depth;

                            return (
                                <motion.div
                                    key={band.year}
                                    initial={{
                                        opacity: 0,
                                        y: 100,
                                    }}
                                    animate={{
                                        opacity: timelineReveal
                                            ? 1
                                            : 0,
                                        y: timelineReveal
                                            ? 0
                                            : 100,
                                    }}
                                    transition={{
                                        duration: 1,
                                        delay:
                                            index * 0.18,
                                        ease: [
                                            0.77,
                                            0,
                                            0.175,
                                            1,
                                        ],
                                    }}
                                    className="relative flex-1 overflow-hidden border-b border-black/10"
                                >
                                    <motion.div
                                        animate={{
                                            x: `${x}vw`,
                                        }}
                                        transition={{
                                            duration: 0.08,
                                            ease: "linear",
                                        }}
                                        className="flex h-full items-center whitespace-nowrap px-4 md:px-10"
                                    >
                                        <div
                                            ref={(el) => {
                                                rowRefs.current[
                                                    band.year
                                                ] = el;
                                            }}
                                            className="text-[clamp(2rem,5vw,4.8rem)] font-black leading-none tracking-[-0.06em] md:text-[clamp(2.8rem,4.2vw,5.4rem)]"
                                        >
                                            <motion.span
                                                initial={{
                                                    opacity: 0,
                                                    x: -40,
                                                }}
                                                animate={{
                                                    opacity:
                                                        timelineReveal
                                                            ? 1
                                                            : 0,
                                                    x:
                                                        timelineReveal
                                                            ? 0
                                                            : -40,
                                                }}
                                                transition={{
                                                    duration: 0.8,
                                                    delay:
                                                        0.3 +
                                                        index *
                                                        0.15,
                                                }}
                                                className="mr-4 text-black/25"
                                            >
                                                {band.year}
                                            </motion.span>

                                            <motion.span
                                                initial={{
                                                    opacity: 0,
                                                    x: 40,
                                                }}
                                                animate={{
                                                    opacity:
                                                        timelineReveal
                                                            ? 1
                                                            : 0,
                                                    x:
                                                        timelineReveal
                                                            ? 0
                                                            : 40,
                                                }}
                                                transition={{
                                                    duration: 0.9,
                                                    delay:
                                                        0.45 +
                                                        index *
                                                        0.15,
                                                }}
                                            >
                                                {rowText}
                                            </motion.span>
                                        </div>
                                    </motion.div>

                                    <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-transparent to-white/50" />
                                </motion.div>
                            );
                        })}

                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06),transparent_45%)]" />

                        <motion.div className="pointer-events-none absolute inset-x-6 bottom-6 h-1 rounded-full bg-black/10">
                            <motion.div
                                className="h-full origin-left bg-black"
                                animate={{
                                    scaleX: carouselProgress,
                                }}
                                transition={{
                                    duration: 0.08,
                                    ease: "linear",
                                }}
                            />
                        </motion.div>
                    </motion.div>
                </SceneShell>
            );
        }

        if (scene === 4) {
            return (
                <SceneShell dark={false}>
                    <div className="flex h-full w-full items-center justify-center px-6 text-center">
                        <div className="max-w-5xl">
                            <AnimatePresence mode="wait">
                                {buildingStage === 0 ? (
                                    <motion.div
                                        key="build-0"
                                        initial={{
                                            opacity: 0,
                                            y: 40,
                                            filter: "blur(10px)",
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            filter: "blur(0px)",
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -30,
                                            filter: "blur(8px)",
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                        className="space-y-4"
                                    >
                                        <div className="text-[clamp(2.6rem,7vw,3rem)] font-semibold tracking-tight">
                                            <CurtainText>{buildingLines[0]}</CurtainText>
                                        </div>
                                        <div className="text-[clamp(1.5rem,3.4vw,2rem)] text-black/72">
                                            <CurtainText delay={0.35}>{buildingLines[1]}</CurtainText>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="build-1"
                                        initial={{ opacity: 0, y: 26 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -18 }}
                                        transition={{ duration: 0.75 }}
                                        className="space-y-4"
                                    >
                                        <div className="text-[clamp(2.4rem,6.5vw,3rem)] font-semibold tracking-tight">
                                            <CurtainText>{buildingLines[2]}</CurtainText>
                                        </div>
                                        <div className="text-[clamp(1.5rem,3.4vw,2rem)] text-black/72">
                                            <CurtainText delay={0.28}>{buildingLines[3]}</CurtainText>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </SceneShell>
            );
        }

        if (scene === 5) {
            return (
                <SceneShell dark={false}>
                    <div className="relative flex h-full w-full items-center justify-center px-6 text-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={questionIndex}
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                    filter: "blur(10px)",
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)",
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -30,
                                    filter: "blur(10px)",
                                }}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.77, 0, 0.175, 1],
                                }}
                                className="max-w-6xl"
                            >
                                <div className="text-[clamp(2.4rem,6vw,4rem)] font-semibold tracking-tight">
                                    {problemQuestions[questionIndex]}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </SceneShell>
            );
        }

        if (scene === 6) {
            const treeNodes = [
                { x: 18, y: 28, len: 22, rot: 18 },
                { x: 22, y: 36, len: 28, rot: -22 },
                { x: 30, y: 22, len: 34, rot: 10 },
                { x: 46, y: 24, len: 26, rot: 0 },
                { x: 52, y: 34, len: 20, rot: 14 },
                { x: 62, y: 28, len: 30, rot: -16 },
                { x: 70, y: 40, len: 24, rot: 20 },
                { x: 76, y: 52, len: 18, rot: -18 },
            ];

            return (
                <SceneShell dark={false}>
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.16]">
                            {treeNodes.map((n, i) => (
                                <motion.div
                                    key={`${i}-${treePulse}`}
                                    initial={{ scaleX: 0, opacity: 0 }}
                                    animate={{ scaleX: treeStage >= 1 ? 1 : 0, opacity: treeStage >= 1 ? 1 : 0 }}
                                    transition={{ duration: 0.8, delay: i * 0.04 }}
                                    className="absolute h-px bg-black"
                                    style={{
                                        left: `${n.x}%`,
                                        top: `${n.y}%`,
                                        width: `${n.len}%`,
                                        transform: `rotate(${n.rot}deg)`,
                                        transformOrigin: "left center",
                                    }}
                                />
                            ))}
                        </div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06),transparent_48%)]" />
                    </div>
                    <div className="relative flex h-full w-full items-center justify-center px-6">
                        <div className="max-w-5xl text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{
                                    opacity: treeStage >= 1 ? 1 : 0,
                                    y: treeStage >= 1 ? 0 : 18,
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="space-y-4"
                            >
                                <div className="text-[clamp(2rem,6vw,3rem)] font-semibold tracking-tight">
                                    Great software isn't written.
                                </div>

                                <div className="text-[clamp(1.7rem,4vw,2rem)] text-black/72">
                                    It's discovered.
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </SceneShell>
            );
        }

        if (scene === 7) {
            return (
                <SceneShell2
                    dark={codeStage >= 2}
                    curtain={isFirstDarkScene}
                >
                    {codeStage >= 2 && (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            className="absolute inset-0 z-1 h-full w-full object-cover scale-105"
                        >
                            <source
                                src="/scene6.mp4"
                                type="video/mp4"
                            />
                        </video>
                    )}

                    {codeStage < 2 && (
                        <div className="absolute inset-0 bg-white" />
                    )}

                    {codeStage >= 2 && (
                        <>
                            <div className="absolute inset-0 z-2 bg-black/45" />

                            <div className="absolute inset-0 z-2 bg-linear-to-b from-black/20 via-transparent to-black/80" />

                            <div className="absolute inset-0 z-2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_45%)]" />
                        </>
                    )}

                    {codeStage >= 2 && (
                        <div className="absolute inset-0 z-3">
                            <CodeRain active />
                        </div>
                    )}

                    <div className="relative z-10 flex h-full w-full items-center justify-center px-6 text-center">
                        <AnimatePresence mode="wait">

                            {codeStage < 2 ? (
                                <motion.div
                                    key="tools"
                                    initial={{
                                        opacity: 0,
                                        y: 40,
                                        filter: "blur(10px)",
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        filter: "blur(0px)",
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -40,
                                        filter: "blur(10px)",
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="max-w-5xl"
                                >
                                    <div className="text-[clamp(2.2rem,6vw,3rem)] font-semibold tracking-tight text-black">
                                        I specialize in tools.
                                    </div>

                                    <div className="mt-4 text-[clamp(1.4rem,3.4vw,2rem)] text-black/60">
                                        They work as I say.
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="glitch"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                    className="h-full w-full"
                                />
                            )}

                        </AnimatePresence>
                    </div>
                </SceneShell2>
            );
        }

        if (scene === 8) {
            return (
                <SceneShell dark>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_45%)]" />
                    <div className="relative flex h-full w-full items-center justify-center px-6 text-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={aiStage}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-5xl"
                            >
                                <div className="text-[clamp(2.3rem,6vw,3rem)] font-bold tracking-tight text-white">
                                    {aiClaims[aiStage]}
                                </div>
                                <div className="mt-5 text-[clamp(1.4rem,3.2vw,2rem)] text-white/70">
                                    {aiStage === 0 ? "" : aiStage === 1 ? "AI can write code." : aiStage === 2 ? "AI can refactor code." : "AI can deploy code."}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </SceneShell>
            );
        }

        if (scene === 9) {
            return (
                <SceneShell dark>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_45%)]" />

                    <div className="relative flex h-full w-full items-center justify-center px-6 text-center">
                        <AnimatePresence mode="wait">

                            {butStage < 2 ? (
                                <motion.div
                                    key="but"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{
                                        opacity: 0,
                                        scale: 1.15,
                                        filter: "blur(10px)",
                                    }}
                                    transition={{
                                        duration: 1.1,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="max-w-5xl"
                                >
                                    <div className="text-[clamp(3rem,8vw,5rem)] font-black tracking-tight text-white">
                                        BUT...
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={questionIndex}
                                    initial={{
                                        opacity: 0,
                                        y: 40,
                                        scale: 0.97,
                                        filter: "blur(10px)",
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        filter: "blur(0px)",
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -40,
                                        scale: 1.03,
                                        filter: "blur(10px)",
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="max-w-5xl"
                                >
                                    <div className="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight text-white">
                                        {businessQuestions[questionIndex]}
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </SceneShell>
            );
        }

        if (scene === 10) {
            return (
                <SceneShell2 dark>

                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="absolute inset-0 z-1 h-full w-full object-cover scale-105"
                    >
                        <source src="/scene9.mp4" type="video/mp4" />
                    </video>

                    <div className="absolute inset-0 z-2 bg-black/50" />

                    <div className="absolute inset-0 z-2 bg-linear-to-b from-black/30 via-black/10 to-black/80" />

                    <div className="absolute inset-0 z-2 bg-[radial-gradient(circle_at_center,transparent_0,rgba(0,0,0,0.82)_66%)]" />

                    <div className="absolute inset-0 z-3">
                        <GlitchField active seed={glitchSeed} />
                    </div>

                    <div className="relative z-4 flex h-full w-full items-center justify-center px-6 text-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={vulnTick}
                                initial={{
                                    opacity: 0,
                                    y: 40,
                                    filter: "blur(12px)",
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)",
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -40,
                                    filter: "blur(12px)",
                                }}
                                transition={{
                                    duration: 0.9,
                                    ease: [0.77, 0, 0.175, 1],
                                }}
                                className="max-w-6xl"
                            >
                                <div className="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight text-white">
                                    {vulnerabilities[vulnTick]}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </SceneShell2>
            );
        }

        if (scene === 11) {
            return (
                <SceneShell dark>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_46%)]" />
                    <div className="relative flex h-full w-full items-center justify-center px-6 text-center">
                        <AnimatePresence mode="wait">
                            {dangerStage < 1 ? (
                                <motion.div
                                    key="danger-a"
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="max-w-5xl"
                                >
                                    <div className="text-[clamp(2.6rem,6.5vw,3rem)] font-semibold tracking-tight text-white">The most dangerous bugs...</div>
                                    <div className="mt-4 text-[clamp(1.7rem,4vw,2rem)] text-white/72">are the ones nobody sees.</div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="danger-b"
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="max-w-5xl"
                                >
                                    <div className="text-[clamp(2.6rem,6.5vw,3rem)] font-semibold tracking-tight text-white">Intelligence generates code.</div>
                                    <div className="mt-4 text-[clamp(1.7rem,4vw,2rem)] text-white/72">Experience prevents disasters.</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </SceneShell>
            );
        }

        if (scene === 12) {
            return (
                <SceneShell dark>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_45%)]" />

                    <div className="relative flex h-full w-full items-center justify-center px-6 text-center">
                        <div className="max-w-6xl">

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={philosophyStage}
                                    initial={{
                                        opacity: 0,
                                        y: 50,
                                        scale: 0.98,
                                        filter: "blur(12px)",
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        filter: "blur(0px)",
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -50,
                                        scale: 1.02,
                                        filter: "blur(12px)",
                                    }}
                                    transition={{
                                        duration: 0.9,
                                        ease: [0.77, 0, 0.175, 1],
                                    }}
                                    className="
                                text-[clamp(2rem,5vw,4.5rem)]
                                font-semibold
                                tracking-tight
                                text-white
                            "
                                >
                                    {philosophy[philosophyStage]}
                                </motion.div>
                            </AnimatePresence>

                        </div>
                    </div>
                </SceneShell>
            );
        }

        if (scene === 13) {
            return (
                <SceneShell dark>
                    <motion.div
                        animate={{
                            opacity: showFinalQuestion ? 0.12 : 0.06,
                            scale: showFinalQuestion ? 1.15 : 1,
                        }}
                        transition={{ duration: 2 }}
                        className="
                    absolute inset-0
                    bg-[radial-gradient(circle_at_center,
                    rgba(255,255,255,0.12),
                    transparent_55%)]
                " />

                    <div className="relative flex h-full w-full items-center justify-center px-6 text-center overflow-hidden">

                        <AnimatePresence mode="wait">

                            {!showFinalQuestion && rewindIndex >= 0 && (
                                <motion.div
                                    key={rewindIndex}
                                    initial={{
                                        opacity: 0,
                                        y: 60,
                                        scale: 0.96,
                                        filter: "blur(18px)",
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        filter: "blur(0px)",
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -60,
                                        scale: 1.04,
                                        filter: "blur(20px)",
                                    }}
                                    transition={{
                                        duration: 1,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="
                                max-w-6xl
                                text-[clamp(2rem,5vw,4.5rem)]
                                font-semibold
                                tracking-tight
                                text-white
                            "
                                >
                                    {reversedRewind[rewindIndex]}
                                </motion.div>
                            )}

                            {showFinalQuestion && (
                                <motion.div
                                    key="who"
                                    initial={{
                                        opacity: 0,
                                        scale: 0.75,
                                        filter: "blur(30px)",
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        filter: "blur(0px)",
                                    }}
                                    transition={{
                                        duration: 2.2,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="space-y-8"
                                >
                                    <motion.div
                                        animate={
                                            finalFreeze
                                                ? {}
                                                : {
                                                    opacity: [0.8, 1, 0.85, 1],
                                                }
                                        }
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                        }}
                                        className="
                                    text-[clamp(3rem,9vw,8rem)]
                                    font-black
                                    tracking-[0.22em]
                                    text-white
                                "
                                    >
                                        WHO AM I ?
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: finalFreeze ? 1 : 0,
                                        }}
                                        transition={{
                                            duration: 2,
                                        }}
                                        className="
                                    uppercase
                                    tracking-[0.5em]
                                    text-white/25
                                    text-sm
                                "
                                    >
                                        Scroll back up to find out.
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </SceneShell>
            );
        }

        return null;
    };

    return (
        <div className={`fixed inset-0 overflow-hidden antialiased ${isDarkScene ? "bg-black text-white" : "bg-white text-black"}`}>
            <style>{`
        * { box-sizing: border-box; }
        html, body, #__next { width: 100%; height: 100%; }
        body { overscroll-behavior: none; }
        ::selection { background: rgba(0,0,0,.15); }
        .glitch-layer { position: absolute; inset: 0; pointer-events: none; }
        .glitch-layer-a {
          transform: translate(2px, 0);
          opacity: .55;
          color: currentColor;
          clip-path: inset(0 0 58% 0);
          animation: glitchA 1.2s infinite linear alternate-reverse;
        }
        .glitch-layer-b {
          transform: translate(-2px, 0);
          opacity: .38;
          color: currentColor;
          clip-path: inset(40% 0 0 0);
          animation: glitchB 1.08s infinite linear alternate-reverse;
        }
        @keyframes glitchA {
          0%{transform:translate(2px,0)} 20%{transform:translate(-3px,-1px)} 40%{transform:translate(5px,1px)} 60%{transform:translate(-2px,0)} 80%{transform:translate(3px,-2px)} 100%{transform:translate(1px,0)}
        }
        @keyframes glitchB {
          0%{transform:translate(-2px,0)} 20%{transform:translate(4px,1px)} 40%{transform:translate(-5px,-2px)} 60%{transform:translate(2px,1px)} 80%{transform:translate(-3px,0)} 100%{transform:translate(0px,0)}
        }
      `}</style>

            <div className="absolute inset-0 overflow-hidden">
                <AnimatePresence mode="wait">{renderScene()}</AnimatePresence>
            </div>

            <motion.div
                initial={false}
                animate={{ opacity: scene === 3 ? 1 : 0 }}
                transition={{ duration: 0.35 }}
                className="pointer-events-none absolute left-0 top-0 h-px w-full bg-current/15"
            />
            <motion.div
                initial={false}
                animate={{ opacity: scene === 3 ? 1 : 0 }}
                transition={{ duration: 0.35 }}
                className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-current/15"
            />

            <motion.div
                initial={false}
                animate={{ opacity: ready ? 0.5 : 0.95 }}
                transition={{ duration: 0.4 }}
                className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-current/10 bg-current/5 px-4 py-2 text-[10px] uppercase tracking-[0.5em] text-current/35 backdrop-blur-sm"
            >
                {ready ? (scene === 3 ? "Drive the timeline" : "Scroll") : "Hold"}
            </motion.div>
        </div>
    );
}