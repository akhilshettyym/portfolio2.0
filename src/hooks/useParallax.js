"use client";

import { useEffect, useRef, useState } from "react";

export const useParallax = (factor = 0.5) => {
    const ref = useRef(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const scrollY = window.scrollY;
            const elementTop = rect.top + scrollY;
            const elementHeight = rect.height;
            const windowHeight = window.innerHeight;

            const distance = scrollY + windowHeight - elementTop;
            const progress = distance / (windowHeight + elementHeight);

            const parallaxOffset = (progress - 0.5) * elementHeight * factor;
            setOffset(parallaxOffset);
        };

        let rafId;
        const rafScroll = () => {
            handleScroll();
            rafId = requestAnimationFrame(rafScroll);
        };

        window.addEventListener("scroll", () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(rafScroll);
        }, { passive: true });

        return () => {
            window.removeEventListener("scroll", rafScroll);
            cancelAnimationFrame(rafId);
        };
    }, [factor]);

    return {
        ref,
        offset,
        style: {
            transform: `translateY(${offset}px)`,
            willChange: "transform",
        },
    };
};