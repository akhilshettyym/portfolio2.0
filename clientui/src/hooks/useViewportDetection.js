"use client";

import { useEffect, useRef, useState } from "react";

export function useViewportDetection(options = {}) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, {
            threshold: 0.1,
            ...options,
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [options]);

    return { ref, isVisible };
}

export function useViewportTracker(elementCount = 5) {
    const [visibleElements, setVisibleElements] = useState(new Set());
    const refs = useRef(new Map());

    useEffect(() => {
        const observers = new Map();

        for (let i = 0; i < elementCount; i++) {
            const ref = refs.current.get(i);
            if (!ref) continue;

            const observer = new IntersectionObserver(([entry]) => {
                setVisibleElements((prev) => {
                    const next = new Set(prev);
                    if (entry.isIntersecting) {
                        next.add(i);
                    } else {
                        next.delete(i);
                    }
                    return next;
                });
            }, { threshold: 0.1 });

            observer.observe(ref);
            observers.set(i, observer);
        }

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, [elementCount]);

    const getRef = (index) => {
        if (!refs.current.has(index)) {
            refs.current.set(index, null);
        }
        return (el) => {
            refs.current.set(index, el);
        };
    };

    return { getRef, visibleElements };
}

export function useLazyLoad() {
    const { ref, isVisible } = useViewportDetection();

    return {
        ref,
        shouldRender: isVisible,
        isVisible,
    };
}