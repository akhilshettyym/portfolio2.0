"use client";

import { WORDS } from "@/utils/basic-utils";
import { useState, useEffect } from "react";

const WordCarousel = () => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isResetting, setIsResetting] = useState(false);

    const loopedWords = [...WORDS, ...WORDS];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (currentIndex === WORDS.length) {
            const resetTimeout = setTimeout(() => {
                setIsResetting(true);
                setCurrentIndex(0);

                requestAnimationFrame(() => {
                    setIsResetting(false);
                });
            }, 700);

            return () => clearTimeout(resetTimeout);
        }
    }, [currentIndex, WORDS.length]);

    return (
        <span className="carousel">
            <span className={`carousel-track ${isResetting ? "no-transition" : ""}`} style={{ transform: `translate3d(0, -${currentIndex * 1.2}em, 0)` }}>
                {loopedWords.map((word, index) => {
                    const isActive = index === currentIndex;

                    return (
                        <span key={index} className={`carousel-item ${isActive ? "active" : "inactive"}`}>
                            {word}
                        </span>
                    );
                })}
            </span>
        </span>
    );
}

export default WordCarousel;