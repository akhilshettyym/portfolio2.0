"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const LazyLoad = ({ children, threshold = 0.1, rootMargin = "100px", once = true, placeholder = null, className = "", style = {} }) => {
    
    const containerRef = useRef(null);
    const observerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hasBeenVisible, setHasBeenVisible] = useState(false);
    const shouldReduceMotion = useReducedMotion();

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

    return (
        <div ref={containerRef} className={className} style={style}>
            {shouldRender ? (
                <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 30, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: "100%", height: "100%" }}>
                    {children}
                </motion.div>
            ) : ( placeholder )}
        </div>
    );
};

export default LazyLoad;