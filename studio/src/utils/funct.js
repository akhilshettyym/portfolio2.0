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
};

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
      <motion.div
        animate={{ opacity: tick % 7 === 0 ? [0, 0.18, 0] : 0 }}
        transition={{ duration: 0.08 }}
        className="absolute inset-0 bg-white mix-blend-screen"
      />

      <div className="absolute inset-0 opacity-[0.035] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.15)_3px)]" />

      <motion.div
        key={`flash-${seed}-${tick}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.12, 0.04, 0], scale: [1, 1.02, 1] }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_45%)] mix-blend-screen"
      />

      {ERRORBITS.map((bit, i) => {
        const config = glitchPositions[i];

        return (
          <motion.div
            key={`${bit}-${tick}-${i}`}
            initial={{ opacity: 0, x: i % 2 ? 120 : -120 }}
            animate={{
              opacity: [0, 0.8, 0.3],
              x: [0, config.xShift, 0],
              y: [0, config.yShift, 0],
            }}
            transition={{ duration: 0.18, delay: i * 0.03, ease: "linear" }}
            className="absolute font-mono text-[10px] uppercase tracking-[0.35em] text-white/70 md:text-[11px]"
            style={{ left: config.left, top: config.top }}
          >
            {config.useGlitch ? <GlitchText>{bit}</GlitchText> : bit}
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

export function SceneShell({ dark, curtain = false, children }) {
  return (
    <div
      className={`relative h-screen w-full overflow-hidden ${dark ? "bg-black text-white" : "bg-white text-black"}`}
    >
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
      className={`relative h-screen w-full overflow-hidden ${dark ? "bg-black text-white" : "bg-white text-black"}`}
    >
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
    <div className="text-[11px] text-justify leading-relaxed max-w-full">
      <span className="block text-white font-medium mt-2">About Akhil Shetty</span>
      <p className="mt-1">
        A <span className="text-white font-medium">computer science graduate</span> from
        Mangalore, Karnataka, who turned systemic curiosity into a full-time engineering
        habit. Having graduated from St. Joseph Engineering College, I am currently based
        in Mumbai, accelerating products as an{" "}
        <span className="text-white font-medium">IT Developer</span>.
      </p>

      <span className="block text-white font-medium mt-3">Core Focus</span>
      <p className="mt-1">
        Building high-performance code, fine-tuning infrastructure latency, and mapping
        pixel-perfect layout architectures across scalable user systems.
      </p>

      <div className="pt-3 text-slate-500 select-none">
        $ <span>try entering: cat readme.md</span>
      </div>
    </div>
  );
};

export const logSkills = () => {
  return (
    <div className="w-full max-w-full rounded-md border border-neutral-800 bg-black/40 p-4 font-mono text-[11px] text-neutral-300">
      <div className="mb-4 flex items-start justify-between border-b border-neutral-800 pb-2">
        <div>
          <p className="text-[11px] text-purple-400">$ cat skills.json</p>
          <h3 className="text-[11px] text-neutral-100">Expertise & Capabilities</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        {[
          {
            name: "Next.js / React",
            val: "85%",
            color: "bg-cyan-500",
            text: "text-cyan-400",
          },
          {
            name: "MERN Stack",
            val: "80%",
            color: "bg-emerald-500",
            text: "text-emerald-400",
          },
          {
            name: "Salesforce CRM",
            val: "75%",
            color: "bg-amber-500",
            text: "text-amber-400",
          },
          {
            name: "Component Architecture",
            val: "85%",
            color: "bg-green-500",
            text: "text-green-400",
          },
          {
            name: "UI & Visual Design",
            val: "75%",
            color: "bg-sky-500",
            text: "text-sky-400",
          },
          {
            name: "Motion Graphics",
            val: "65%",
            color: "bg-purple-500",
            text: "text-purple-400",
          },
          { name: "Core Java", val: "60%", color: "bg-red-500", text: "text-red-400" },
          {
            name: "Docker & DevOps",
            val: "40%",
            color: "bg-blue-500",
            text: "text-blue-400",
          },
        ].map((s, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-neutral-400">
              <span>{s.name}</span>
              <span className={s.text}>{s.val}</span>
            </div>
            <div className="mt-1 h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
              <div className={`h-full ${s.color}`} style={{ width: s.val }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-neutral-800 pt-3">
        <p className="text-[11px] text-neutral-500 mb-1">// environment stack matrix</p>
        <p className="leading-relaxed text-neutral-400">
          <span className="text-neutral-200 font-semibold">Tools & Tech:</span> Core Java
          • JavaScript • Next.js • MySQL • TypeScript • Node.js • Express • Material UI •
          React • HTML/CSS • Figma • Git • GitHub • REST APIs
        </p>
      </div>
    </div>
  );
};

export const logAchievements = () => (
  <div className="text-[11px] text-emerald-400 font-mono">
    Navigating window down to achievements section...
  </div>
);

export const logProjects = () => (
  <div className="text-[11px] text-emerald-400 font-mono">
    Syncing workspace environment context to /work...
  </div>
);

export const logExperience = () => {
  return (
    <div className="space-y-3 max-w-full">
      {[
        {
          title: "Global Industrial Pvt. Ltd.",
          role: "IT Trainee · Developer",
          date: "Feb 2025 — Present",
          desc: "Scale global client dashboards and client frameworks utilizing Next.js, React, and Material UI. Optimize performance, layout paint timelines, and modular systems integration.",
          color: "text-amber-400",
        },
        {
          title: "Karanji Infotech Pvt. Ltd.",
          role: "Creative Motion Developer",
          date: "Nov 2024 — Dec 2024",
          desc: "Crafted 2D structural visuals and dynamic interactive vector systems using Adobe Creative platforms, keeping layout delivery structures crisp.",
          color: "text-sky-400",
        },
        {
          title: "Adore Earth",
          role: "Technical Operations Coordinator",
          date: "Oct 2024 — Nov 2024",
          desc: "Synchronized internal developer infrastructure pipelines, team alignment parameters, and digital conference matrices.",
          color: "text-emerald-400",
        },
      ].map((exp, idx) => (
        <div
          key={idx}
          className="rounded-md border border-neutral-800 bg-black/30 p-4 text-[11px] font-mono text-neutral-300"
        >
          <div className="mb-2 flex items-start justify-between border-b border-neutral-800/60 pb-2">
            <div>
              <p className={`text-[11px] ${exp.color}`}>$ status --active</p>
              <h3 className="text-[11px] text-neutral-100 font-bold">
                {exp.title}{" "}
                <span className="text-neutral-500 font-normal">({exp.role})</span>
              </h3>
            </div>
            <span className="text-[11px] text-neutral-500">{exp.date}</span>
          </div>
          <p className="leading-relaxed text-neutral-400">{exp.desc}</p>
        </div>
      ))}
    </div>
  );
};

export const logGithub = () => (
  <div className="text-[11px] font-mono p-2 border border-neutral-800 bg-black rounded-md max-w-full">
    <span className="text-gray-400 block mb-1">GitHub Endpoint</span>
    <a
      href="https://github.com/akhilshettyym"
      target="_blank"
      rel="noreferrer"
      className="text-cyan-400 hover:underline"
    >
      github.com/akhilshettyym ↗
    </a>
  </div>
);

export const logCreate = () => (
  <div className="text-[11px] text-emerald-400 font-mono">
    Opening deployment canvas inside path: /start...
  </div>
);

export const logHero = () => (
  <div className="text-[11px] text-emerald-400 font-mono">
    Returning root display terminal view matrix to main screen...
  </div>
);

export const logPhilosophy = () => {
  return (
    <div className="w-full text-[11px] bg-black/40 border border-slate-800 rounded-lg p-4 text-slate-400 font-mono leading-relaxed max-w-full">
      <div className="mb-3 pb-2 border-b border-slate-900">
        <span className="text-slate-500 font-medium block uppercase tracking-wider mb-1">
          Product Execution Philosophy
        </span>
        <p className="text-slate-200 text-[12px] font-medium italic">
          "If it does not remove user overhead, it does not belong in production."
        </p>
      </div>
      <ul className="space-y-2">
        <li>
          <strong className="text-slate-200 font-medium">Data-Driven Logic:</strong>{" "}
          Shifting guesswork out of codebase structures into absolute analytical
          verification.
        </li>
        <li>
          <strong className="text-slate-200 font-medium">Scalable Blueprinting:</strong>{" "}
          Constructing modular, reusable component hooks that lower build times across
          platforms.
        </li>
        <li>
          <strong className="text-slate-200 font-medium">Impact Metrics:</strong> Valuing
          technical performance conversions and functional scale above decorative styling
          layouts.
        </li>
      </ul>
    </div>
  );
};

export const logMail = () => (
  <div className="text-[11px] font-mono p-2 border border-neutral-800 bg-black rounded-md max-w-full">
    <span className="text-gray-400 block mb-1">Direct Communication Matrix</span>
    <a href="mailto:akhilshettym2003@gmail.com" className="text-cyan-400 hover:underline">
      akhilshettym2003@gmail.com ↗
    </a>
  </div>
);

export const logLinkedin = () => (
  <div className="text-[11px] font-mono p-2 border border-neutral-800 bg-black rounded-md max-w-full">
    <span className="text-gray-400 block mb-1">Professional Identity Link</span>
    <a
      href="https://linkedin.com/in/akhilshettym"
      target="_blank"
      rel="noreferrer"
      className="text-cyan-400 hover:underline"
    >
      linkedin.com/in/akhilshettym ↗
    </a>
  </div>
);

export const logInstagram = () => (
  <div className="text-[11px] font-mono p-2 border border-neutral-800 bg-black rounded-md max-w-full">
    <span className="text-gray-400 block mb-1">Visual Log Feed</span>
    <a
      href="https://www.instagram.com/akhil_shetty_m"
      target="_blank"
      rel="noreferrer"
      className="text-cyan-400 hover:underline"
    >
      instagram.com/akhil_shetty_m ↗
    </a>
  </div>
);

export const logSalesforce = () => (
  <div className="text-[11px] font-mono p-2 border border-neutral-800 bg-black rounded-md max-w-full">
    <span className="text-gray-400 block mb-1">Trailblazer Identity Profile</span>
    <a
      href="https://www.salesforce.com/trailblazer/akhilshettym"
      target="_blank"
      rel="noreferrer"
      className="text-cyan-400 hover:underline"
    >
      salesforce.com/trailblazer/akhilshettym ↗
    </a>
  </div>
);

export const logSocials = () => {
  return (
    <div className="space-y-2 max-w-full text-[11px] font-mono">
      <span className="text-xs font-medium text-slate-400 block mb-1">
        System Profile Endpoints
      </span>
      {[
        {
          label: "MAIL",
          val: "akhilshettym2003@gmail.com",
          url: "mailto:akhilshettym2003@gmail.com",
        },
        {
          label: "LINKEDIN",
          val: "linkedin.com/in/akhilshettym",
          url: "https://linkedin.com/in/akhilshettym",
        },
        {
          label: "GITHUB",
          val: "github.com/akhilshettyym",
          url: "https://github.com/akhilshettyym",
        },
        {
          label: "SALESFORCE",
          val: "trailblazer/akhilshettym",
          url: "https://www.salesforce.com/trailblazer/akhilshettym",
        },
      ].map((soc, i) => (
        <div
          key={i}
          className="flex justify-between items-center bg-black border border-slate-800 p-2 rounded hover:border-slate-400 transition-all"
        >
          <span className="text-slate-400">{soc.label}:</span>
          <a
            href={soc.url}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline"
          >
            {soc.val}
          </a>
        </div>
      ))}
    </div>
  );
};

export const logSudoHire = () => {
  return (
    <div className="w-full max-w-full bg-black border border-slate-800 rounded-md p-3.5 font-mono text-[11px] leading-relaxed">
      <div className="text-slate-400">
        [sudo] password for visitor: <span className="text-slate-700">********</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-2 mt-1">
        <span className="text-emerald-500 font-medium">
          ✓ System Authentication verified.
        </span>
      </div>
      <div className="text-slate-300 mt-3 pt-2 border-t border-slate-900 font-semibold">
        &gt; Offer profile securely queued for evaluation.
      </div>
    </div>
  );
};

export const logrmrf = () => {
  return (
    <div className="w-full max-w-full bg-black border border-slate-800 rounded-md p-4 font-mono text-[11px] leading-relaxed">
      <div className="flex flex-col gap-0.5 text-slate-400">
        <div>Removing local/ambiguity... done</div>
        <div>Removing local/impostor-syndrome... done</div>
        <div>Removing project/delivery-risk... done</div>
        <div className="text-emerald-400 font-bold mt-2 pt-2 border-t border-slate-900">
          ✦ Workspace stack cleared. Ready to start building together.
        </div>
      </div>
    </div>
  );
};

export const logCoffee = () => {
  return (
    <div className="w-full max-w-full bg-black border border-slate-800 rounded-md p-4 font-mono text-[11px]">
      <div className="text-slate-500 font-bold whitespace-pre mb-2 text-xs">
        {"( ( ) )\n........\n| |] \\ /\n`----´"}
      </div>
      <div className="space-y-1 text-slate-400">
        <div className="flex items-center gap-2">
          <span>Engine Status:</span>
          <span className="text-emerald-400">[██████████████░░░░░]</span>
          <span className="text-white">75% Optimized</span>
        </div>
        <div>Context: Fully compiled, pushing updates.</div>
      </div>
    </div>
  );
};

export const logCatReadme = () => {
  return (
    <div className="w-full max-w-full bg-black border border-slate-800 rounded-md p-4 font-mono text-[11px] leading-relaxed">
      <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-3 text-slate-500">
        <span className="text-emerald-500">#</span> <span>README.md</span>
      </div>
      <div className="space-y-2 text-slate-400">
        <p className="text-slate-200 font-medium">Welcome to the inner shell layer.</p>
        <p>
          I believe design isn't skin-deep decoration; it's structural optimization. Good
          code elements disappear cleanly into the user experience framework, helping
          consumers convert decisions instantly.
        </p>
        <p>
          The web is saturated with concepts that never reach compilation. I focus
          completely on shipping clean production components.
        </p>
        <div className="pt-2 text-slate-300 text-right font-medium italic">— Akhil</div>
      </div>
    </div>
  );
};

export const logPingAkhil = () => {
  return (
    <div className="w-full max-w-full bg-black border border-slate-800 rounded-md p-4 font-mono text-[11px] leading-relaxed">
      <div className="text-slate-500 mb-1">
        PING akhil.shetty.mumbai (192.168.1.337): 56 data bytes
      </div>
      <div className="space-y-0.5 text-slate-400">
        <div>
          64 bytes from local.network: icmp_seq=0 ttl=64 time=0.1ms{" "}
          <span className="text-emerald-400 ml-2">
            — Network connection fully established
          </span>
        </div>
        <div>
          64 bytes from local.network: icmp_seq=1 ttl=64 time=0.2ms{" "}
          <span className="text-emerald-400 ml-2">
            — System ready for contract modules
          </span>
        </div>
        <div>
          64 bytes from local.network: icmp_seq=2 ttl=64 time=0.1ms{" "}
          <span className="text-emerald-400 ml-2">
            — Engineering response cycles optimized
          </span>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-slate-900 text-slate-500">
        <div>--- network statistics ---</div>
        <div className="text-slate-400 mt-0.5">
          3 packets transmitted, 3 received,{" "}
          <span className="text-emerald-500">0% packet loss</span>
        </div>
      </div>
    </div>
  );
};

export const logSecrets = () => {
  return (
    <div className="mt-2 text-[11px] font-mono space-y-2">
      <div>
        <span className="font-bold text-white">Privileged Script Directory</span>
      </div>
      <div className="grid grid-cols-[140px_1fr] gap-x-2 text-gray-300">
        <span className="text-blue-400">sudo hire akhil</span>
        <span>Simulate recruitment contract execution</span>
        <span className="text-blue-400">rm -rf doubts</span>
        <span>Clear project delivery doubt parameters</span>
        <span className="text-blue-400">/coffee</span>
        <span>Display system runtime fuel index</span>
        <span className="text-blue-400">ls</span>
        <span>Output skill trees as standard terminal listings</span>
        <span className="text-blue-400">cat readme.md</span>
        <span>Output core development principles manifest</span>
        <span className="text-blue-400">ping akhil</span>
        <span>Verify network accessibility statistics</span>
        <span className="text-blue-400">whoami</span>
        <span>Display client environment values</span>
        <span className="text-blue-400">exit / close</span>
        <span>Terminate terminal window instances</span>
      </div>
    </div>
  );
};

export const logWhoAmI = () => (
  <div className="mt-2 text-[11px] font-mono leading-relaxed">
    Identity: Authenticated Visitor Node.
    <br />
    Action Status: Ready to execute operational commands.
    <br />
    💡 Hint: Try executing <span className="text-cyan-400">/secrets</span> to view hidden
    configuration systems.
  </div>
);

export const logLocation = () => {
  return (
    <div className="w-full max-w-full bg-black border border-slate-800 rounded-md p-4 font-mono text-[11px]">
      <div className="space-y-1 text-slate-400">
        <div>
          <span className="text-slate-500">Coordinates:</span>{" "}
          <span className="text-slate-200">📍 Mumbai, Maharashtra, India</span>
        </div>
        <div>
          <span className="text-slate-500">Availability:</span>{" "}
          <span className="text-slate-300">Remote Operations World-Wide</span>
        </div>
        <div>
          <span className="text-slate-500">Timezone Context:</span>{" "}
          <span className="text-slate-300">GMT +5:30 (IST)</span>
        </div>
      </div>
    </div>
  );
};

export const logls = () => {
  return (
    <div className="mt-2 font-mono text-[11px] text-gray-300 whitespace-pre">
      drwxr-xr-x user staff 128B Jul 19 20:30 design-systems.conf{"\n"}
      drwxr-xr-x user staff 256B Jul 19 20:30 frontend-architecture.cfg{"\n"}
      -rwxr-xr-x user staff 4.2K Jul 19 20:30 production-scaling.bin{"\n"}
      -rw-r--r-- user staff 912B Jul 19 20:30 fullstack-matrix.json{"\n"}
      -rw-r--r-- user staff 1.4K Jul 19 20:30 accessibility-wcag.a11y
    </div>
  );
};

export const logHelp = () => {
  return (
    <div className="mt-2 text-[11px] font-mono space-y-4">
      <div>
        <span className="font-bold text-white">System Command Index</span>
      </div>
      <div>
        <span className="font-bold text-slate-400 uppercase tracking-wide text-[10px]">
          Core Paths
        </span>
        <div className="grid grid-cols-[140px_1fr] gap-x-2 mt-1 text-gray-300">
          <span className="text-blue-400">/help</span>
          <span>Render available shell command trees</span>
          <span className="text-blue-400">/about</span>
          <span>Print biographical & focus data metrics</span>
          <span className="text-blue-400">/skills</span>
          <span>Output expertise matrices & stack levels</span>
          <span className="text-blue-400">/experience</span>
          <span>List historic and modern work timelines</span>
          <span className="text-blue-400">/projects</span>
          <span>Route view to case studies & deployments</span>
          <span className="text-blue-400">/achievements</span>
          <span>Navigate view parameters down to honors</span>
          <span className="text-blue-400">/philosophy</span>
          <span>Render underlying code execution beliefs</span>
          <span className="text-blue-400">/socials</span>
          <span>Compile external connection endpoints</span>
          <span className="text-blue-400">/clear</span>
          <span>Flush active screen log array buffers</span>
        </div>
      </div>
      <div>
        <span className="font-bold text-slate-400 uppercase tracking-wide text-[10px]">
          Project Deep Links
        </span>
        <div className="grid grid-cols-[140px_1fr] gap-x-2 mt-1 text-gray-300">
          <span className="text-blue-400">/signals</span>
          <span>Research Integrity Platform setup</span>
          <span className="text-blue-400">/anylyze</span>
          <span>Analytics Data Engine view</span>
          <span className="text-blue-400">/liveu</span>
          <span>Signa Component Framework layout</span>
          <span className="text-blue-400">/tuiasi</span>
          <span>Academic Ecosystem Design system</span>
          <span className="text-blue-400">/resnet</span>
          <span>Hospitality System UI module</span>
        </div>
      </div>
    </div>
  );
};
