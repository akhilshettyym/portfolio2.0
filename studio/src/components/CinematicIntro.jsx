"use client";

import "@/styles/cinematic_intro.css";
import { AnimatePresence, motion } from "framer-motion";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  clamp,
  useBodyLock,
  useWheelDeck,
  CurtainText,
  CodeRain,
  GlitchField,
  SceneShell,
  SceneShell2,
} from "@/utils/funct";
import {
  INTROLINES,
  BUILDINGLINES,
  PROBLEMQUESTIONS,
  AICLAIMS,
  BUSINESSQUESTIONS,
  VULNERABILITIES,
  PHILOSOPHY,
  REWINDLINES,
  HISTORYBANDS,
  TOTAL_SCENES,
  DARK_START_SCENE,
} from "@/utils/basic";

export default function CinematicIntro({ onComplete }) {
  const [scene, setScene] = useState(0);
  const [aiStage, setAiStage] = useState(0);
  const [butStage, setButStage] = useState(0);
  const [vulnTick, setVulnTick] = useState(0);
  const [whoChars, setWhoChars] = useState(0);
  const [nameStage, setNameStage] = useState(0);
  const [introStep, setIntroStep] = useState(0);
  const [codeStage, setCodeStage] = useState(0);
  const [treeStage, setTreeStage] = useState(0);
  const [treePulse, setTreePulse] = useState(0);
  const [finalStage, setFinalStage] = useState(0);
  const [glitchSeed, setGlitchSeed] = useState(0);
  const [rewindIndex, setRewindIndex] = useState(0);
  const [dangerStage, setDangerStage] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [buildingStage, setBuildingStage] = useState(0);
  const [philosophyStage, setPhilosophyStage] = useState(0);
  const [carouselProgress, setCarouselProgress] = useState(0);

  const [ready, setReady] = useState(false);
  const [rowWidths, setRowWidths] = useState({});
  const [timelineReveal, setTimelineReveal] = useState(false);
  const [darkCurtainDone, setDarkCurtainDone] = useState(false);

  const completedRef = useRef(false);

  const rowRefs = useRef({});
  const carouselRef = useRef(0);
  const sceneRef = useRef(scene);
  const readyRef = useRef(ready);

  const reversedRewind = useMemo(() => [...REWINDLINES].reverse(), []);
  const { isTier2 } = usePerformanceTier();

  const PEEL_EASE = [0.19, 1, 0.22, 1];
  const PEEL_DURATION = 1.6;
  const [revealPhase, setRevealPhase] = useState("covering");

  useEffect(() => {
    const peelTimer = setTimeout(() => {
      setRevealPhase("peel");
    }, 50);

    const doneTimer = setTimeout(
      () => {
        setRevealPhase("done");
      },
      50 + PEEL_DURATION * 1000,
    );

    const startCinematicTimer = setTimeout(
      () => {
        setScene(0);
      },
      50 + PEEL_DURATION * 1000 + 3000,
    );

    return () => {
      clearTimeout(peelTimer);
      clearTimeout(doneTimer);
      clearTimeout(startCinematicTimer);
    };
  }, []);

  const floatingBusinessTexts = useMemo(() => {
    const source = [
      ...BUSINESSQUESTIONS,
      "conversion risk",
      "signal loss",
      "execution gap",
      "latency cost",
      "market drift",
      "trust layer",
    ];

    return Array.from({ length: isTier2 ? 14 : 30 }, (_, index) => ({
      id: `${source[index % source.length]}-${index}`,
      text: source[index % source.length],
      left: 6 + ((index * 37) % 88),
      top: 8 + ((index * 53) % 82),
      delay: (index % 8) * 0.18,
      duration: 5 + (index % 6),
      scale: 0.72 + (index % 5) * 0.08,
      opacity: 0.08 + (index % 4) * 0.035,
    }));
  }, [isTier2]);

  useEffect(() => {
    sceneRef.current = scene;
  }, [scene]);

  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  const resetSceneState = () => {
    setReady(false);

    setIntroStep(0);
    setWhoChars(0);
    setNameStage(0);

    setCarouselProgress(0);

    setBuildingStage(0);

    setTreeStage(0);
    setTreePulse(0);

    setCodeStage(0);

    setAiStage(0);

    setButStage(0);
    setQuestionIndex(0);

    setGlitchSeed((v) => v + 1);

    setVulnTick(0);

    setDangerStage(0);

    setPhilosophyStage(0);

    setDarkCurtainDone(false);

    setTimelineReveal(false);

    setFinalStage(0);
    setRewindIndex(0);
  };

  useBodyLock(!(scene === 13 && finalStage >= 2));

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
    resetSceneState();
    setScene((s) => Math.min(s + 1, TOTAL_SCENES - 1));
  };

  const prevScene = () => {
    if (!readyRef.current) return;
    resetSceneState();
    setScene((s) => Math.max(s - 1, 0));
  };

  useEffect(() => {
    if (scene !== 3 || carouselProgress < 1) return;

    const id = setTimeout(() => {
      resetSceneState();
      setScene((s) => Math.min(s + 1, TOTAL_SCENES - 1));
    }, 0);

    return () => clearTimeout(id);
  }, [scene, carouselProgress]);

  useWheelDeck(
    () => {
      if (sceneRef.current === 3) {
        if (carouselRef.current < 1) {
          setCarouselProgress((p) => clamp(p + 0.045, 0, 1));
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
          setCarouselProgress((p) => clamp(p - 0.045, 0, 1));
          return;
        }
        prevScene();
        return;
      }

      if (!readyRef.current) return;
      prevScene();
    },
    true,
  );

  useEffect(() => {
    const timers = [];
    const intervals = [];

    if (scene === 0) {
      timers.push(setTimeout(() => setIntroStep(1), 2800));
      timers.push(setTimeout(() => setIntroStep(2), 5600));
      timers.push(setTimeout(() => setReady(true), 8400));
    }

    if (scene === 1) {
      const text = "WHO AM I ?";
      let i = 0;
      const id = setInterval(() => {
        i += 1;
        setWhoChars(i);
        if (i >= text.length) {
          clearInterval(id);
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
      timers.push(
        setTimeout(() => {
          setTimelineReveal(true);
          setReady(true);
        }, 250),
      );
    }

    if (scene === 4) {
      timers.push(setTimeout(() => setBuildingStage(1), 3000));
      timers.push(setTimeout(() => setBuildingStage(2), 7000));
      timers.push(setTimeout(() => setReady(true), 9500));
    }

    if (scene === 5) {
      intervals.push(
        setInterval(() => {
          setQuestionIndex((i) => Math.min(i + 1, PROBLEMQUESTIONS.length - 1));
        }, 2000),
      );

      timers.push(
        setTimeout(
          () => {
            setReady(true);
          },
          PROBLEMQUESTIONS.length * 1300 + 1200,
        ),
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
      timers.push(setTimeout(() => setDarkCurtainDone(true), 950));
    }

    if (scene === 8) {
      timers.push(setTimeout(() => setAiStage(1), 1800));
      timers.push(setTimeout(() => setAiStage(2), 4200));
      timers.push(setTimeout(() => setAiStage(3), 6600));
      timers.push(setTimeout(() => setReady(true), 9000));
    }

    if (scene === 9) {
      timers.push(
        setTimeout(() => {
          setButStage(1);
        }, 0),
      );

      timers.push(
        setTimeout(() => {
          setButStage(2);
        }, 2500),
      );

      const id = setInterval(() => {
        setQuestionIndex((i) => {
          if (i >= BUSINESSQUESTIONS.length - 1) {
            clearInterval(id);
            return i;
          }

          return i + 1;
        });
      }, 3200);

      intervals.push(id);

      timers.push(setTimeout(() => setReady(true), 2500 + BUSINESSQUESTIONS.length * 3200));
    }

    if (scene === 10) {
      const id = setInterval(() => {
        setVulnTick((v) => {
          if (v >= VULNERABILITIES.length - 1) {
            clearInterval(id);
            return v;
          }

          return v + 1;
        });
      }, 1800);

      intervals.push(id);

      timers.push(
        setTimeout(
          () => {
            setReady(true);
          },
          VULNERABILITIES.length * 1800 + 1500,
        ),
      );
    }

    if (scene === 11) {
      timers.push(setTimeout(() => setDangerStage(1), 1800));
      timers.push(setTimeout(() => setDangerStage(2), 2800));
      timers.push(setTimeout(() => setReady(true), 4300));
    }

    if (scene === 12) {
      PHILOSOPHY.forEach((_, index) => {
        timers.push(
          setTimeout(() => {
            setPhilosophyStage(index);
          }, index * 2500),
        );
      });

      timers.push(
        setTimeout(() => {
          setReady(true);
        }, PHILOSOPHY.length * 2500),
      );
    }

    if (scene === 13) {
      const step = 110;

      reversedRewind.forEach((_, i) => {
        timers.push(
          setTimeout(() => {
            setRewindIndex(i);
          }, i * step),
        );
      });

      const rewindEnd = reversedRewind.length * step;

      timers.push(
        setTimeout(() => {
          setFinalStage(1);
        }, rewindEnd + 150),
      );

      timers.push(
        setTimeout(() => {
          setFinalStage(2);
        }, rewindEnd + 2150),
      );
    }

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [scene, reversedRewind]);

  const renderScene = () => {
    if (scene === 0) {
      const displayed = INTROLINES[introStep] ?? INTROLINES[0];

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
                  className="text-[clamp(2.6rem,6vw,3rem)] font-bold tracking-tight">
                  <CurtainText> {displayed} </CurtainText>
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
                className="text-[clamp(3rem,10vw,4rem)] font-bold tracking-normal">
                <span className="inline-block overflow-hidden">
                  {" "}
                  {word}
                  <span className="ml-3 inline-block h-[1.0em] w-0.75 translate-y-[0.1em] animate-pulse bg-black" />
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
                initial={{ opacity: 0, scale: 1.05, y: 20, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[-80%]">
                <div className="text-[clamp(2.8rem,8vw,3rem)] font-semibold tracking-tight whitespace-nowrap">
                  <CurtainText>
                    {" "}
                    My name is <span className="font-bold"> AKHIL </span>{" "}
                  </CurtainText>
                </div>
              </motion.div>

              <AnimatePresence>
                {nameStage >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-1/2 top-1/2 mt-8 -translate-x-1/2 text-[clamp(1.5rem,3.4vw,2rem)] text-black/70 whitespace-nowrap">
                    <CurtainText delay={0.15}>But that doesn&apos;t tell you much.</CurtainText>
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
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            className="absolute inset-0 z-30 origin-top bg-white"
          />

          <motion.div
            initial={{ opacity: 0, scale: 1.03, filter: "blur(16px)" }}
            animate={{
              opacity: timelineReveal ? 1 : 0,
              scale: timelineReveal ? 1 : 1.03,
              filter: timelineReveal ? "blur(0px)" : "blur(16px)",
            }}
            transition={{ duration: 1.15, ease: [0.77, 0, 0.175, 1] }}
            className="flex h-full w-full flex-col overflow-hidden">
            {HISTORYBANDS.map((band, index) => {
              const depth = 1 - index * 0.12;
              const eased = 1 - Math.pow(1 - carouselProgress, 3);

              const rowText = Array.from({ length: 12 }).fill(`${band.year} • ${band.text}`).join("     ");

              const rowWidth = rowWidths[band.year] || 0;

              const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1200;

              const travelDistance = Math.max(0, rowWidth - viewportWidth);
              const travelVW = (travelDistance / viewportWidth) * 100;
              const startOffset = band.dir === "left" ? 0 : -travelVW;
              const endOffset = band.dir === "left" ? -travelVW : 0;
              const x = startOffset + (endOffset - startOffset) * eased * depth;

              return (
                <motion.div
                  key={band.year}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{
                    opacity: timelineReveal ? 1 : 0,
                    y: timelineReveal ? 0 : 100,
                  }}
                  transition={{
                    duration: 1,
                    delay: index * 0.18,
                    ease: [0.77, 0, 0.175, 1],
                  }}
                  className="relative flex-1 overflow-hidden border-b border-black/10">
                  <motion.div
                    animate={{ x: `${x}vw` }}
                    transition={{ duration: 0.08, ease: "linear" }}
                    className="flex h-full items-center whitespace-nowrap px-4 md:px-10">
                    <div
                      ref={(el) => {
                        rowRefs.current[band.year] = el;
                      }}
                      className="text-[clamp(2rem,5vw,4.8rem)] font-black leading-none tracking-[-0.06em] md:text-[clamp(2.8rem,4.2vw,5.4rem)]">
                      <motion.span
                        initial={{ opacity: 0, x: -40 }}
                        animate={{
                          vopacity: timelineReveal ? 1 : 0,
                          vx: timelineReveal ? 0 : -40,
                        }}
                        transition={{ duration: 0.8, delay: 0.3 + index * 0.15 }}
                        className="mr-4 text-black/25">
                        {band.year}
                      </motion.span>

                      <motion.span
                        initial={{ opacity: 0, x: 40 }}
                        animate={{
                          opacity: timelineReveal ? 1 : 0,
                          x: timelineReveal ? 0 : 40,
                        }}
                        transition={{ duration: 0.9, delay: 0.45 + index * 0.15 }}>
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
                animate={{ scaleX: carouselProgress }}
                transition={{ duration: 0.08, ease: "linear" }}
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
                    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-4">
                    <div className="text-[clamp(2.6rem,7vw,3rem)] font-semibold tracking-tight">
                      <CurtainText>{BUILDINGLINES[0]}</CurtainText>
                    </div>

                    <div className="text-[clamp(1.5rem,3.4vw,2rem)] text-black/72">
                      <CurtainText delay={0.35}>{BUILDINGLINES[1]}</CurtainText>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="build-1"
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.75 }}
                    className="space-y-4">
                    <div className="text-[clamp(2.4rem,6.5vw,3rem)] font-semibold tracking-tight">
                      <CurtainText>{BUILDINGLINES[2]}</CurtainText>
                    </div>

                    <div className="text-[clamp(1.5rem,3.4vw,2rem)] text-black/72">
                      <CurtainText delay={0.28}>{BUILDINGLINES[3]}</CurtainText>
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
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                transition={{
                  duration: questionIndex === PROBLEMQUESTIONS.length - 1 ? 1.2 : 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: questionIndex === PROBLEMQUESTIONS.length - 1 ? 1.08 : 1,
                  filter: "blur(0px)",
                }}
                className={`text-[clamp(2.4rem,6vw,4rem)] font-semibold tracking-tight ${questionIndex === PROBLEMQUESTIONS.length - 1 ? "text-black" : "text-black/85"}`}>
                <div className="text-[clamp(2.4rem,6vw,3rem)] font-semibold tracking-tight">
                  {PROBLEMQUESTIONS[questionIndex]}
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
                  animate={{
                    scaleX: treeStage >= 1 ? 1 : 0,
                    opacity: treeStage >= 1 ? 1 : 0,
                  }}
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
                animate={{ opacity: treeStage >= 1 ? 1 : 0, y: treeStage >= 1 ? 0 : 18 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4">
                <div className="text-[clamp(2rem,6vw,3rem)] font-semibold tracking-tight">
                  Great software isn&apos;t written.
                </div>

                <div className="text-[clamp(1.7rem,4vw,2rem)] text-black/72">It&apos;s discovered.</div>
              </motion.div>
            </div>
          </div>
        </SceneShell>
      );
    }

    if (scene === 7) {
      return (
        <SceneShell2 dark={codeStage >= 2} curtain={isFirstDarkScene}>
          {codeStage >= 2 && (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 z-1 h-full w-full object-cover scale-105">
              <source src="/cinematic_intro/scene6.mp4" type="video/mp4" />
            </video>
          )}

          {codeStage < 2 && <div className="absolute inset-0 bg-white" />}

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
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-5xl">
                  <div className="text-[clamp(2.2rem,6vw,3rem)] font-semibold tracking-tight text-black">
                    {" "}
                    I specialize in tools.{" "}
                  </div>

                  <div className="mt-4 text-[clamp(1.4rem,3.4vw,2rem)] text-black/60"> They work as I say. </div>
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
                className="max-w-5xl">
                <div className="text-[clamp(2.3rem,6vw,3rem)] font-bold tracking-tight text-white">
                  {AICLAIMS[aiStage]}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </SceneShell>
      );
    }

    if (scene === 9) {
      return (
        <SceneShell2 dark>
          {!isTier2 && (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 z-1 h-full w-full object-cover scale-105">
              <source src="/cinematic_intro/scene9-2.mp4" type="video/mp4" />
            </video>
          )}

          <div className="absolute inset-0 z-2 bg-black/55" />
          <div className="absolute inset-0 z-2 bg-linear-to-b from-black/35 via-black/10 to-black/80" />
          <div className="absolute inset-0 z-2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_45%)]" />

          <div className="absolute inset-0 z-3 overflow-hidden">
            {floatingBusinessTexts.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16, rotate: -2 }}
                animate={{
                  opacity: item.opacity,
                  y: isTier2 ? 0 : [0, -18, 10, 0],
                  rotate: isTier2 ? 0 : [-2, 2, -1],
                }}
                transition={{
                  duration: isTier2 ? 0.4 : item.duration,
                  delay: item.delay,
                  repeat: isTier2 ? 0 : Infinity,
                  ease: "easeInOut",
                }}
                className="absolute max-w-[18rem] text-left text-[10px] uppercase leading-4 tracking-[0.22em] text-white/70"
                style={{
                  left: `${item.left}%`,
                  top: `${item.top}%`,
                  transform: `scale(${item.scale})`,
                }}>
                {item.text}
              </motion.div>
            ))}
          </div>

          <div className="relative z-4 flex h-full w-full items-center justify-center px-6 text-center">
            <AnimatePresence mode="wait">
              {butStage < 2 ? (
                <motion.div
                  key="but"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-5xl">
                  <div className="text-[clamp(3rem,8vw,4rem)] font-bold tracking-tight text-white"> BUT... </div>
                </motion.div>
              ) : (
                <motion.div
                  key={questionIndex}
                  initial={{ opacity: 0, y: 40, scale: 0.97, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -40, scale: 1.03, filter: "blur(10px)" }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-5xl">
                  <div className="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight text-white">
                    {BUSINESSQUESTIONS[questionIndex]}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SceneShell2>
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
            className="absolute inset-0 z-1 h-full w-full object-cover scale-105">
            <source src="/cinematic_intro/scene9.mp4" type="video/mp4" />
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
                initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -40, filter: "blur(12px)" }}
                transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
                className="max-w-6xl">
                <div className="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight text-white">
                  {VULNERABILITIES[vulnTick]}
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
                  className="max-w-5xl">
                  <div className="text-[clamp(2.6rem,6.5vw,3rem)] font-semibold tracking-tight text-white">
                    {" "}
                    The most dangerous bugs...{" "}
                  </div>
                  <div className="mt-4 text-[clamp(1.7rem,4vw,2rem)] text-white/72"> are the ones nobody sees. </div>
                </motion.div>
              ) : (
                <motion.div
                  key="danger-b"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-5xl">
                  <div className="text-[clamp(2.6rem,6.5vw,3rem)] font-semibold tracking-tight text-white">
                    {" "}
                    Intelligence generates code.{" "}
                  </div>
                  <div className="mt-4 text-[clamp(1.7rem,4vw,2rem)] text-white/72">
                    {" "}
                    Experience prevents disasters.{" "}
                  </div>
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
                  initial={{ opacity: 0, y: 50, scale: 0.98, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -50, scale: 1.02, filter: "blur(12px)" }}
                  transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
                  className="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight text-white">
                  {PHILOSOPHY[philosophyStage]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </SceneShell>
      );
    }

    if (scene === 13) {
      return (
        <SceneShell dark={finalStage === 0}>
          <motion.div
            initial={false}
            animate={{
              opacity: finalStage === 0 ? 1 : 0,
              scale: finalStage === 0 ? 1 : 1.02,
            }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 bg-black"
          />

          {finalStage >= 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 bg-white"
            />
          )}

          {finalStage === 0 && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_42%)]" />
          )}

          <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-6 text-center">
            <AnimatePresence mode="wait">
              {finalStage === 0 ? (
                <motion.div
                  key={rewindIndex}
                  initial={{ opacity: 0, y: 28, scale: 0.98, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -28, scale: 1.02, filter: "blur(10px)" }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-6xl text-[clamp(1.9rem,4.8vw,4.4rem)] font-semibold tracking-tight text-white">
                  {reversedRewind[rewindIndex]}
                </motion.div>
              ) : finalStage >= 1 ? (
                <motion.div
                  key="who"
                  initial={{ opacity: 0, scale: 0.78, filter: "blur(24px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-10">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="text-[clamp(3rem,9vw,4rem)] font-bold tracking-normal text-black">
                    WHO AM I ?
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </SceneShell>
      );
    }
    return null;
  };

  const handleSkipToLastScene = () => {
    resetSceneState();

    setTimeout(() => {
      setScene(13);
    }, 80);
  };

  useEffect(() => {
    if (scene !== 13) return;
    if (finalStage !== 2) return;
    if (completedRef.current) return;

    completedRef.current = true;

    const timeout = setTimeout(() => {
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timeout);
  }, [scene, finalStage, onComplete]);

  return (
    <div
      className={`fixed inset-0 overflow-hidden antialiased ${isDarkScene ? "bg-black text-white" : "bg-white text-black"}`}>
      {revealPhase !== "done" && (
        <div className="fixed inset-0 z-9999 pointer-events-none">
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2 bg-black z-50"
            initial={{
              y: "0%",
              borderBottomLeftRadius: "0%",
              borderBottomRightRadius: "0%",
            }}
            animate={{
              y: revealPhase === "peel" ? "-100%" : "0%",
              borderBottomLeftRadius: revealPhase === "peel" ? "50% 50%" : "0% 0%",
              borderBottomRightRadius: revealPhase === "peel" ? "50% 50%" : "0% 0%",
            }}
            transition={{
              y: { duration: PEEL_DURATION, ease: PEEL_EASE },
              borderBottomLeftRadius: { duration: PEEL_DURATION * 0.8, ease: PEEL_EASE },
              borderBottomRightRadius: { duration: PEEL_DURATION * 0.8, ease: PEEL_EASE },
            }}
          />

          <motion.div
            className="absolute bottom-0 left-0 w-full h-1/2 bg-black z-50"
            initial={{ y: "0%", borderTopLeftRadius: "0%", borderTopRightRadius: "0%" }}
            animate={{
              y: revealPhase === "peel" ? "100%" : "0%",
              borderTopLeftRadius: revealPhase === "peel" ? "50% 50%" : "0% 0%",
              borderTopRightRadius: revealPhase === "peel" ? "50% 50%" : "0% 0%",
            }}
            transition={{
              y: { duration: PEEL_DURATION, ease: PEEL_EASE },
              borderTopLeftRadius: { duration: PEEL_DURATION * 0.8, ease: PEEL_EASE },
              borderTopRightRadius: { duration: PEEL_DURATION * 0.8, ease: PEEL_EASE },
            }}
          />
        </div>
      )}

      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">{scene >= 0 && renderScene()}</AnimatePresence>
      </div>

      {scene >= 0 && scene !== 13 && (
        <button
          onClick={handleSkipToLastScene}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full border border-current/30 bg-white/90 px-5 py-2.5 text-xs uppercase tracking-normal text-black backdrop-blur-md transition-all hover:bg-white hover:border-white/60 active:scale-95 dark:bg-black/90 dark:text-white dark:hover:bg-black">
          <span> Skip Intro </span>
        </button>
      )}

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

      {scene >= 0 && (
        <motion.div
          initial={false}
          animate={{ opacity: ready ? 0.5 : 0.95 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 font-bold text-[10px] uppercase tracking-normal text-current backdrop-blur-sm">
          {ready ? (scene === 3 ? "Drive the timeline" : "Scroll") : "Hold"}
        </motion.div>
      )}
    </div>
  );
}
