"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDeviceType } from "@/hooks/useDeviceType";
import { FaArrowUpRightFromSquare, FaXmark } from "react-icons/fa6";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { PROJECTS, CARD_WIDTH, CARD_HEIGHT, CTA_WIDTH, CTA_HEIGHT, EDGE_PADDING } from "@/utils/basic";

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function getCardPosition() {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  return {
    x: (window.innerWidth - CARD_WIDTH) / 2,
    y: (window.innerHeight - CARD_HEIGHT) / 2,
  };
}

function getButtonPosition(clientX, clientY) {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cursorOffsetX = 16;
  const cursorOffsetY = 16;
  let x = clientX - CTA_WIDTH / 2 + cursorOffsetX;
  let y = clientY - CTA_HEIGHT / 2 + cursorOffsetY;
  x = clamp(x, EDGE_PADDING, vw - CTA_WIDTH - EDGE_PADDING);
  y = clamp(y, EDGE_PADDING, vh - CTA_HEIGHT - EDGE_PADDING);

  return { x, y };
}

function getFallbackPointerPoint() {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}

export default function SelectedWorks() {
  const { isMobile } = useDeviceType();

  const [activeProject, setActiveProject] = useState(null);
  const [mobileModalProject, setMobileModalProject] = useState(null);

  const [cardAnchor, setCardAnchor] = useState({ x: 0, y: 0 });
  const [buttonAnchor, setButtonAnchor] = useState({ x: 0, y: 0 });
  const clearTimerRef = useRef(null);

  const cancelClear = () => {
    if (clearTimerRef.current) {
      window.clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
  };

  const scheduleClear = () => {
    cancelClear();
    clearTimerRef.current = window.setTimeout(() => {
      setActiveProject(null);
    }, 180);
  };

  const handleEnter = (index, event) => {
    if (isMobile) return;
    cancelClear();

    const hasPointerCoords = typeof event?.clientX === "number" && typeof event?.clientY === "number";
    const point = hasPointerCoords ? { x: event.clientX, y: event.clientY } : getFallbackPointerPoint();

    setActiveProject(index);
    setCardAnchor(getCardPosition());
    setButtonAnchor(getButtonPosition(point.x, point.y));
  };

  const handleMove = (event) => {
    if (isMobile || typeof event?.clientX !== "number" || typeof event?.clientY !== "number") return;
    setButtonAnchor(getButtonPosition(event.clientX, event.clientY));
  };

  const handleLeave = () => {
    if (isMobile) return;
    scheduleClear();
  };

  const handleRowClick = (project) => {
    if (isMobile) {
      setMobileModalProject(project);
    }
  };

  useEffect(() => {
    if (mobileModalProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileModalProject]);

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white text-black">
      <div className="mx-auto max-w-[1600px] px-10 py-10">
        <div className="mb-5">
          <div className="relative px-10 py-2 text-xs tracking-widest">
            <div className="pointer-events-auto absolute left-2 top-1/2 -translate-y-1/2">©001</div>
          </div>

          <div className="overflow-hidden">
            <h1 className="inline-block origin-left text-[clamp(2.5em,5vw,4rem)] md:text-[clamp(4.5rem,9vw,5rem)] font-black leading-[0.7] tracking-[-0.09em] text-black will-change-transform" style={{ fontFeatureSettings: '"ss01" on, "ss02" on', transform: "scaleX(1.5)" }}>
              SELECTED /
            </h1>
          </div>

          <div className="-mt-3 overflow-hidden">
            <h1 className="flex w-full items-baseline justify-between whitespace-nowrap text-[clamp(3rem,5vw,3rem)] md:text-[clamp(4rem,5vw,2rem)] font-black leading-[0.82] tracking-[-0.09em] text-black/90 will-change-transform" style={{ fontFeatureSettings: '"ss01" on, "ss02" on' }}>
              <span>. WORKS</span>
              <span className="ml-auto mr-5 text-sm tracking-normal"> 24-26 </span>
            </h1>
          </div>
        </div>

        <div className="relative">
          {PROJECTS.map((project, index) => {
            const isActive = activeProject === index;

            return (
              <motion.div key={project.id} role="button" tabIndex={0}
                onPointerEnter={(e) => handleEnter(index, e)}
                onPointerMove={handleMove}
                onPointerLeave={handleLeave}
                onClick={() => handleRowClick(project)}
                onFocus={(e) => handleEnter(index, e)}
                onBlur={handleLeave}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    isMobile ? handleRowClick(project) : handleEnter(index, e);
                  }
                }}
                animate={{ backgroundColor: isActive ? "#000000" : "#ffffff", color: isActive ? "#ffffff" : "#000000" }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="group relative cursor-pointer border-t border-black outline-none select-none">

                <div className={`grid grid-cols-12 gap-6 ${isMobile ? "py-5" : "px-10 py-5"}`}>
                  <div className="col-span-12 md:col-span-5">
                    <h3 className="text-2xl font-medium md:text-4xl"> {project.title} </h3>
                    <p className="mt-2 text-sm opacity-70"> {project.tagline} </p>
                  </div>
                  <div className="hidden md:block md:col-span-3" />
                  <div className="col-span-6 md:col-span-2">
                    <p className="mb-2 text-xs uppercase opacity-60"> When </p>
                    <p className="text-lg"> {project.when} </p>
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <p className="mb-2 text-xs uppercase opacity-60"> Category </p>
                    <p className="text-lg"> {project.type} </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div className="border-t border-black" />
        </div>
      </div>

      <AnimatePresence mode="sync" initial={false}>
        {!isMobile && activeProject !== null && (
          <FloatingProjectPreview key={PROJECTS[activeProject].id} project={PROJECTS[activeProject]} cardAnchor={cardAnchor} buttonAnchor={buttonAnchor} onHold={cancelClear} onRelease={scheduleClear} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobile && mobileModalProject !== null && (
          <MobileProjectModal project={mobileModalProject} onClose={() => setMobileModalProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

function MobileProjectModal({ project, onClose }) {
  const hasContent = Boolean(project.image && project.description);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative z-10 flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-black text-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">Selected Work</span>
            <span className="text-sm font-medium">0{project.id}</span>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors active:bg-white/20">
            <FaXmark size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {hasContent ? (
            <div className="flex flex-col gap-5">
              {project.image && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10">
                  <Image src={project.image} alt={project.title} fill unoptimized priority className="object-cover" />
                </div>
              )}

              <div>
                <h3 className="text-2xl font-medium">{project.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  {project.description}
                </p>
              </div>

              {project.stack && project.stack.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.stack.map((item) => (
                    <span key={item} className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center">
              <h3 className="text-2xl font-medium">COMING SOON</h3>
              <p className="mt-2 text-sm text-white/60">Project details will be revealed soon.</p>
            </div>
          )}
        </div>

        {hasContent && project.url && (
          <div className="border-t border-white/10 p-4">
            <Link href={project.url}
              target="_blank" rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#f97316] py-3.5 text-sm font-semibold text-black transition-transform active:scale-[0.98]">
              Visit Live Site
              <FaArrowUpRightFromSquare size={14} />
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function FloatingProjectPreview({ project, cardAnchor, buttonAnchor, onHold, onRelease }) {
  const cardX = useMotionValue(cardAnchor.x);
  const cardY = useMotionValue(cardAnchor.y);
  const buttonX = useMotionValue(buttonAnchor.x);
  const buttonY = useMotionValue(buttonAnchor.y);

  const springCardX = useSpring(cardX, { stiffness: 180, damping: 24, mass: 0.9 });
  const springCardY = useSpring(cardY, { stiffness: 180, damping: 24, mass: 0.9 });
  const springButtonX = useSpring(buttonX, { stiffness: 320, damping: 30, mass: 0.55 });
  const springButtonY = useSpring(buttonY, { stiffness: 320, damping: 30, mass: 0.55 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const parallaxX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const parallaxY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const driftX = useTransform(parallaxX, [-1, 1], [-14, 14]);
  const driftY = useTransform(parallaxY, [-1, 1], [-10, 10]);
  const rotateY = useTransform(parallaxX, [-1, 1], [-3.2, 3.2]);
  const rotateX = useTransform(parallaxY, [-1, 1], [3.2, -3.2]);
  const imageX = useTransform(parallaxX, [-1, 1], [-28, 28]);
  const imageY = useTransform(parallaxY, [-1, 1], [-18, 18]);

  useEffect(() => {
    cardX.set(cardAnchor.x);
    cardY.set(cardAnchor.y);
    buttonX.set(buttonAnchor.x);
    buttonY.set(buttonAnchor.y);
  }, [cardAnchor.x, cardAnchor.y, buttonAnchor.x, buttonAnchor.y, cardX, cardY, buttonX, buttonY]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dx = (e.clientX - centerX) / centerX;
      const dy = (e.clientY - centerY) / centerY;
      mouseX.set(clamp(dx, -1, 1));
      mouseY.set(clamp(dy, -1, 1));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => { window.removeEventListener("mousemove", handleMouseMove); };
  }, [mouseX, mouseY]);

  const hasContent = Boolean(project.image && project.description);

  return (
    <>
      <motion.div initial={{ opacity: 0, scale: 0.88, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed left-0 top-0 z-50 hidden lg:block"
        style={{ x: springCardX, y: springCardY, perspective: 1400, transformStyle: "preserve-3d" }}>

        <motion.div style={{ x: driftX, y: driftY, rotateX, rotateY, transformStyle: "preserve-3d" }} whileHover={{ scale: 1.01 }} className="relative">
          <div className="absolute -inset-6 rounded-[36px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_70%)] blur-2xl" />

          <motion.div initial={{ y: 6 }} animate={{ y: [0, -6, 0] }} transition={{ y: { duration: 4.8, repeat: Infinity, ease: "easeInOut" } }} className="relative h-130 w-212.5 overflow-hidden border border-white/10 bg-black shadow-[0_60px_140px_rgba(0,0,0,0.42)]">
            {hasContent ? (
              <>
                <motion.div className="absolute inset-0" style={{ x: imageX, y: imageY, scale: 1.08 }}>
                  <Image src={project.image} alt={project.title} fill unoptimized priority className="object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/30 to-black/90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />

                <div className="absolute inset-0 flex flex-col justify-between p-7 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.25em] opacity-70">Selected Work</span>
                    <span className="text-sm opacity-60">0{project.id}</span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-medium">{project.title}</h3>
                    <p className="mt-4 max-w-145 text-sm leading-relaxed text-white/80"> {project.description} </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <span key={item} className="rounded-full border border-white/20 px-3 py-1.5 text-xs backdrop-blur-md"> {item} </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-black text-white">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Selected Work</p>
                  <h3 className="mt-5 text-4xl font-medium">COMING SOON</h3>
                  <p className="mt-4 text-white/60">Project details will be revealed soon.</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {hasContent && project.url && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }} className="pointer-events-none fixed left-0 top-0 z-60 hidden lg:block" style={{ x: springButtonX, y: springButtonY }}>
          <div onPointerEnter={onHold} onPointerLeave={onRelease} className="pointer-events-auto">
            <Link href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-13 items-center gap-2 rounded-full border-2 border-white bg-[#f97316] px-5 py-3 text-sm font-semibold text-black shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:scale-[1.04] active:scale-[0.98]">
              Visit Live Site
              <FaArrowUpRightFromSquare size={16} />
            </Link>
          </div>
        </motion.div>
      )}
    </>
  );
};