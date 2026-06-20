"use client";

import { useEffect, useRef, useState } from "react";

/**
 * LazyLoad wrapper component that defers mounting of children until they're visible in viewport
 * Great for heavy 3D scenes, animations, and complex components
 * 
 * @param {React.ReactNode} children - Component to lazy load
 * @param {Object} options - Configuration options
 * @param {string} options.threshold - IntersectionObserver threshold (0-1), default 0.1
 * @param {boolean} options.rootMargin - IntersectionObserver rootMargin, default "100px"
 * @param {boolean} options.once - Only load once, don't unload, default true
 */
const LazyLoad = ({
    children,
    threshold = 0.1,
    rootMargin = "100px",
    once = true,
    placeholder = null
}) => {
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
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(containerRef.current);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    }, [threshold, rootMargin, once]);

    // If once=true and has been visible, always render
    const shouldRender = once ? hasBeenVisible : isVisible;

    return (
        <div ref={containerRef}>
            {shouldRender ? children : placeholder}
        </div>
    );
};

export default LazyLoad;