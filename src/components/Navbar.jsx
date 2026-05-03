"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomChar() {
    return chars[Math.floor(Math.random() * chars.length)];
}

function scrambleTo(setText, finalText) {
    let frame = 0;
    const original = finalText.split("");

    const interval = setInterval(() => {
        const newText = original
            .map((_char, i) => (i < frame ? original[i] : randomChar()))
            .join("");

        setText(newText);
        frame++;

        if (frame > original.length) {
            clearInterval(interval);
            setText(finalText);
        }
    }, 30);
}

function GlitchNavItem({ href, label, active, delay = 0 }) {
    const [text, setText] = useState(label);
    const resetRef = useRef(null);
    const ref = useRef(null);
    const [width, setWidth] = useState(null);

    useEffect(() => {
        if (ref.current) {
            setWidth(ref.current.offsetWidth);
        }

        const t = setTimeout(() => {
            scrambleTo(setText, label);
        }, delay);

        return () => clearTimeout(t);
    }, []);

    const handleEnter = () => {
        clearTimeout(resetRef.current);
        scrambleTo(setText, label);
    };

    const handleLeave = () => {
        resetRef.current = setTimeout(() => {
            setText(label);
        }, 120);
    };

    return (
        <Link href={href} onMouseEnter={handleEnter} onMouseLeave={handleLeave} className={`px-2 py-2 text-[11px] font-bold uppercase tracking-tight transition text-center inline-flex justify-center items-center min-w-10 
            ${active ? "bg-black text-white"
                : "bg-gray-200/90 text-gray-600 hover:bg-black hover:text-white"
            }`} style={width ? { width: Math.max(width, 60) } : {}}>
            <span ref={ref} className="whitespace-nowrap">{text}</span>
        </Link>
    );
}

export default function Navbar() {
    const [time, setTime] = useState("");
    const [consoleOpen, setConsoleOpen] = useState(false);
    const [hovering, setHovering] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                }),
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const [ipParts, setIpParts] = useState([192, 168, 34, 120]);

    const clamp = (num) => Math.max(0, Math.min(255, num));

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            setIpParts((prev) => {
                const next = [...prev];

                next[0] = clamp((192 + Math.floor(scrollY * 0.01)) % 256);
                next[1] = clamp((168 + Math.floor(scrollY * 0.02)) % 256);
                next[2] = clamp((34 + Math.floor(scrollY * 0.03)) % 256);

                return next;
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const xRatio = e.clientX / window.innerWidth;

            setIpParts((prev) => {
                const next = [...prev];

                next[3] = clamp(Math.floor(xRatio * 255));

                return next;
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const ip = ipParts.join(".");

    const navItems = [
        { label: "INFO", href: "/" },
        { label: "WORK", href: "/work" },
        { label: "START", href: "/start" },
    ];

    function GlitchMini({ text, active }) {
        const [display, setDisplay] = useState(text);

        useEffect(() => {
            if (!active) {
                setDisplay(text);
                return;
            }

            let frame = 0;
            const original = text.split("");

            const interval = setInterval(() => {
                const newText = original
                    .map((c, i) =>
                        i < frame ? c : chars[Math.floor(Math.random() * chars.length)]
                    )
                    .join("");

                setDisplay(newText);
                frame++;

                if (frame > original.length) {
                    clearInterval(interval);
                    setDisplay(text);
                }
            }, 30);

            return () => clearInterval(interval);
        }, [active, text]);

        return <span className="uppercase">{display}</span>;
    }

    return (
        <>
            <div className="sm:hidden fixed inset-x-0 top-0 z-50 bg-white border-b border-black/20 px-4 py-3">
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10">
                            <img src="/akhil.svg" alt="Akhil" className="w-full h-full object-cover" />
                        </div>

                        <nav className="flex gap-2">
                            {navItems.map((item) => (
                                <Link key={item.label} href={item.href} className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wide transition ${pathname === item.href ? "bg-black text-white" : "bg-black/10 text-black"}`}>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="relative flex flex-col items-center justify-center group cursor-pointer" onClick={() => setConsoleOpen((prev) => !prev)}>

                        <div className={`absolute right-full top-1/2 -translate-y-1/2 flex items-center overflow-hidden transition-all duration-300 ease-out ${consoleOpen ? "w-22 opacity-100 mr-2" : "w-0 opacity-0 mr-0"} bg-black text-white`}>
                            <div className="px-3 py-1 text-[10px] font-mono whitespace-nowrap flex items-center">
                                <span className="mr-1">{">_"}</span>
                                <GlitchMini text="console" active={consoleOpen} />
                                <span className="ml-1 animate-blink">|</span>
                            </div>
                        </div>

                        <div className="w-6 h-6 border-2 border-black flex items-center justify-center transition-all duration-200 active:scale-90 group-hover:bg-black">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                <line x2="100" y2="100" stroke="currentColor" strokeWidth="6" className="group-hover:stroke-white" />
                                <line x1="100" y2="100" stroke="currentColor" strokeWidth="6" className="group-hover:stroke-white" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>


            <div className="px-10 pt-1 w-full bg-white text-black relative hidden sm:block">
                <div className="mt-6 flex items-center">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="opacity-0 animate-[navbar-enter_0.65s_cubic-bezier(0.16,1,0.3,1)_0.1s_forwards]">
                            <div className="w-12 h-12 flex items-center justify-center relative group cursor-default">
                                <div className="relative w-full h-full overflow-hidden rounded-md">
                                    <img src="/akhil.svg" alt="Akhil" className="w-full h-full object-cover rotate-2 transition-all duration-300 ease-out group-hover:rotate-0 group-hover:scale-105 group-hover:-translate-y-0.5" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                </div>
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
                            </div>
                        </div>

                        <nav className="flex gap-1 opacity-0 animate-[navbar-enter_0.6s_ease-out_0.2s_forwards]">
                            {navItems.map((item, i) => (
                                <GlitchNavItem key={item.label} href={item.href} label={item.label} active={pathname === item.href} delay={200 + i * 120} />
                            ))}
                        </nav>
                    </div>

                    <div className="w-230 mx-8 border-l border-black/20 overflow-hidden hidden sm:block relative opacity-0 animate-[navbar-enter_0.6s_ease-out_0.3s_forwards]">
                        <div className="pointer-events-none absolute left-0 top-0 h-full w-12 z-10 fade-left" />
                        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 z-10 fade-right" />

                        <div className="absolute right-0 top-0 h-full flex z-20">
                            <div className="w-0.5 bg-black/30" />
                            <div className="w-1.25 bg-black/60" />
                        </div>

                        <div className="relative w-full overflow-hidden">
                            <div className="flex w-max animate-marquee">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="flex whitespace-nowrap text-[12px] uppercase tracking-tight py-2 font-mono">
                                        <span className="mx-6"> Full Stack Developer — 4+ Years Building Production Systems </span>
                                        <span className="mx-6"> MERN Stack Architecture & Implementation </span>
                                        <span className="mx-6"> Scalable Backend Systems & API Design </span>
                                        <span className="mx-6"> Dockerized Workflows & Containerization </span>
                                        <span className="mx-6"> Performance Optimization & Reliability </span>
                                        <span className="mx-6"> End-to-End Feature Ownership </span>
                                        <span className="mx-6"> Clean UI Systems & Interaction Design </span>
                                        <span className="mx-6"> Shipping Fast, Stable Code </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="ml-auto relative flex items-center gap-3 shrink-0 min-w-40 justify-end opacity-0 animate-[navbar-enter_0.6s_ease-out_0.4s_forwards]">
                        <button onClick={() => setConsoleOpen((prev) => !prev)} className={`absolute right-0 top-0 h-full flex items-center z-50 transition-all duration-300 ease-out ${consoleOpen || hovering ? "w-60 opacity-100" : "w-0 opacity-0 pointer-events-none"} bg-black text-white px-4 font-mono text-[11px] overflow-hidden`}>
                            <span className="mr-2">{">_"}</span>
                            <span className="uppercase tracking-wide whitespace-nowrap">console</span>
                            <span className="ml-1 animate-blink">|</span>
                            <span className="ml-2 uppercase tracking-wide whitespace-nowrap opacity-60">run command</span>
                        </button>

                        <div className={`text-right text-[10px] uppercase tracking-widest hidden sm:block leading-tight w-full transition-opacity duration-300 ${consoleOpen || hovering ? "opacity-0" : "opacity-100"}`}>
                            <div className="font-bold"> AKHIL SHETTY M <span className="font-light">, IN</span></div>
                            <div>{time || "—:—:— --"}</div>
                            <div key={ip} className="font-mono text-[8px] font-semibold uppercase tracking-[0.25em] text-black/50"> connection{" "}
                                <span className="inline-block w-25 text-right"> {ip} </span>
                            </div>
                        </div>

                        <div onClick={() => setConsoleOpen((prev) => !prev)} className="w-10 aspect-square border border-black flex items-center justify-center relative overflow-hidden bg-white transition-all duration-300 cursor-pointer z-40 hover:bg-black">
                            <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-300 ${hovering || consoleOpen ? "scale-70 rotate-90" : ""}`} preserveAspectRatio="none">
                                <line x2="100" y2="100" stroke="currentColor" className={`${hovering || consoleOpen ? "stroke-white" : ""}`} />
                                <line x1="100" y2="100" stroke="currentColor" className={`${hovering || consoleOpen ? "stroke-white" : ""}`} />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="mt-6 border-b border-black/20" />
            </div>
        </>
    );
}