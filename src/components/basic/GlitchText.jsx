"use client";

import { useLenis } from "@/context/LenisContext";
import { useEffect, useState, useRef } from "react";

const CHARS =
    "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export default function GlitchText({ text }) {
    const [display, setDisplay] = useState(text);

    const lenis = useLenis();

    const speedRef = useRef(40);
    const mouseIntensity = useRef(0);

    useEffect(() => {
        if (!lenis || typeof lenis.on !== "function") return;

        const update = ({ velocity = 0 }) => {
            const v = Math.abs(velocity);
            speedRef.current = Math.max(15, 40 - v * 0.3);
        };

        lenis.on("scroll", update);

        return () => {
            lenis.off("scroll", update);
        };
    }, [lenis]);

    useEffect(() => {
        const handleMove = (e) => {
            const xRatio = e.clientX / window.innerWidth;
            mouseIntensity.current = Math.abs(xRatio - 0.5);
        };

        window.addEventListener("mousemove", handleMove);

        return () => {
            window.removeEventListener("mousemove", handleMove);
        };
    }, []);

    useEffect(() => {
        let frame = 0;
        let interval;
        let timeout;

        const animate = () => {
            frame = 0;

            interval = setInterval(() => {
                const newText = text
                    .split("")
                    .map((char, i) => {
                        if (i < frame) return char;
                        return randomChar();
                    })
                    .join("");

                setDisplay(newText);

                frame++;

                if (frame > text.length) {
                    clearInterval(interval);

                    timeout = setTimeout(() => {
                        animate();
                    }, 1000);
                }
            }, speedRef.current);
        };

        animate();

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [text]);

    return (
        <span className="inline-block min-w-40 text-right font-mono text-gray-400 transition hover:text-gray-200">
            {display}
        </span>
    );
}