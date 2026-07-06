"use client";

import { useEffect, useRef, useState } from "react";

const LazyLoad = ({ children, threshold = 0.1, rootMargin = "100px", once = true, placeholder = null }) => {
    const containerRef = useRef(null);
    const observerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hasBeenVisible, setHasBeenVisible] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    setHasBeenVisible(true);

                    if (once) {
                        observer.unobserve(entry.target);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin },
        );

        observerRef.current = observer;
        observer.observe(containerRef.current);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    }, [threshold, rootMargin, once]);

    const shouldRender = once ? hasBeenVisible : isVisible;

    return <div ref={containerRef}>{shouldRender ? children : placeholder}</div>;
};

export default LazyLoad;