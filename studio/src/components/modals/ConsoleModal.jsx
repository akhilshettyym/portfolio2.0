"use client";

import { createPortal } from "react-dom";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { runConsoleCommand } from "@/utils/console";
import { usePathname, useRouter } from "next/navigation";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { FaLightbulb } from "react-icons/fa6";

const HINTS = ["/skills", "/projects", "/experience", "/socials", "whoami", "/secrets", "clear", "/philosophy"];

const MOCK_NPM_LOGS = [
  "npm http fetch GET 200 https://registry.npmjs.org/@akhilshetty/portfolio-core 340ms",
  "npm info lifecycle @akhilshetty/portfolio-core@1.0.0~preinstall: @akhilshetty/portfolio-core@1.0.0",
  "npm http fetch GET 200 https://registry.npmjs.org/react-design-tokens 120ms",
  "npm http fetch GET 200 https://registry.npmjs.org/next-router-matrix 210ms",
  "extract:@akhilshetty/portfolio-core: extract tree created",
  "extract:react-design-tokens: lift-up modules completed",
  "npm info sub-dependencies resolving tree structure...",
  "finishing installation layout structure...",
];

function AnimatedOutput({ children }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 50);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className={`origin-top transition-all duration-500 ease-out ${
        isVisible ? "translate-y-0 scale-y-100 opacity-100" : "-translate-y-2 scale-y-75 opacity-0"
      }`}>
      {children}
    </div>
  );
}

function ConsoleModal({ isOpen, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isTier2 } = usePerformanceTier();

  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);
  const pendingScrollRef = useRef(null);
  const mountedRef = useRef(false);
  const commandTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const animationTimerRef = useRef(null);
  const bootReadyTimerRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animationState, setAnimationState] = useState(isOpen ? "closed" : "closed");
  const [isExpanded, setIsExpanded] = useState(false);
  const [bootPhase, setBootPhase] = useState("loading");
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hint, setHint] = useState("/about");

  const clearTimers = useCallback(() => {
    if (commandTimerRef.current) {
      window.clearTimeout(commandTimerRef.current);
      commandTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (animationTimerRef.current) {
      window.clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }
    if (bootReadyTimerRef.current) {
      window.clearTimeout(bootReadyTimerRef.current);
      bootReadyTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    setMounted(true);

    return () => {
      mountedRef.current = false;
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    if (!mounted) return undefined;

    if (isOpen) {
      setShouldRender(true);
      setAnimationState("closed");

      animationTimerRef.current = window.setTimeout(() => {
        if (mountedRef.current) setAnimationState("open");
      }, 10);
    } else {
      setAnimationState("closed");

      closeTimerRef.current = window.setTimeout(() => {
        if (mountedRef.current) setShouldRender(false);
      }, 300);
    }

    return () => {
      if (animationTimerRef.current) {
        window.clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!mounted) return undefined;

    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!isOpen) return undefined;

    setIsExpanded(false);
    setBootPhase("loading");
    setBootProgress(0);
    setBootLogs(["$ npm install @akhilshetty/portfolio-core", "npm info it worked if it ends with ok"]);
    setInputValue("");
    setHistory([]);
    setCommandHistory([]);
    setHistoryIndex(-1);
    setIsProcessing(false);
    setHint("/about");

    return undefined;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || bootPhase !== "loading") return undefined;

    let step = 0;
    const interval = window.setInterval(() => {
      setBootProgress((previous) => {
        const increment = Math.floor(Math.random() * 15) + 6;
        const nextProgress = Math.min(100, previous + increment);

        if (step < MOCK_NPM_LOGS.length && nextProgress >= (step + 1) * 12) {
          const log = MOCK_NPM_LOGS[step];
          step += 1;
          setBootLogs((logs) => [...logs, log]);
        }

        if (nextProgress >= 100) {
          window.clearInterval(interval);

          setBootLogs((logs) => [
            ...logs,
            "✔ Loaded 34 dependencies in 1.12s",
            "added 412 packages from 184 contributors and audited 413 packages in 1.45s",
            "found 0 vulnerabilities",
          ]);

          bootReadyTimerRef.current = window.setTimeout(() => {
            if (mountedRef.current) setBootPhase("ready");
          }, 300);
        }

        return nextProgress;
      });
    }, 90);

    return () => {
      window.clearInterval(interval);
      if (bootReadyTimerRef.current) {
        window.clearTimeout(bootReadyTimerRef.current);
        bootReadyTimerRef.current = null;
      }
    };
  }, [isOpen, bootPhase]);

  const scrollToSection = useCallback(function scrollToElement(elementId, attempts = 0) {
    if (!elementId || attempts > 20) return;

    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      pendingScrollRef.current = null;
      return;
    }

    window.setTimeout(() => scrollToElement(elementId, attempts + 1), 100);
  }, []);

  useEffect(() => {
    const target = pendingScrollRef.current;
    if (target) scrollToSection(target);
  }, [pathname, scrollToSection]);

  useEffect(() => {
    if (!terminalEndRef.current) return;

    terminalEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [history, bootPhase, bootLogs, isProcessing]);

  const handleClose = useCallback(() => {
    clearTimers();
    setAnimationState("closed");

    closeTimerRef.current = window.setTimeout(() => {
      if (mountedRef.current) {
        setShouldRender(false);
        onClose?.();
      }
    }, 300);
  }, [clearTimers, onClose]);

  const handleMinimize = useCallback(() => {
    clearTimers();
    setAnimationState("minimized");

    closeTimerRef.current = window.setTimeout(() => {
      if (mountedRef.current) {
        setShouldRender(false);
        onClose?.();
      }
    }, 300);
  }, [clearTimers, onClose]);

  const handleExpand = useCallback(() => {
    setIsExpanded((previous) => !previous);
  }, []);

  const navigate = useCallback(
    (path, elementId) => {
      if (elementId) pendingScrollRef.current = elementId;

      if (pathname === path) {
        window.requestAnimationFrame(() => {
          if (elementId) scrollToSection(elementId);
        });
        return;
      }

      router.push(path);
    },
    [pathname, router, scrollToSection],
  );

  const executeCommand = useCallback(
    (rawCommand) => {
      const cmd = rawCommand.trim();
      if (!cmd || isProcessing) return;

      setHistory((previous) => [...previous, { command: cmd, output: null, processing: true }]);
      setIsProcessing(true);
      setCommandHistory((previous) => [...previous, cmd]);
      setHistoryIndex(-1);
      setHint(HINTS[Math.floor(Math.random() * HINTS.length)]);

      const delay = 400 + Math.floor(Math.random() * 400);

      commandTimerRef.current = window.setTimeout(() => {
        try {
          const output = runConsoleCommand(
            cmd,
            {
              navigate,
              close: handleClose,
              clear: () => setHistory([]),
            },
            isTier2,
          );

          setHistory((previous) => {
            const next = [...previous];
            const lastIndex = next.length - 1;

            if (lastIndex >= 0) {
              next[lastIndex] = {
                command: cmd,
                output,
                processing: false,
              };
            }

            return next;
          });
        } catch (error) {
          console.error("Console command failed:", error);

          setHistory((previous) => {
            const next = [...previous];
            const lastIndex = next.length - 1;

            if (lastIndex >= 0) {
              next[lastIndex] = {
                command: cmd,
                output: "Command failed. Check the browser console for details.",
                processing: false,
              };
            }

            return next;
          });
        } finally {
          if (mountedRef.current) setIsProcessing(false);
          commandTimerRef.current = null;
        }
      }, delay);
    },
    [handleClose, isProcessing, isTier2, navigate],
  );

  const handleCommandSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const command = inputValue.trim();
      if (!command || isProcessing) return;

      executeCommand(command);
      setInputValue("");
    },
    [executeCommand, inputValue, isProcessing],
  );

  const handleInputKeyDown = useCallback(
    (event) => {
      if (bootPhase !== "complete" || isProcessing) return;

      if (event.key === "ArrowUp") {
        event.preventDefault();

        if (commandHistory.length === 0) return;

        const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - nextIndex] ?? "");
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();

        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);

        if (nextIndex < 0) {
          setInputValue("");
          return;
        }

        setInputValue(commandHistory[commandHistory.length - 1 - nextIndex] ?? "");
      }
    },
    [bootPhase, commandHistory, historyIndex, isProcessing],
  );

  const handleBootEnter = useCallback(
    (event) => {
      if (!isOpen || bootPhase !== "ready" || event.key !== "Enter") return;
      event.preventDefault();
      setBootPhase("complete");
    },
    [bootPhase, isOpen],
  );

  useEffect(() => {
    if (!isOpen || bootPhase !== "ready") return undefined;

    window.addEventListener("keydown", handleBootEnter);
    return () => window.removeEventListener("keydown", handleBootEnter);
  }, [bootPhase, handleBootEnter, isOpen]);

  const handleTerminalClick = useCallback(() => {
    if (bootPhase === "ready") {
      setBootPhase("complete");
      return;
    }

    if (bootPhase === "complete") {
      inputRef.current?.focus();
    }
  }, [bootPhase]);

  const getAnimationClasses = () => {
    if (animationState === "open") {
      return "translate-y-0 scale-100 opacity-100";
    }
    if (animationState === "minimized") {
      return "translate-y-64 scale-50 opacity-0";
    }
    return "translate-y-0 scale-95 opacity-0";
  };

  const getProgressBar = () => {
    const fill = Math.max(0, Math.min(100, bootProgress));
    const totalBlocks = 25;
    const filledBlocks = Math.floor((fill / 100) * totalBlocks);
    const emptyBlocks = Math.max(0, totalBlocks - filledBlocks);

    const bar =
      "=".repeat(Math.max(0, filledBlocks - (fill < 100 ? 1 : 0))) +
      (fill < 100 && filledBlocks > 0 ? ">" : "") +
      " ".repeat(emptyBlocks);

    return `[${bar}] ${fill}%`;
  };

  if (!mounted || !shouldRender || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[1px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal console"
        className={`relative flex max-w-[95vw] max-h-[85vh] flex-col overflow-hidden rounded-xl border border-gray-700/50 bg-[#0c0c0c] shadow-2xl transition-all duration-300 ease-in-out ${getAnimationClasses()} ${
          isExpanded ? "h-[70vh] w-[60vw]" : "h-100 w-150"
        }`}
        onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex h-8 w-full shrink-0 select-none items-center border-b border-white/5 bg-[#1e1e1e] px-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Close terminal"
              onClick={handleClose}
              className="group/btn flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff5f56] transition-colors hover:bg-[#ff5f56]/80">
              <span className="text-[8px] leading-none text-black/60 opacity-0 group-hover/btn:opacity-100">✕</span>
            </button>

            <button
              type="button"
              aria-label="Minimize terminal"
              onClick={handleMinimize}
              className="group/btn flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ffbd2e] transition-colors hover:bg-[#ffbd2e]/80">
              <span className="mb-1 text-[10px] leading-none text-black/60 opacity-0 group-hover/btn:opacity-100">
                -
              </span>
            </button>

            <button
              type="button"
              aria-label={isExpanded ? "Restore terminal size" : "Expand terminal"}
              onClick={handleExpand}
              className="group/btn flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#27c93f] transition-colors hover:bg-[#27c93f]/80">
              <span className="text-[8px] leading-none text-black/60 opacity-0 group-hover/btn:opacity-100">
                {isExpanded ? "↙" : "↗"}
              </span>
            </button>
          </div>

          <div className="flex-1 text-center font-mono text-xs font-medium text-gray-400">
            user@mainframe --zsh-{isExpanded ? "24x80" : "15x40"}
          </div>

          <div className="w-17" aria-hidden="true" />
        </div>

        <div
          className="min-h-0 flex-1 cursor-text overflow-y-auto overscroll-contain bg-[#0c0c0c] p-5 pr-3 font-mono text-[10px] leading-relaxed text-green-400 [scrollbar-color:#333_#0c0c0c] scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#0c0c0c] [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-[#333]"
          onClick={handleTerminalClick}>
          {bootPhase !== "complete" && (
            <div className="flex flex-col space-y-1 opacity-90">
              {bootLogs.map((log, index) => (
                <p key={`${index}-${log}`} className="select-none text-gray-300">
                  {log}
                </p>
              ))}

              {bootPhase === "loading" && (
                <div className="mt-2">
                  <p className="whitespace-pre select-none text-cyan-400">{getProgressBar()}</p>
                </div>
              )}

              {bootPhase === "ready" && (
                <div className="mt-6 space-y-2 animate-fade-in">
                  <p className="select-none font-bold text-white">
                    Environment verified. Shell initialization script complete.
                  </p>
                  <p className="cursor-pointer select-none animate-pulse text-yellow-400">
                    Press Enter or click anywhere here to load session...
                  </p>
                </div>
              )}
            </div>
          )}

          {bootPhase === "complete" && (
            <div className="flex flex-col space-y-1">
              <div className="mb-6">
                <p className="text-gray-400">Last login: {new Date().toString().split(" GMT")[0]} on ttys000</p>
                <p className="mt-1 text-gray-400">
                  Type <span className="font-bold text-cyan-400">/help</span> to see available commands.
                </p>
              </div>

              {history.map((item, index) => (
                <div key={`${item.command}-${index}`} className="mb-4">
                  <div className="flex items-start">
                    <span className="mr-2 shrink-0 font-semibold text-emerald-400">user@macbook:~$</span>
                    <span className="min-w-0 wrap-break-word text-white">{item.command}</span>
                  </div>

                  {item.processing ? (
                    <div className="mt-1 text-gray-500 animate-pulse">Processing command...</div>
                  ) : item.output !== null && item.output !== undefined ? (
                    <AnimatedOutput>
                      <div className="mt-2 text-gray-300">
                        {typeof item.output === "string" ? (
                          <span className="whitespace-pre-wrap wrap-break-word">{item.output}</span>
                        ) : (
                          item.output
                        )}
                      </div>
                    </AnimatedOutput>
                  ) : null}
                </div>
              ))}

              {!isProcessing && (
                <div className="group mt-2">
                  <div className="mb-1 flex items-center gap-1 select-none text-[10px] text-gray-500 opacity-60">
                    <FaLightbulb />
                    <span>Recommended:</span> <span className="text-gray-400">{hint}</span>
                  </div>
                  <form onSubmit={handleCommandSubmit} className="relative flex items-center">
                    <span className="mr-2 shrink-0 select-none font-semibold text-emerald-400">user@macbook:~$</span>

                    <div className="relative flex min-w-0 flex-1 items-center">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        onKeyDown={handleInputKeyDown}
                        className="absolute inset-0 z-10 w-full bg-transparent text-transparent caret-transparent outline-none selection:bg-white/20 selection:text-white"
                        autoFocus
                        spellCheck={false}
                        autoComplete="off"
                        aria-label="Terminal command"
                      />

                      <span
                        className="pointer-events-none min-w-0 whitespace-pre-wrap break-all font-mono text-white"
                        aria-hidden="true">
                        {inputValue}
                      </span>
                      <span
                        className="ml-0 inline-block h-[1.2em] w-2 shrink-0 bg-gray-400 align-middle animate-pulse"
                        aria-hidden="true"
                      />
                    </div>
                  </form>
                </div>
              )}

              <div ref={terminalEndRef} className="h-4 w-full shrink-0" />
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default memo(ConsoleModal);
