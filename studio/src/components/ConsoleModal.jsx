import { createPortal } from "react-dom";
import { runConsoleCommand } from "@/utils/console";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, useRef, memo, useCallback } from "react";

const AnimatedOutput = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`transition-all duration-500 ease-out origin-top ${isVisible ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-75 -translate-y-2"}`}>
      {children}
    </div>
  );
};

function ConsoleModal({ isOpen, onClose }) {
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
  const [bootLogs, setBootLogs] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hint, setHint] = useState("/about");

  const pendingScrollRef = useRef(null);

  const HINTS = ["/skills", "/projects", "/experience", "/socials", "whoami", "/secrets", "clear", "/philosophy"];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handle = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(handle);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const renderHandle = window.setTimeout(() => setRender(true), 0);
      setTimeout(() => setAnimationState("open"), 10);

      if (bootPhase === "loading") {
        setBootProgress(0);
        setBootLogs(["$ npm install @akhilshetty/portfolio-core", "npm info it worked if it ends with ok"]);
      }
      return () => window.clearTimeout(renderHandle);
    } else {
      setAnimationState("closed");
      const closeHandle = window.setTimeout(() => setRender(false), 300);
      return () => window.clearTimeout(closeHandle);
    }
  }, [isOpen, bootPhase]);

  useEffect(() => {
    if (isOpen && bootPhase === "loading") {
      const mockNpmLogs = [
        "npm http fetch GET 200 https://registry.npmjs.org/@akhilshetty/portfolio-core 340ms",
        "npm info lifecycle @akhilshetty/portfolio-core@1.0.0~preinstall: @akhilshetty/portfolio-core@1.0.0",
        "npm http fetch GET 200 https://registry.npmjs.org/react-design-tokens 120ms",
        "npm http fetch GET 200 https://registry.npmjs.org/next-router-matrix 210ms",
        "extract:@akhilshetty/portfolio-core: extract tree created",
        "extract:react-design-tokens: lift-up modules completed",
        "npm info sub-dependencies resolving tree structure...",
        "finishing installation layout structure...",
      ];

      let step = 0;
      const interval = setInterval(() => {
        setBootProgress((prev) => {
          const nextProgress = prev + Math.floor(Math.random() * 15) + 6;

          if (nextProgress > step * 12 && step < mockNpmLogs.length) {
            setBootLogs((logs) => [...logs, mockNpmLogs[step]]);
            step++;
          }

          if (nextProgress >= 100) {
            clearInterval(interval);
            setBootLogs((logs) => [
              ...logs,
              "✔ Loaded 34 dependencies in 1.12s",
              "added 412 packages from 184 contributors and audited 413 packages in 1.45s",
              "found 0 vulnerabilities",
            ]);
            setTimeout(() => setBootPhase("ready"), 300);
            return 100;
          }
          return nextProgress;
        });
      }, 90);
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
    if (bootPhase === "ready") {
      setBootPhase("complete");
    } else if (bootPhase === "complete" && inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, bootPhase, bootLogs, isProcessing]);

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

    setHistory((prev) => [...prev, { command: cmd, output: null, processing: true }]);
    setIsProcessing(true);
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    setHint(HINTS[Math.floor(Math.random() * HINTS.length)]);

    setTimeout(
      () => {
        const output = runConsoleCommand(cmd, {
          navigate,
          close: handleClose,
          clear: () => setHistory([]),
        });

        setHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { command: cmd, output, processing: false };
          return updated;
        });
        setIsProcessing(false);
      },
      400 + Math.random() * 400,
    );
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isProcessing) {
      executeCommand(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (bootPhase !== "complete" || isProcessing) return;

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
    setTimeout(() => {
      setRender(false);
      onClose();
    }, 300);
  };

  const handleMinimize = () => {
    setAnimationState("minimized");
    setTimeout(() => {
      setRender(false);
      onClose();
    }, 300);
  };

  const handleExpand = () => {
    setIsExpanded((prev) => !prev);
    setDimen(isExpanded ? "15x40" : "24x80");
  };

  if (!render || !mounted) return null;

  const getAnimationClasses = () => {
    if (animationState === "open") return "opacity-100 scale-100 translate-y-0";
    if (animationState === "minimized") return "opacity-0 scale-50 translate-y-64";
    return "opacity-0 scale-95 translate-y-0";
  };

  const getProgressBar = () => {
    const fill = Math.min(100, bootProgress);
    const totalBlocks = 25;
    const filledBlocks = Math.floor((fill / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    const bar =
      "=".repeat(Math.max(0, filledBlocks - 1)) +
      (filledBlocks > 0 && fill < 100 ? ">" : fill === 100 ? "=" : "") +
      " ".repeat(emptyBlocks);
    return `[${bar}] ${fill}%`;
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all duration-300">
      <div
        className={`relative flex flex-col bg-[#0c0c0c] border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform ${getAnimationClasses()} ${isExpanded ? "w-[60vw] h-[60vh]" : "w-150 h-100 max-w-[95vw] max-h-[85vh]"}`}>
        <div className="h-8 bg-[#1e1e1e] border-b border-white/5 flex items-center px-4 w-full select-none shrink-0">
          <div className="flex space-x-2">
            <button
              onClick={handleClose}
              className="w-3.5 h-3.5 bg-[#ff5f56] rounded-full hover:bg-[#ff5f56]/80 flex items-center justify-center transition-colors group/btn">
              <span className="text-[8px] text-black/60 opacity-0 group-hover/btn:opacity-100">✕</span>
            </button>
            <button
              onClick={handleMinimize}
              className="w-3.5 h-3.5 bg-[#ffbd2e] rounded-full hover:bg-[#ffbd2e]/80 flex items-center justify-center transition-colors group/btn">
              <span className="text-[10px] text-black/60 opacity-0 group-hover/btn:opacity-100 leading-none mb-1">
                -
              </span>
            </button>
            <button
              onClick={handleExpand}
              className="w-3.5 h-3.5 bg-[#27c93f] rounded-full hover:bg-[#27c93f]/80 flex items-center justify-center transition-colors group/btn">
              <span className="text-[8px] text-black/60 opacity-0 group-hover/btn:opacity-100 leading-none">⤢</span>
            </button>
          </div>
          <div className="flex-1 text-center text-gray-400 text-xs font-mono font-medium">
            akhilshettym@macbook-pro --zsh-{dimen}
          </div>
        </div>

        <div
          className="flex-1 min-h-0 p-5 bg-[#0c0c0c] text-green-400 font-mono text-xs md:text-sm overflow-y-auto overscroll-contain cursor-text select-text pr-3 scrollbar-thin [scrollbar-color:#333_#0c0c0c] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#0c0c0c] [&::-webkit-scrollbar-thumb]:bg-[#333] [&::-webkit-scrollbar-thumb]:rounded"
          onClick={handleTerminalClick}>
          {bootPhase !== "complete" && (
            <div className="flex flex-col space-y-1 opacity-90">
              {bootLogs.map((log, index) => (
                <p key={index} className="text-gray-300 select-none">
                  {log}
                </p>
              ))}

              {bootPhase === "loading" && (
                <div className="mt-2">
                  <p className="whitespace-pre text-cyan-400 select-none">{getProgressBar()}</p>
                </div>
              )}

              {bootPhase === "ready" && (
                <div className="mt-6 animate-fade-in space-y-2">
                  <p className="text-white font-bold select-none">
                    Environment verified. Shell initialization script complete.
                  </p>
                  <p className="animate-pulse text-yellow-400 cursor-pointer select-none">
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
                <p className="text-gray-400 mt-1">
                  Type <span className="text-cyan-400 font-bold">/help</span> to see available commands.
                </p>
              </div>

              {history.map((item, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-center">
                    <span className="text-emerald-400 mr-2 font-semibold">user@macbook:~$</span>
                    <span className="text-white">{item.command}</span>
                  </div>

                  {item.processing ? (
                    <div className="text-gray-500 mt-1 animate-pulse">Processing command...</div>
                  ) : item.output ? (
                    <AnimatedOutput>
                      <div className="text-gray-300 mt-2">
                        {typeof item.output === "string" ? (
                          <span className="whitespace-pre-wrap">{item.output}</span>
                        ) : (
                          item.output
                        )}
                      </div>
                    </AnimatedOutput>
                  ) : null}
                </div>
              ))}

              {!isProcessing && (
                <div className="mt-2 group">
                  <div className="text-gray-500 text-[10px] mb-1 opacity-60 select-none">
                    💡 Recommended: <span className="text-gray-400">{hint}</span>
                  </div>
                  <form onSubmit={handleCommandSubmit} className="flex items-center relative">
                    <span className="text-emerald-400 mr-2 font-semibold select-none">user@macbook:~$</span>
                    <div className="relative flex-1 flex items-center">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent border-none outline-none text-white w-full caret-transparent absolute inset-0 z-10"
                        autoFocus
                        spellCheck="false"
                        autoComplete="off"
                      />
                      <span className="text-transparent whitespace-pre pointer-events-none font-mono">
                        {inputValue}
                      </span>
                      <span className="h-[1.2em] w-2 bg-gray-400 animate-pulse pointer-events-none" />
                    </div>
                  </form>
                </div>
              )}
              <div ref={terminalEndRef} className="h-4 w-full" />
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default memo(ConsoleModal);
