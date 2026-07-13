import { createPortal } from "react-dom";
import { FaCodeMerge } from "react-icons/fa6";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { logAbout, logAchievements, logCatReadme, logCoffee, logCreate, logExperience, logGithub, logHelp, logInstagram, logLinkedin, logLocation, logls, logMail, logPhilosophy, logPingAkhil, logProjects, logrmrf, logSalesforce, logSecrets, logSkills, logSocials, logSudoHire, logWhoAmI } from "@/utils/funct-utils";

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

        const nonSlashCommands = ["clear", "close", "ls", "whoami", "exit", "sudo", "rm", "cat", "ping", "git", "work"];
        if (!command.startsWith("/") && !nonSlashCommands.some(c => command.startsWith(c)) && command !== "") {
            command = "/" + command;
        }

        let output = "";

        const handleNavigation = (path, hash) => {
            const scrollToElement = () => {
                const elementId = hash.replace("#", "");
                const element = document.getElementById(elementId);
                if (element) {
                    requestAnimationFrame(() => {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                    });
                } else {
                    setTimeout(() => {
                        const el = document.getElementById(elementId);
                        if (el) {
                            el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                    }, 500);
                }
            };

            if (pathname === path) {
                if (window.location.hash === hash) {
                    scrollToElement();
                } else {
                    window.location.hash = hash;
                    setTimeout(scrollToElement, 100);
                }
            } else {
                router.push(`${path}${hash}`);
                setTimeout(scrollToElement, 800);
            }
        };

        switch (command) {
            case "/about":
                handleNavigation("/", "#about");
                output = logAbout();
                break;

            case "/skills":
                handleNavigation("/", "#skills");
                output = logSkills();
                break;

            case "/achievements":
                handleNavigation("/", "#achievements");
                output = logAchievements();
                break;

            case "/projects":
                handleNavigation("/work", "#projects");
                output = logProjects();
                break;

            case "/experience":
                handleNavigation("/work", "#experience");
                output = logExperience();
                break;

            case "/github":
                handleNavigation("/work", "#github");
                output = logGithub();
                break;

            case "/connect":
            case "/create":
                handleNavigation("/start", "");
                output = logCreate();
                break;

            case "/philosophy":
                output = logPhilosophy();
                break;

            case "/mail":
                output = logMail();
                break;

            case "/linkedin":
                output = logLinkedin();
                break;

            case "/instagram":
                output = logInstagram();
                break;

            case "/salesforce":
                output = logSalesforce();
                break;

            case "/socials":
                output = logSocials();
                break;

            case "sudo hire akhil":
                output = logSudoHire();
                break;

            case "rm -rf doubts":
                output = logrmrf();
                break;

            case "/coffee":
                output = logCoffee();
                break;

            case "cat readme.md":
                output = logCatReadme();
                break;

            case "ping akhil":
                output = logPingAkhil();
                break;

            case "/secrets":
                output = logSecrets();
                break;

            case "me":
            case "whoami":
                output = logWhoAmI();
                break;

            case "/location":
                output = logLocation();
                break;

            case "ls":
                output = logls();
                break;

            case "/help":
                output = logHelp();
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
        <div className="fixed inset-0 z-9999 flex items-center justify-center pointer-events-none">
            <div className={`pointer-events-auto relative flex flex-col bg-[#1e1e1e] border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform ${getAnimationClasses()} ${isExpanded ? "w-200 h-125" : "w-150 h-100"}`}>

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
                    className="flex-1 p-4 bg-[#1e1e1e] text-[#00ff00] font-mono text-xs overflow-auto cursor-text scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]"
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
                                <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="bg-transparent border-none outline-none text-[#00ff00] flex-1 caret-[#00ff00]" autoFocus spellCheck="false" autoComplete="off" />
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