"use client";

import { useEffect, useState, useRef } from "react";
import { useLenis } from "@/context/LenisContext";

const CHARS = "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export default function GlitchText({ text }) {
    const [display, setDisplay] = useState(text);
    const lenis = useLenis();

    const speedRef = useRef(40);
    const mouseIntensity = useRef(0);

    useEffect(() => {
        if (!lenis) return;

        const update = ({ velocity }) => {
            const v = Math.abs(velocity);

            speedRef.current = Math.max(15, 40 - v * 0.3);
        };

        lenis.on("scroll", update);
        return () => lenis.off("scroll", update);
    }, [lenis]);

    useEffect(() => {
        const handleMove = (e) => {
            const xRatio = e.clientX / window.innerWidth;
            mouseIntensity.current = Math.abs(xRatio - 0.5);
        };

        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    useEffect(() => {
        let frame = 0;
        let interval;

        const animate = () => {
            frame = 0;

            interval = setInterval(() => {
                const newText = text
                    .split("")
                    .map((char, i) => {
                        if (i < frame) return char;

                        if (Math.random() < mouseIntensity.current * 0.5) {
                            return randomChar();
                        }

                        return randomChar();
                    })
                    .join("");

                setDisplay(newText);
                frame++;

                if (frame > text.length) {
                    clearInterval(interval);

                    setTimeout(animate, 1000);
                }
            }, speedRef.current);
        };

        animate();

        return () => clearInterval(interval);
    }, [text]);

    return (
        <span className="font-mono text-gray-400 inline-block min-w-40 text-right hover:text-gray-200 transition">
            {display}
        </span>
    );
}