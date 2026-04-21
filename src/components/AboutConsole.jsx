"use client";

import { GlobePanel } from "./GlobePanel";

function TerminalFrame({ title, command, lines = [], children, variant = "default" }) {
    return (
        <div className="relative h-full min-h-64 overflow-hidden border-r border-white/20 bg-[#030507] flex flex-col">

            <div className={`absolute inset-0 ${variant === "deploy" ? "bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.25),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.12),transparent_40%)]" : "bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.12),transparent_38%),radial-gradient(circle_at_0%_50%,rgba(59,130,246,0.10),transparent_28%)]"}`} />
            <div className={`absolute inset-0 opacity-[0.08] ${variant === "deploy" ? "bg-[repeating-linear-gradient(45deg,rgba(59,130,246,0.25)_0px,rgba(59,130,246,0.25)_1px,transparent_1px,transparent_4px)]" : "bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.8)_0px,rgba(255,255,255,0.8)_1px,transparent_1px,transparent_3px)]"}`} />
            <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size:18px_18px" />

            <div className="relative z-10 border-b border-white/10 bg-black/60 px-3 pt-2 pb-1">
                <div className="flex items-center gap-2 mb-1 mt-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="font-mono text-[10px] p-2 sm:text-xs tracking-[0.22em] text-white/45">
                    {title}
                </div>
            </div>

            <div className="relative z-10 h-[calc(100%-3.2rem)] flex">
                <div className="w-full p-1 sm:p-4 font-mono text-[10px] sm:text-xs text-white/70 leading-relaxed">
                    <div className="text-white/35">{command}</div>

                    {children ? (
                        <div className="mt-3">{children}</div>
                    ) : (
                        <div className="mt-3 space-y-1">
                            {lines.map((line, idx) => (
                                <div key={idx} className="text-white/55">{line}</div>
                            ))}
                        </div>
                    )}

                    <div className="mt-3 text-emerald-300/80">
                        [ OK ] system stable <span className="animate-pulse">▍</span>
                    </div>
                </div>
            </div>

            <div className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l border-t border-white/20" />
            <div className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r border-t border-white/20" />
            <div className="pointer-events-none absolute left-2 bottom-2 h-4 w-4 border-l border-b border-white/20" />
            <div className="pointer-events-none absolute right-2 bottom-2 h-4 w-4 border-r border-b border-white/20" />
        </div>
    );
}

export default function AboutConsole() {
    return (
        <div className="w-full max-w-full overflow-x-hidden box-border p-10">

            <div className="mb-6 relative">
                <div className="border-t border-white/10" />
                <div className="absolute -top-3 left-0 w-full flex justify-between text-white font-mono text-sm sm:text-base">
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                    <span>+</span>
                </div>
            </div>

            <div className="mb-5 flex justify-between text-[10px] tracking-[0.25em] text-white/50 sm:text-xs">
                <span> / ENGINEERING PROFILE </span>
                <span> / SYSTEM ARCHITECTURE </span>
            </div>

            <div className="mb-6 border-t border-white/20" />

            <div className="grid grid-cols-4 border border-white/30">

                <TerminalFrame
                    title="terminal://profile.core"
                    command="$ load profile --full"
                    lines={[
                        "4+ years building full-stack production systems",
                        "MERN stack architecture & implementation",
                        "scalable backend systems & API design",
                        "containerized workflows with Docker",
                        "Kubernetes-based deployment & orchestration",
                        "performance optimization & system reliability",
                        "end-to-end feature ownership from design to deployment",
                    ]}
                />

                <div className="min-w-0 border-r border-white/20 p-4 sm:p-6 flex flex-col justify-center">
                    <h3 className="text-base font-semibold text-white sm:text-xl">
                        Full-stack engineer building scalable production systems
                    </h3>

                    <p className="mt-2 text-xs text-white/70 sm:text-sm">
                        Computer Science graduate with 4 years of experience in UI/UX design and 2+ years in MERN stack development. Skilled in building intuitive user experiences backed by scalable systems, with exposure to DevOps practices and data-driven problem solving. Driven by curiosity and a passion for exploring new technologies and challenges.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {"FULLSTACK MERN NODE REACT DOCKER SYSTEM-DESIGN".split(" ").map((t) => (
                            <span key={t} className="border border-white/20 px-2 py-1 text-[10px] text-white/60 sm:text-xs"> {t} </span>
                        ))}
                    </div>
                </div>

                <TerminalFrame title="terminal://system.deploy" variant="deploy">
                    <GlobePanel />
                </TerminalFrame>


                <div className="min-w-0 p-4 sm:p-6 flex flex-col justify-center">

                    <h3 className="text-base font-semibold text-white sm:text-xl">
                        Operating globally from Mangalore, India
                    </h3>

                    <p className="mt-2 text-xs text-white/70 sm:text-sm">
                        Based in Mangalore, Karnataka, I build scalable, production-grade systems for distributed teams. Experienced in remote-first environments, I focus on clarity, reliability, and delivering high-quality solutions across time zones.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {"REMOTE WORK DISTRIBUTED_SYSTEMS SCALABLE ARCHITECTURE".split(" ").map((t) => (
                            <span key={t} className="border border-white/20 px-2 py-1 text-[10px] text-white/60 sm:text-xs"> {t} </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-6 border-t border-white/20" />
        </div>
    );
}