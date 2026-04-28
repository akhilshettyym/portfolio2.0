"use client";

import { useState, useEffect } from "react";

export default function WordCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isResetting, setIsResetting] = useState(false);

    const words = [
        "CORE JAVA",
        "DATA STRUCTURES",
        "MERN STACK",
        "VERSION CONTROL",
        "SALESFORCE",
        "API INTEGRATIONS",
        "FRAMEWORKS",
        "ARCHITECTURES",
        "DEPLOYMENT",
    ];

    const loopedWords = [...words, ...words];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (currentIndex === words.length) {
            const resetTimeout = setTimeout(() => {
                setIsResetting(true);
                setCurrentIndex(0);

                requestAnimationFrame(() => {
                    setIsResetting(false);
                });
            }, 700);

            return () => clearTimeout(resetTimeout);
        }
    }, [currentIndex, words.length]);

    return (
        <span className="carousel">
            <span className={`carousel-track ${isResetting ? "no-transition" : ""}`} style={{ transform: `translate3d(0, -${currentIndex * 1.2}em, 0)` }}>
                {loopedWords.map((word, index) => {
                    const isActive = index === currentIndex;

                    return (
                        <span key={index} className={`carousel-item ${isActive ? "active" : "inactive"
                            }`}>
                            {word}
                        </span>
                    );
                })}
            </span>
        </span>
    );
}