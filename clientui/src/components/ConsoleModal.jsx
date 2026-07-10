import { createPortal } from "react-dom";
import { FaCodeMerge } from "react-icons/fa6";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";

const ConsoleModal = ({ isOpen, onClose }) => {
    const router = useRouter();
    const pathname = usePathname();
    const inputRef = useRef(null);
    const terminalEndRef = useRef(null);

    const [isExpanded, setIsExpanded] = useState(false);
    const [render, setRender] = useState(isOpen);
    const [animationState, setAnimationState] = useState("closed");
    const [mounted, setMounted] = useState(false);
    const [dimen, setDimen] = useState("15x40");

    const [bootPhase, setBootPhase] = useState("loading");
    const [bootProgress, setBootProgress] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [history, setHistory] = useState([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setRender(true);
            setTimeout(() => setAnimationState("open"), 10);

            if (bootPhase === "loading") {
                setBootProgress(0);
            }
        } else {
            setAnimationState("closed");
            setTimeout(() => setRender(false), 300);
        }
    }, [isOpen, bootPhase]);

    useEffect(() => {
        if (isOpen && bootPhase === "loading") {
            const interval = setInterval(() => {
                setBootProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setBootPhase("ready");
                        return 100;
                    }
                    return prev + Math.floor(Math.random() * 15) + 5;
                });
            }, 150);
            return () => clearInterval(interval);
        }
    }, [isOpen, bootPhase]);

    useEffect(() => {
        const handleBootEnter = (e) => {
            if (isOpen && bootPhase === "ready" && e.key === "Enter") {
                setBootPhase("complete");
            }
        };
        window.addEventListener("keydown", handleBootEnter);
        return () => window.removeEventListener("keydown", handleBootEnter);
    }, [isOpen, bootPhase]);

    const handleTerminalClick = () => {
        if (bootPhase === "complete" && inputRef.current) {
            inputRef.current.focus();
        }
    };

    useEffect(() => {
        if (terminalEndRef.current) {
            terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [history, bootPhase]);

    const executeCommand = (cmd) => {
        let command = cmd.trim().toLowerCase();

        const nonSlashCommands = ["clear", "close", "ls", "whoami", "exit", "sudo", "rm", "cat", "ping", "git"];
        if (!command.startsWith("/") && !nonSlashCommands.some(c => command.startsWith(c)) && command !== "") {
            command = "/" + command;
        }

        let output = "";

        const handleNavigation = (path, hash) => {
            if (pathname === path) {
                if (window.location.hash === hash) {
                    const elementId = hash.replace("#", "");
                    const element = document.getElementById(elementId);
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                } else {
                    window.location.hash = hash;
                }
            } else {
                router.push(`${path}${hash}`);
            }
        };

        switch (command) {
            case "/about":
                handleNavigation("/", "#about");
                output = (
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
                );
                break;

            case "/work":
                handleNavigation("/", "#work");
                output = (
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
                );
                break;

            case "/projects":
                handleNavigation("/work", "#projects");
                output = (
                    <div className="space-y-4 mt-2">
                        <div>
                            <span className="font-bold text-white">Featured Work</span>
                            <br />
                            2 projects • 2021–2026
                        </div>

                        <div>
                            <span className="text-yellow-400">2026</span>
                            <br />
                            <span className="font-bold text-white">Apex Logistics</span> — Supply Chain Command Center
                            <br />
                            Architected real-time fleet tracking interfaces with geo-fencing controls and interactive route planning nodes.
                            <br />
                            <span className="text-gray-400">UI/UX Design • Dashboard • Logistics</span>
                            <br />✦ 42% routing efficiency ✦ Zero-latency state management ✦ 12ms data updates
                        </div>

                        <div>
                            <span className="text-yellow-400">2025</span>
                            <br />
                            <span className="font-bold text-white">NovaPay</span> — FinTech Dashboard Engine
                            <br />
                            Refactored micro-frontend transactions dashboard featuring modular widget compositions and dynamic charts.
                            <br />
                            <span className="text-gray-400">Frontend Dev • Data Viz • FinTech</span>
                            <br />✦ 65% faster TTFB ✦ 99.9% uptime tracking ✦ Next.js 15 SSR
                        </div>
                    </div>
                );
                break;

            case "/skills":
                handleNavigation("/", "#skills");
                output = (
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
                                <div className="mt-1 h-[2px] w-full bg-neutral-900">
                                    <div className="h-full bg-cyan-500" style={{ width: '85%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-neutral-400">
                                    <span>MERN Stack</span>
                                    <span className="text-emerald-400">80%</span>
                                </div>
                                <div className="mt-1 h-[2px] w-full bg-neutral-900">
                                    <div className="h-full bg-emerald-500" style={{ width: '80%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-neutral-400">
                                    <span>Docker & DevOps</span>
                                    <span className="text-blue-400">40%</span>
                                </div>
                                <div className="mt-1 h-[2px] w-full bg-neutral-900">
                                    <div className="h-full bg-blue-500" style={{ width: '40%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-neutral-400">
                                    <span>Salesforce CRM</span>
                                    <span className="text-amber-400">75%</span>
                                </div>
                                <div className="mt-1 h-[2px] w-full bg-neutral-900">
                                    <div className="h-full bg-amber-500" style={{ width: '75%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-neutral-400">
                                    <span>UI & Visual Design</span>
                                    <span className="text-sky-400">75%</span>
                                </div>
                                <div className="mt-1 h-[2px] w-full bg-neutral-900">
                                    <div className="h-full bg-sky-500" style={{ width: '75%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-neutral-400">
                                    <span>Core Java</span>
                                    <span className="text-red-400">60%</span>
                                </div>
                                <div className="mt-1 h-[2px] w-full bg-neutral-900">
                                    <div className="h-full bg-red-500" style={{ width: '60%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-neutral-400">
                                    <span>Motion Graphics</span>
                                    <span className="text-purple-400">65%</span>
                                </div>
                                <div className="mt-1 h-[2px] w-full bg-neutral-900">
                                    <div className="h-full bg-purple-500" style={{ width: '65%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-neutral-400">
                                    <span>Component Architecture</span>
                                    <span className="text-green-400">85%</span>
                                </div>
                                <div className="mt-1 h-[2px] w-full bg-neutral-900">
                                    <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-neutral-800 pt-3">
                            <p className="text-[11px] text-neutral-500 mb-1">// environment stack</p>
                            <p className="leading-relaxed text-neutral-400">
                                <span className="text-neutral-200 font-semibold">Languages & Frameworks:</span> Core Java • JavaScript • NextJs • MySql • TypeScript • Node.js • Express • Material UI • React •  HTML/CSS • Figma <br />
                                <span className="text-neutral-200 font-semibold">Tools & Infrastructure:</span> Git • GitHub • CMS Integrations • REST APIs
                            </p>
                        </div>
                    </div>
                );
                break;

            case "ls":
                output = (
                    <div className="mt-2 whitespace-pre">
                        drwxr-xr-x akhil design-systems.exe{"\n"}
                        drwxr-xr-x akhil ux-research.doc{"\n"}
                        -rwxr-xr-x akhil figma-mastery.cfg{"\n"}
                        -rw-r--r-- akhil pixel-perfection.so{"\n"}
                        -rwxr-xr-x akhil strategic-thinking.bin{"\n"}
                        drwxr-xr-x akhil workshop-facilitation/{"\n"}
                        -rw-r--r-- akhil accessibility.a11y{"\n"}
                        -rwxr-xr-x akhil brand-identity.svg{"\n"}
                        -rw-r--r-- akhil coffee-dependency.lock{"\n"}
                        -rw------- akhil secret-design-sauce.enc
                    </div>
                );
                break;
            case "whoami":
                output = (
                    <div className="mt-2">
                        You're the person about to hire a great designer.<br />
                        (Trust the terminal. It knows things.)<br /><br />
                        Type /secrets if you like finding hidden things.
                    </div>
                );
                break;
            case "/secrets":
                output = (
                    <div className="mt-2 space-y-2">
                        <div><span className="font-bold text-white">Secret Commands</span><br />Shhh... you found the cheat sheet.</div>
                        <div className="grid grid-cols-[120px_1fr] gap-x-2">
                            <span className="text-blue-400">sudo hire akhil</span><span>Fake contract with progress bar</span>
                            <span className="text-blue-400">rm -rf doubts</span><span>Remove all your doubts</span>
                            <span className="text-blue-400">/matrix</span><span>Matrix green rain</span>
                            <span className="text-blue-400">/figma</span><span>Where I actually live</span>
                            <span className="text-blue-400">/coffee</span><span>Design fuel status</span>
                            <span className="text-blue-400">ls</span><span>Skills as Linux files</span>
                            <span className="text-blue-400">cat readme.md</span><span>A hidden personal message</span>
                            <span className="text-blue-400">ping akhil</span><span>Am I available? Find out</span>
                            <span className="text-blue-400">git log</span><span>Totally real commit history</span>
                            <span className="text-blue-400">whoami</span><span>The terminal knows you</span>
                            <span className="text-blue-400">exit</span><span>Try to leave. I dare you.</span>
                            <span className="text-blue-400">/konami</span><span>Party mode with confetti</span>
                            <span className="text-blue-400">↑↑↓↓←→←→BA</span><span>Konami code on keyboard</span>
                        </div>
                    </div>
                );
                break;
            case "/help":
                output = (
                    <div className="mt-2 space-y-4">
                        <div><span className="font-bold text-white">Available Commands</span></div>
                        <div>
                            <span className="font-bold text-white">Navigation</span>
                            <div className="grid grid-cols-[120px_1fr] gap-x-2 mt-1 text-gray-300">
                                <span className="text-blue-400">/help</span><span>List all available commands</span>
                                <span className="text-blue-400">/about</span><span>Who is Akhil Shetty M?</span>
                                <span className="text-blue-400">/work</span><span>Featured projects & case studies</span>
                                <span className="text-blue-400">/clients</span><span>Companies I've worked with</span>
                                <span className="text-blue-400">/skills</span><span>Expertise & capabilities</span>
                                <span className="text-blue-400">/philosophy</span><span>My design philosophy</span>
                                <span className="text-blue-400">/social</span><span>Social profiles & links</span>
                                <span className="text-blue-400">/contact</span><span>Get in touch</span>
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
                        <div>Aliases: /portfolio, /projects, /me, /hire, /call, /mail<br />Tip: Use ↑↓ arrows for command history, Tab for autocomplete</div>
                    </div>
                );
                break;
            case "/skills":
                handleNavigation("/", "#skills");
                output = "Navigating to skills section...";
                break;
            case "/socials":
            case "/social":
                handleNavigation("/", "#socials");
                output = "Navigating to socials...";
                break;
            case "clear":
                setHistory([]);
                return;
            case "close":
            case "exit":
                handleClose();
                return;
            case "":
                break;
            default:
                output = `zsh: command not found: ${command}. Type /help for available commands.`;
        }

        setHistory((prev) => [...prev, { command: cmd, output }]);
    };

    const handleCommandSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            executeCommand(inputValue);
        }
        setInputValue("");
    };

    const handleClose = () => {
        setAnimationState("closed");
        setTimeout(() => { setRender(false); onClose(); }, 300);
    };

    const handleMinimize = () => {
        setAnimationState("minimized");
        setTimeout(() => { setRender(false); onClose(); }, 300);
    };

    const handleExpand = () => {
        setIsExpanded((prev) => !prev);
        setDimen(isExpanded ? "15x40" : "27x88");
    };

    if (!render || !mounted) return null;

    const getAnimationClasses = () => {
        if (animationState === "open") return "opacity-100 scale-100 translate-y-0";
        if (animationState === "minimized") return "opacity-0 scale-50 translate-y-64";
        return "opacity-0 scale-95 translate-y-0";
    };

    const getProgressBar = () => {
        const fill = Math.min(100, bootProgress);
        const blocks = Math.floor(fill / 4);
        // return `[${" █".repeat(blocks)}${" ".repeat(25 - blocks)}] ${fill}%`;
        return (
            <>
                {`[`}
                {Array.from({ length: blocks }, (_, i) => (
                    <FaCodeMerge key={i} size={10} className="inline" />
                ))}
                {`${" ".repeat(25 - blocks)}] ${fill}%`}
            </>
        );

    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
            <div className={`pointer-events-auto relative flex flex-col bg-[#1e1e1e] border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform ${getAnimationClasses()} ${isExpanded ? "w-[800px] h-[500px]" : "w-[600px] h-[400px]"}`}>

                <div className="h-8 bg-[#2d2d2d] flex items-center px-4 w-full select-none shrink-0">
                    <div className="flex space-x-2">
                        <button onClick={handleClose} className="w-3.5 h-3.5 bg-[#ff5f56] rounded-full hover:bg-[#ff5f56]/80 flex items-center justify-center transition-colors group/btn">
                            <span className="text-[8px] text-black/60 opacity-0 group-hover/btn:opacity-100">✕</span>
                        </button>
                        <button onClick={handleMinimize} className="w-3.5 h-3.5 bg-[#ffbd2e] rounded-full hover:bg-[#ffbd2e]/80 flex items-center justify-center transition-colors group/btn">
                            <span className="text-[10px] text-black/60 opacity-0 group-hover/btn:opacity-100 leading-none mb-1">-</span>
                        </button>
                        <button onClick={handleExpand} className="w-3.5 h-3.5 bg-[#27c93f] rounded-full hover:bg-[#27c93f]/80 flex items-center justify-center transition-colors group/btn">
                            <span className="text-[8px] text-black/60 opacity-0 group-hover/btn:opacity-100 leading-none">⤢</span>
                        </button>
                    </div>
                    <div className="flex-1 text-center text-gray-400 text-xs font-medium">
                        akhilshettym@macbook-pro --zsh-{dimen}
                    </div>
                </div>

                <div
                    className="flex-1 p-4 bg-[#1e1e1e] text-[#00ff00] font-mono text-xs overflow-auto cursor-text scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    onClick={handleTerminalClick}
                >
                    {bootPhase !== "complete" && (
                        <div className="flex flex-col space-y-1">
                            <p>Initializing portfolio...</p>
                            {bootProgress > 20 && <p>Loading design tokens...</p>}
                            {bootProgress > 40 && <p>Mounting component library...</p>}
                            {bootProgress > 60 && (
                                <>
                                    <p className="whitespace-pre">Boot sequence running</p>
                                    <p className="whitespace-pre">{getProgressBar()} {bootProgress === 100 && "done"}</p>
                                </>
                            )}
                            {bootPhase === "ready" && (
                                <div className="mt-4 animate-fade-in space-y-1">
                                    <p>Initializing connection to core product architecture...</p>
                                    <p>Design token frameworks: operational</p>
                                    <p>UX research matrix: synchronized</p>
                                    <p>Security protocol: zero vulnerabilities detected</p>
                                    <p>Strategic alignment modules: engaged</p>

                                    <br />
                                    <p className="text-white font-bold">akhilshettym v1.0.0 --ready</p>
                                    <p className="animate-pulse text-yellow-400">Press Enter to continue...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {bootPhase === "complete" && (
                        <div className="flex flex-col space-y-1">
                            <p>Last login: {new Date().toString().split(" GMT")[0].toLowerCase()} on ttys000.</p>
                            <br />
                            <div className="mb-4">
                                <p className="text-white font-bold mb-1">Capabilities</p>
                                <div className="grid grid-cols-[60px_1fr] gap-x-2 text-gray-400">
                                    <span>Design</span><span>: Systems, UX/UI, Enterprise Dashboards</span>
                                    <span>Lead</span><span>: Teams, Workshops, Mentoring</span>
                                    <span>Build</span><span>: Web, Mobile, Branding</span>
                                    <span>Ship</span><span>: SaaS, Enterprise, Consumer</span>
                                </div>
                                <br />
                                <p className="text-white font-bold mb-1">Navigation</p>
                                <div className="text-gray-400 space-y-1">
                                    <p>/about</p>
                                    <p>/work</p>
                                    <p>/clients</p>
                                    <p>/skills</p>
                                    <p className="mt-2 text-gray-500">... /help for all commands</p>
                                </div>
                            </div>

                            {history.map((item, i) => (
                                <div key={i} className="mb-2">
                                    <div className="flex items-center">
                                        <span className="text-blue-400 mr-2">user@macbook:~$</span>
                                        <span className="text-white">{item.command}</span>
                                    </div>
                                    {item.output && (
                                        <div className="text-gray-300 mt-1">
                                            {typeof item.output === "string" ? (
                                                <span className="whitespace-pre-wrap">{item.output}</span>
                                            ) : (
                                                item.output
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <form onSubmit={handleCommandSubmit} className="flex items-center mt-1">
                                <span className="text-blue-400 mr-2">user@macbook:~$</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="bg-transparent border-none outline-none text-[#00ff00] flex-1 caret-[#00ff00]"
                                    autoFocus
                                    spellCheck="false"
                                    autoComplete="off"
                                />
                            </form>
                            <div ref={terminalEndRef} />
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConsoleModal;