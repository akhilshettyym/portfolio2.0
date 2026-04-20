"use client";

import Link from "next/link";
import { useRef, useState } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomChar() {
    return chars[Math.floor(Math.random() * chars.length)];
}

function scrambleTo(setText, finalText) {
    let frame = 0;

    const original = finalText.split("");

    const interval = setInterval(() => {
        const newText = original
            .map((char, i) => {
                if (i < frame) return original[i];
                return randomChar();
            })
            .join("");

        setText(newText);

        frame += 1;

        if (frame > original.length) {
            clearInterval(interval);
            setText(finalText);
        }
    }, 50);
}

function GlitchNavItem({ href, label }) {
    const [text, setText] = useState(label);
    const resetRef = useRef(null);

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
    <Link
        href={href}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="relative inline-block hover:text-gray-400 transition text-center"
        style={{ width: `${label.length}ch` }}
    >
        {text}
    </Link>
);
}

export default function Navbar() {
    return (
        <nav className="w-full px-6 py-4 flex items-center justify-between bg-black text-white">
            <div className="text-xl font-semibold tracking-wide">
                AKHIL SHETTY
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wider">
                <GlitchNavItem href="#home" label="HOME" />
                <GlitchNavItem href="#about" label="ABOUT" />
                <GlitchNavItem href="#projects" label="PROJECTS" />
                <GlitchNavItem href="#experience" label="EXPERIENCE" />
                <GlitchNavItem href="#achievements" label="ACHIEVEMENTS" />
                <GlitchNavItem href="#contact" label="CONTACT" />
            </div>

            <div>
                <button className="border border-gray-600 px-3 py-1 text-sm rounded hover:bg-white hover:text-black transition">
                    [console]
                </button>
            </div>
        </nav>
    );
}