import { createPortal } from "react-dom";
import { FaCodeMerge } from "react-icons/fa6";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import { runConsoleCommand } from "@/utils/console-commands";

const ConsoleModalComponent = ({ isOpen, onClose }) => {
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
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const pendingScrollRef = useRef(null);

    useEffect(() => {
        const handle = window.setTimeout(() => setMounted(true), 0);
        return () => window.clearTimeout(handle);
    }, []);

    useEffect(() => {
        if (isOpen) {
            const renderHandle = window.setTimeout(() => setRender(true), 0);
            setTimeout(() => setAnimationState("open"), 10);

            if (bootPhase === "loading") {
                window.requestAnimationFrame(() => setBootProgress(0));
            }
            return () => window.clearTimeout(renderHandle);
        } else {
            window.requestAnimationFrame(() => setAnimationState("closed"));
            const closeHandle = window.setTimeout(() => setRender(false), 300);
            return () => window.clearTimeout(closeHandle);
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

    const scrollToSection = useCallback(function scrollToElement(elementId, attempts = 0) {
        if (!elementId || attempts > 12) return;

        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            pendingScrollRef.current = null;
            return;
        }

        window.setTimeout(() => scrollToElement(elementId, attempts + 1), 100);
    }, []);

    useEffect(() => {
        if (!pendingScrollRef.current) return;
        scrollToSection(pendingScrollRef.current);
    }, [pathname, scrollToSection]);

    const executeCommand = (cmd) => {
        const navigate = (path, elementId) => {
            if (elementId) pendingScrollRef.current = elementId;

            if (pathname === path) {
                window.requestAnimationFrame(() => scrollToSection(elementId));
            } else {
                router.push(path);
            }
        };

        const output = runConsoleCommand(cmd, {
            navigate,
            close: handleClose,
            clear: () => setHistory([]),
        });

        if (output === undefined) return;

        setHistory((prev) => [...prev, { command: cmd, output }]);
        setCommandHistory((prev) => [...prev, cmd]);
        setHistoryIndex(-1);
    };

    const handleCommandSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            executeCommand(inputValue);
        }
        setInputValue("");
    };

    const handleKeyDown = (e) => {
        if (bootPhase !== "complete") return;

        if (e.key === "ArrowUp") {
            e.preventDefault();
            const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
            setHistoryIndex(newIndex);
            if (newIndex >= 0 && newIndex < commandHistory.length) {
                setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            if (newIndex < 0) {
                setInputValue("");
            } else if (newIndex < commandHistory.length) {
                setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        }
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
                                <p className="text-white font-bold mb-1">Quick Tips</p>
                                <div className="text-yellow-400 space-y-1 mb-3">
                                    <p>💡 Try: <span className="text-cyan-400">/secrets</span> if you like finding hidden things</p>
                                    <p>💡 Use arrow keys to navigate command history</p>
                                    <p>�� Commands work with or without the <span className="text-cyan-400">/</span> prefix</p>
                                </div>
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
                                <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} className="bg-transparent border-none outline-none text-[#00ff00] flex-1 caret-[#00ff00]" autoFocus spellCheck="false" autoComplete="off" />
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

const ConsoleModal = memo(ConsoleModalComponent);

export default ConsoleModal;
