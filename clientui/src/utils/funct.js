import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CHARS, CLAMP, EASEOUTEXPO, ERRORBITS, LERP, SAMPLES } from "@/utils/basic";

export const goToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

export function getCardState(progress, index) {
  const enterStart = 0.08 + index * 0.08;
  const enterEnd = 0.24 + index * 0.08;

  const reverseIndex = 3 - index;
  const exitStart = 0.68 + reverseIndex * 0.05;
  const exitEnd = 0.82 + reverseIndex * 0.05;

  const rawEnter = CLAMP(
    (progress - enterStart) / (enterEnd - enterStart),
    0,
    1,
  );
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
      <motion.div initial={{ y: "108%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.9, delay, ease: [0.77, 0, 0.175, 1] }}>
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
      {active &&
        lines.map((line, idx) => (
          <motion.div key={line.id}
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
      left: `${5 + ((i * 11) % 80)}%`,
      top: `${10 + ((i * 12) % 75)}%`,
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
      <motion.div animate={{ opacity: tick % 7 === 0 ? [0, 0.18, 0] : 0 }}
        transition={{ duration: 0.08 }}
        className="absolute inset-0 bg-white mix-blend-screen" />

      <div className="absolute inset-0 opacity-[0.035] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.15)_3px)]" />

      <motion.div key={`flash-${seed}-${tick}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.12, 0.04, 0], scale: [1, 1.02, 1] }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_45%)] mix-blend-screen" />

      {ERRORBITS.map((bit, i) => {
        const config = glitchPositions[i];

        return (
          <motion.div key={`${bit}-${tick}-${i}`}
            initial={{ opacity: 0, x: i % 2 ? 120 : -120 }}
            animate={{ opacity: [0, 0.8, 0.3], x: [0, config.xShift, 0], y: [0, config.yShift, 0] }}
            transition={{ duration: 0.18, delay: i * 0.03, ease: "linear" }}
            className="absolute font-mono text-[10px] uppercase tracking-[0.35em] text-white/70 md:text-[11px]"
            style={{ left: config.left, top: config.top }}>
            {config.useGlitch ? <GlitchText>{bit}</GlitchText> : bit}
          </motion.div>
        );
      })}
    </div>
  );
}

function BottomCurtain({ active }) {
  return (
    <motion.div initial={false}
      animate={ active ? { width: "100vw", height: "100vh", borderRadius: 0, x: 0, y: 0 } : { width: "92vw", height: "88vh", borderRadius: 32, x: "4vw", y: 0 }}
      transition={{ duration: 1.05, ease: [0.77, 0, 0.175, 1] }}
      className="absolute bottom-0 left-0 bg-black"
      style={{ transformOrigin: "bottom center" }} />
  );
}

export function SceneShell({ dark, curtain = false, children }) {
  return (
    <div
      className={`relative h-screen w-full overflow-hidden ${dark ? "bg-black text-white" : "bg-white text-black"}`}>
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
    <div className={`relative h-screen w-full overflow-hidden ${dark ? "bg-black text-white" : "bg-white text-black"}`}>
      {curtain ? <BottomCurtain active /> : null}

      <div className={`absolute inset-0 z-0 ${dark ? "bg-black" : "bg-white"}`} />
      <div className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),transparent_40%)] opacity-40" />
      <div className="pointer-events-none absolute inset-0 z-2 opacity-[0.08] mix-blend-overlay bg-[linear-gradient(rgba(0,0,0,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.25)_1px,transparent_1px)] bg-size-[100%_100%,100%_100%]" />

      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

/* GlitchText */
export function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

// ConsoleModal
export const logAbout = () => {
  return (
    <div className="text-[11px] text-justify">
      <span className="block text-white font-medium mt-4">About Akhil Shetty</span>
      <p className="mt-1"> A <span className="text-white font-medium">computer science graduate </span>
        from Mangalore, Karnataka, who somehow turned curiosity into a full-time habit. I graduated from St. Joseph Engineering College and currently live in Mumbai, working as an
        <span className="text-white font-medium"> IT Trainee Developer</span>.
      </p>

      <span className="block text-white font-medium mt-4">What I do</span>
      <p className="mt-1"> During the day, I build, fix, and break things (occasionally on purpose). I spend way too much time optimizing performance and crafting
        <span className="text-white font-medium"> seamless user experiences.</span>
      </p>

      <div className="pt-2">
        <span className="text-slate-500 select-none">$</span>
        <span>try: cat readme.md</span>
      </div>
    </div>
  )
}

export const logSkills = () => {
  return (
    <div className="w-full max-w-3xl rounded-md border border-neutral-800 bg-black p-4 font-mono text-[11px] text-neutral-300">
      <div className="mb-4 flex items-start justify-between border-b border-neutral-800 pb-2">
        <div>
          <p className="text-[11px] text-purple-400">$ cat skills.json</p>
          <h3 className="text-[11px] text-neutral-100">Expertise & Capabilities</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        <div>
          <div className="flex justify-between text-neutral-400">
            <span>Next.js / React</span>
            <span className="text-cyan-400">85%</span>
          </div>
          <div className="mt-1 h-0.5 w-full bg-neutral-900">
            <div className="h-full bg-cyan-500" style={{ width: '85%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-neutral-400">
            <span>MERN Stack</span>
            <span className="text-emerald-400">80%</span>
          </div>
          <div className="mt-1 h-0.5 w-full bg-neutral-900">
            <div className="h-full bg-emerald-500" style={{ width: '80%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-neutral-400">
            <span>Docker & DevOps</span>
            <span className="text-blue-400">40%</span>
          </div>
          <div className="mt-1 h-0.5 w-full bg-neutral-900">
            <div className="h-full bg-blue-500" style={{ width: '40%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-neutral-400">
            <span>Salesforce CRM</span>
            <span className="text-amber-400">75%</span>
          </div>
          <div className="mt-1 h-0.5 w-full bg-neutral-900">
            <div className="h-full bg-amber-500" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-neutral-400">
            <span>UI & Visual Design</span>
            <span className="text-sky-400">75%</span>
          </div>
          <div className="mt-1 h-0.5 w-full bg-neutral-900">
            <div className="h-full bg-sky-500" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-neutral-400">
            <span>Core Java</span>
            <span className="text-red-400">60%</span>
          </div>
          <div className="mt-1 h-0.5 w-full bg-neutral-900">
            <div className="h-full bg-red-500" style={{ width: '60%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-neutral-400">
            <span>Motion Graphics</span>
            <span className="text-purple-400">65%</span>
          </div>
          <div className="mt-1 h-0.5 w-full bg-neutral-900">
            <div className="h-full bg-purple-500" style={{ width: '65%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-neutral-400">
            <span>Component Architecture</span>
            <span className="text-green-400">85%</span>
          </div>
          <div className="mt-1 h-0.5 w-full bg-neutral-900">
            <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-neutral-800 pt-3">
        <p className="text-[11px] text-neutral-500 mb-1">{"// environment stack"}</p>
        <p className="leading-relaxed text-neutral-400">
          <span className="text-neutral-200 font-semibold">Languages & Frameworks:</span> Core Java • JavaScript • NextJs • MySql • TypeScript • Node.js • Express • Material UI • React •  HTML/CSS • Figma <br />
          <span className="text-neutral-200 font-semibold">Tools & Infrastructure:</span> Git • GitHub • CMS Integrations • REST APIs
        </p>
      </div>
    </div>
  )
}

export const logAchievements = () => {
  return (
    <div className="text-[11px]">
      <span className="text-emerald-400">Navigating to achievements section...</span>
    </div>
  )
}

export const logProjects = () => {
  return (
    <div className="text-[11px]">
      <span className="text-emerald-400">Navigating to projects section on /work...</span>
    </div>
  )
}

export const logExperience = () => {
  return (
    <>
      <div className="w-full max-w-3xl rounded-md border border-neutral-800 bg-black p-4 text-[11px] font-mono text-neutral-300">
        <div className="mb-2 flex items-start justify-between border-b border-neutral-800 pb-2">
          <div>
            <p className="text-[11px] text-emerald-400">$ company</p>
            <h3 className="text-[11px] text-neutral-100">
              Adore Earth (Non-Profit Organization)
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500">
            Oct 2024 — Nov 2024
          </span>
        </div>

        <p className="leading-relaxed text-neutral-400">
          Managed end-to-end recruitment workflows, including candidate screening, onboarding, and
          team coordination. Coordinated and hosted organizational conferences while driving internal
          communication and team culture initiatives.
        </p>
      </div>

      <div className="mt-4 w-full max-w-3xl rounded-md border border-neutral-800 bg-black p-4 text-[11px] font-mono text-neutral-300">
        <div className="mb-2 flex items-start justify-between border-b border-neutral-800 pb-2">
          <div>
            <p className="text-[11px] text-sky-400">$ company</p>
            <h3 className="text-[11px] text-neutral-100">
              Karanji Infotech Pvt. Ltd.
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500">
            Nov 2024 — Dec 2024
          </span>
        </div>

        <p className="leading-relaxed text-neutral-400">
          Designed visual assets and 2D motion graphics utilizing Adobe Creative Suite, focusing on
          Adobe Animate. Executed character rigging, applied motion principles, and prepared assets
          for interactive digital storytelling.
        </p>
      </div>

      <div className="mt-4 w-full max-w-3xl rounded-md border border-neutral-800 bg-black p-4 text-[11px] font-mono text-neutral-300">
        <div className="mb-2 flex items-start justify-between border-b border-neutral-800 pb-2">
          <div>
            <p className="text-[11px] text-amber-400">$ company</p>
            <h3 className="text-[11px] text-neutral-100">
              Global Industrial Pvt. Ltd.
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500">
            Feb 2025 — Present
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] text-green-400">
                ─ IT Intern · Developer
              </span>
              <span className="text-[11px] text-neutral-500">
                Feb 03 2025 — Jun 15 2025
              </span>
            </div>

            <p className="pl-4 leading-relaxed text-neutral-400">
              Contributed to active codebases by developing responsive UIs, enhancing user experiences,
              and implementing core features within cross-functional engineering teams.
            </p>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] text-cyan-400">
                └─ IT Trainee · Developer
              </span>
              <span className="text-[11px] text-neutral-500">
                Jun 16 2025 — Present
              </span>
            </div>

            <p className="pl-4 leading-relaxed text-neutral-400">
              Build and scale enterprise frontend applications using Next.js, React, and Material UI.
              Responsible for UI/UX implementation, understanding CMS, data handling, and performance optimization.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export const logGithub = () => {
  return (
    <div>
      <span className="text-xs font-medium text-slate-400 block mb-1.5">Github</span>

      <Link href="https://github.com/akhilshettyym" target="_blank" rel="noopener noreferrer" className="group w-full text-[11px] flex items-center justify-between bg-black border border-slate-800 hover:border-slate-200 rounded-md p-3 text-slate-500 font-normal transition-all duration-300 cursor-pointer">

        <span className="text-slate-600 group-hover:text-slate-400 transition-colors duration-300">
          /akhilshettyym
        </span>
      </Link>

      <div className="text-[10px] text-slate-600 mt-1.5 pl-1">
        → /social for all profiles
      </div>
    </div>
  )
}

export const logCreate = () => {
  return (
    <div className="text-[11px]">
      <span className="text-emerald-400">Navigating to Create Something section on /start...</span>
    </div>
  )
}

export const logPhilosophy = () => {
  return (
    <div className="w-full text-[11px] bg-black border border-slate-800 rounded-lg p-4 text-slate-400 font-normal leading-relaxed max-w-3xl">
      <div className="mb-4 pb-3 border-b border-slate-900">
        <span className="text-slate-500 font-medium block uppercase tracking-wider mb-1">My Design Philosophy</span>
        <p className="text-slate-200 text-[12px] font-medium italic">&quot;If it doesn&apos;t remove friction, it doesn&apos;t belong.&quot;</p>
      </div>

      <ul className="space-y-3.5">
        <li className="flex flex-col gap-0.5">
          <strong className="text-slate-200 font-medium">Research First:</strong>
          <span>Replacing guesswork with analytics, session replays, and direct user feedback.</span>
        </li>

        <li className="flex flex-col gap-0.5">
          <strong className="text-slate-200 font-medium">Built to Scale:</strong>
          <span>Creating repeatable design systems that unify platforms and slash dev time.</span>
        </li>

        <li className="flex flex-col gap-0.5">
          <strong className="text-slate-200 font-medium">Business Outcomes:</strong>
          <span>Focusing on conversion, retention, and metrics over just pretty screens.</span>
        </li>

        <li className="flex flex-col gap-0.5">
          <strong className="text-slate-200 font-medium">Ruthless Clarity:</strong>
          <span>Eliminating visual clutter. If a pixel doesn&apos;t serve a clear purpose, it gets cut.</span>
        </li>

        <li className="flex flex-col gap-0.5">
          <strong className="text-slate-200 font-medium">Universal Access:</strong>
          <span>Starting every project with WCAG compliance as a core foundational pillar.</span>
        </li>
      </ul>
    </div>
  )
}

export const logMail = () => {
  return (
    <div>
      <span className="text-xs font-medium text-slate-400 block mb-1.5">Mail</span>

      <Link href="akhilshettym2003@gmail.com" target="_blank" rel="noopener noreferrer" className="group w-full text-[11px] flex items-center justify-between bg-black border border-slate-800 hover:border-slate-200 rounded-md p-3 text-slate-500 font-normal transition-all duration-300 cursor-pointer">

        <span className="text-slate-600 group-hover:text-slate-400 transition-colors duration-300">
          /akhilshettym2003@gmail.com
        </span>
      </Link>

      <div className="text-[10px] text-slate-600 mt-1.5 pl-1">
        → /socials for all profiles
      </div>
    </div>
  )
}

export const logLinkedin = () => {
  return (
    <div>
      <span className="text-xs font-medium text-slate-400 block mb-1.5">LinkedIn</span>

      <Link href="https://linkedin.com/in/akhilshettym" target="_blank" rel="noopener noreferrer" className="group w-full text-[11px] flex items-center justify-between bg-black border border-slate-800 hover:border-slate-200 rounded-md p-3 text-slate-500 font-normal transition-all duration-300 cursor-pointer">
        <span className="text-slate-400 font-medium group-hover:text-white transition-colors duration-300">
          IN: Akhil Shetty M
        </span>

        <span className="text-slate-600 group-hover:text-slate-400 transition-colors duration-300">
          /in/akhilshettym
        </span>
      </Link>

      <div className="text-[10px] text-slate-600 mt-1.5 pl-1">
        → /socials for all profiles
      </div>
    </div>
  )
}

export const logInstagram = () => {
  return (
    <div>
      <span className="text-xs font-medium text-slate-400 block mb-1.5">Instagram</span>

      <Link href="https://www.instagram.com/akhil_shetty_m" target="_blank" rel="noopener noreferrer" className="group w-full text-[11px] flex items-center justify-between bg-black border border-slate-800 hover:border-slate-200 rounded-md p-3 text-slate-500 font-normal transition-all duration-300 cursor-pointer">
        <span className="text-slate-400 font-medium group-hover:text-white transition-colors duration-300">
          INSTA: Akhil Shetty M
        </span>

        <span className="text-slate-600 group-hover:text-slate-400 transition-colors duration-300">
          /akhil_shetty_m
        </span>
      </Link>

      <div className="text-[10px] text-slate-600 mt-1.5 pl-1">
        → /socials for all profiles
      </div>
    </div>
  )
}

export const logSalesforce = () => {
  return (
    <div>
      <span className="text-xs font-medium text-slate-400 block mb-1.5">Salesforce</span>

      <Link href="https://www.salesforce.com/trailblazer/akhilshettym" target="_blank" rel="noopener noreferrer" className="group w-full text-[11px] flex items-center justify-between bg-black border border-slate-800 hover:border-slate-200 rounded-md p-3 text-slate-500 font-normal transition-all duration-300 cursor-pointer">
        <span className="text-slate-400 font-medium group-hover:text-white transition-colors duration-300">
          SF: Akhil Shetty M
        </span>

        <span className="text-slate-600 group-hover:text-slate-400 transition-colors duration-300">
          /akhilshettym
        </span>
      </Link>

      <div className="text-[10px] text-slate-600 mt-1.5 pl-1">
        → /socials for all profiles
      </div>
    </div>
  )
}

export const logSocials = () => {
  return (
    <div>
      <span className="text-xs font-medium text-slate-400 block mb-1.5">Socials</span>

      <Link href="akhilshettym2003@gmail.com" target="_blank" rel="noopener noreferrer" className="group w-full text-[11px] flex items-center justify-between bg-black border border-slate-800 hover:border-slate-200 rounded-md p-3 text-slate-500 font-normal transition-all duration-300 cursor-pointer">
        <span className="text-slate-400 font-medium group-hover:text-white transition-colors duration-300">
          MAIL: Akhil Shetty M
        </span>
        <span className="text-slate-600 group-hover:text-slate-400 transition-colors duration-300">
          /akhilshettym2003@gmail.com
        </span>
      </Link>

      <Link href="https://linkedin.com/in/akhilshettym" target="_blank" rel="noopener noreferrer" className="group w-full text-[11px] flex items-center justify-between bg-black border border-slate-800 hover:border-slate-200 rounded-md p-3 text-slate-500 font-normal transition-all duration-300 cursor-pointer">
        <span className="text-slate-400 font-medium group-hover:text-white transition-colors duration-300">
          IN: Akhil Shetty M
        </span>
        <span className="text-slate-600 group-hover:text-slate-400 transition-colors duration-300">
          /in/akhilshettym
        </span>
      </Link>

      <Link href="https://www.instagram.com/akhil_shetty_m" target="_blank" rel="noopener noreferrer" className="group w-full text-[11px] flex items-center justify-between bg-black border border-slate-800 hover:border-slate-200 rounded-md p-3 text-slate-500 font-normal transition-all duration-300 cursor-pointer">
        <span className="text-slate-400 font-medium group-hover:text-white transition-colors duration-300">
          INSTA: Akhil Shetty M
        </span>
        <span className="text-slate-600 group-hover:text-slate-400 transition-colors duration-300">
          /akhil_shetty_m
        </span>
      </Link>

      <Link href="https://github.com/akhilshettyym" target="_blank" rel="noopener noreferrer" className="group w-full text-[11px] flex items-center justify-between bg-black border border-slate-800 hover:border-slate-200 rounded-md p-3 text-slate-500 font-normal transition-all duration-300 cursor-pointer">
        <span className="text-slate-400 font-medium group-hover:text-white transition-colors duration-300">
          GITHUB: Akhil Shetty M
        </span>
        <span className="text-slate-600 group-hover:text-slate-400 transition-colors duration-300">
          /akhilshettyym
        </span>
      </Link>

      <Link href="https://www.salesforce.com/trailblazer/akhilshettym" target="_blank" rel="noopener noreferrer" className="group w-full text-[11px] flex items-center justify-between bg-black border border-slate-800 hover:border-slate-200 rounded-md p-3 text-slate-500 font-normal transition-all duration-300 cursor-pointer">
        <span className="text-slate-400 font-medium group-hover:text-white transition-colors duration-300">
          SF: Akhil Shetty M
        </span>

        <span className="text-slate-600 group-hover:text-slate-400 transition-colors duration-300">
          /akhilshettym
        </span>
      </Link>

      <div className="text-[10px] text-slate-600 mt-1.5 pl-1">
        → /philosophy for my design philosophy
      </div>
    </div>
  )
}

export const logSudoHire = () => {
  return (
    <div className="w-full max-w-md bg-black border border-slate-800 rounded-md p-3.5 font-mono text-[11px] leading-relaxed select-none">
      <div className="text-slate-400">
        [sudo] password for visitor: <span className="text-slate-700">********</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-2 mt-1">
        <span className="text-emerald-500 font-medium">✓ Authentication successful.</span>
        <span className="text-slate-500">Establishing secure connection...</span>
      </div>
      <div className="text-slate-300 mt-3 pt-2.5 border-t border-slate-900 font-semibold flex items-center gap-1.5">
        <span className="text-emerald-400">&gt;</span> Successfully sent
      </div>
    </div>
  )
}

export const logrmrf = () => {
  return (
    <div className="w-full max-w-md bg-black border border-slate-800 rounded-md p-4 font-mono text-[11px] leading-relaxed select-none">
      <div className="flex flex-col gap-1.5 text-slate-400">
        <div>Removing doubts/impostor-syndrome... done</div>
        <div>Removing doubts/will-he-deliver... done</div>
        <div>Removing doubts/is-he-expensive... done</div>
        <div>Removing doubts/can-he-lead... done</div>

        <div className="text-emerald-400 font-bold mt-2 pt-2 border-t border-slate-900">
          ✦ All doubts removed. You should definitely hire me.
        </div>
      </div>
    </div>
  )
}

export const logCoffee = () => {
  return (
    <div className="w-full max-w-sm bg-black border border-slate-800 rounded-md p-4 font-mono text-[11px] leading-normal select-none">
      <div className="text-slate-600 font-bold whitespace-pre mb-2.5">
        {"( ( ) )\n........\n| |] \\ /\n`----´"}
      </div>

      <div className="flex flex-col gap-1 text-slate-400">
        <div className="flex items-center gap-1.5">
          <span>Design fuel level:</span>
          <span className="text-emerald-400">[████████████████░░░░]</span>
          <span className="text-slate-200 font-medium">80%</span>
        </div>

        <div>
          <span className="text-slate-500">Status:</span>{" "}
          <span className="text-slate-300 font-medium">Caffeinated and pixel-pushing</span>
        </div>

        <div>
          <span className="text-slate-500">Daily intake:</span>{" "}
          <span className="text-slate-300 font-medium">Yes</span>
        </div>
      </div>
    </div>
  )
}

export const logCatReadme = () => {
  return (
    <div className="w-full max-w-xl bg-black border border-slate-800 rounded-md p-4 font-mono text-[11px] leading-relaxed select-none">
      <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-3 text-slate-500 font-medium">
        <span className="text-emerald-500">#</span>
        <span>README.md</span>
      </div>

      <div className="space-y-3.5 text-slate-400">
        <p className="text-slate-200 font-medium"> Hey, you found this. Nice. </p>
        <p> If you&apos;re reading this, you&apos;re probably the kind of person who inspects elements, reads source code, and appreciates the details. We&apos;d get along. </p>
        <p> I believe the best design is invisible. It doesn&apos;t make you think about the interface — it makes you think about your goals. Every pixel I push is in service of that belief. </p>
        <p> The world has enough pretty mockups that never ship. I build things that do. </p>

        <div className="pt-2 text-slate-300 font-medium text-right italic">
          — Akhil
        </div>
      </div>
    </div>
  )
}

export const logPingAkhil = () => {
  return (
    <div className="w-full max-w-xl bg-black border border-slate-800 rounded-md p-4 font-mono text-[11px] leading-relaxed select-none">
      <div className="text-slate-500 mb-1">
        PING akhil.shetty (192.168.1.337): 56 data bytes
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="text-slate-400">
          64 bytes from Iasi: icmp_seq=0 ttl=64 time=0.1ms <span className="text-emerald-400 font-medium ml-1.5">— Always online</span>
        </div>

        <div className="text-slate-400">
          64 bytes from Iasi: icmp_seq=1 ttl=64 time=0.2ms <span className="text-emerald-400 font-medium ml-1.5">— Available for great projects</span>
        </div>

        <div className="text-slate-400">
          64 bytes from Iasi: icmp_seq=2 ttl=64 time=0.1ms <span className="text-emerald-400 font-medium ml-1.5">— Responds faster than your current designer</span>
        </div>

        <div className="text-slate-400">
          64 bytes from Iasi: icmp_seq=3 ttl=64 time=0.3ms <span className="text-emerald-400 font-medium ml-1.5">— Will not ghost you</span>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-950 text-slate-500">
        <div>--- akhil.shetty ping statistics ---</div>
        <div className="text-slate-400 mt-0.5">
          4 packets transmitted, 4 received, <span className="text-emerald-500 font-medium">0% packet loss</span>
        </div>
      </div>
    </div>
  )
}

export const logSecrets = () => {
  return (
    <div className="mt-2 space-y-2">
      <div><span className="font-bold text-white">Secret Commands</span><br />Shhh... you found the cheat sheet.</div>
      <div className="grid grid-cols-[120px_1fr] gap-x-2">
        <span className="text-blue-400">sudo hire akhil</span><span>Fake contract with progress bar</span>
        <span className="text-blue-400">rm -rf doubts</span><span>Remove all your doubts</span>
        <span className="text-blue-400">/coffee</span><span>Design fuel status</span>
        <span className="text-blue-400">ls</span><span>Skills as Linux files</span>
        <span className="text-blue-400">cat readme.md</span><span>A hidden personal message</span>
        <span className="text-blue-400">ping akhil</span><span>Am I available? Find out</span>
        <span className="text-blue-400">whoami</span><span>The terminal knows you</span>
        <span className="text-blue-400">exit</span><span>Try to leave. I dare you.</span>
      </div>
    </div>
  )
}

export const logWhoAmI = () => {
  return (
    <div className="mt-2">
      You&apos;re the person about to hire a great designer.<br />
      (Trust the terminal. It knows things.)<br /><br />
      Type /secrets if you like finding hidden things.
    </div>
  )
}

export const logLocation = () => {
  return (
    <div className="w-full max-w-xl bg-black border border-slate-800 rounded-md p-4 font-mono text-[11px] leading-relaxed select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-slate-400">

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Location:</span>
            <span className="text-slate-200 font-medium flex items-center gap-1">
              <span>📍</span> Mumbai, India
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Coverage:</span>
            <span className="text-slate-300 flex items-center gap-1">
              <span>🌍</span> Working across Asia
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Timezone:</span>
            <span className="text-slate-300 flex items-center gap-1">
              <span>🕐</span> Indian Standard Time
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}

export const logls = () => {
  return (
    <div className="mt-2 whitespace-pre">
      drwxr-xr-x akhil design-systems.exe{"\n"}
      drwxr-xr-x akhil ux-research.doc{"\n"}
      -rwxr-xr-x akhil figma-mastery.cfg{"\n"}
      -rw-r--r-- akhil pixel-perfection.so{"\n"}
      -rwxr-xr-x akhil strategic-thinking.bin{"\n"}
      drwxr-xr-x akhil workshop-facilitation/{"\n"}
      -rw-r--r-- akhil accessibility.a11y
    </div>
  )
}

export const logHelp = () => {
  return (
    <div className="mt-2 space-y-4">
      <div><span className="font-bold text-white">Available Commands</span></div>
      <div>
        <span className="font-bold text-white">Navigation</span>
        <div className="grid grid-cols-[120px_1fr] gap-x-2 mt-1 text-gray-300">
          <span className="text-blue-400">/help</span><span>List all available commands</span>
          <span className="text-blue-400">/about</span><span>Who is Akhil Shetty M?</span>
          <span className="text-blue-400">/skills</span><span>Featured projects & case studies</span>
          <span className="text-blue-400">/achievements</span><span>Companies I&apos;ve worked with</span>
          <span className="text-blue-400">/projects</span><span>Expertise & capabilities</span>
          <span className="text-blue-400">/experience</span><span>My design philosophy</span>
          <span className="text-blue-400">/socials</span><span>Social profiles & links</span>
          <span className="text-blue-400">/philosophy</span><span>Get in touch</span>
          <span className="text-blue-400">/clear</span><span>Clear the terminal</span>
        </div>
      </div>
      <div>
        <span className="font-bold text-white">Projects</span>
        <div className="grid grid-cols-[120px_1fr] gap-x-2 mt-1 text-gray-300">
          <span className="text-blue-400">/signals</span><span>Research Integrity Platform</span>
          <span className="text-blue-400">/anylyze</span><span>Analytics Data Platform</span>
          <span className="text-blue-400">/liveu</span><span>Signa Design System</span>
          <span className="text-blue-400">/tuiasi</span><span>University Redesign</span>
          <span className="text-blue-400">/resnet</span><span>Hospitality Design System</span>
        </div>
      </div>
      <div>Aliases: /projects, /about, hire akhil, /mail<br /></div>
    </div>
  )
}