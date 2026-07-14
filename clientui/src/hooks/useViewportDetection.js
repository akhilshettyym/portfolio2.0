"use client";

import { useEffect, useRef, useState } from "react";

export function useViewportDetection(options = {}) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);
    const once = options.once ?? false;
    const root = options.root ?? null;
    const rootMargin = options.rootMargin;
    const threshold = options.threshold ?? 0.1;

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (once) observer.unobserve(entry.target);
            } else if (!once) {
                setIsVisible(false);
            }
        }, {
            root,
            rootMargin,
            threshold,
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [once, root, rootMargin, threshold]);

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

export function useLazyLoad(options = {}) {
    const { ref, isVisible } = useViewportDetection({ once: true, ...options });

    return {
        ref,
        shouldRender: isVisible,
        isVisible,
    };
}
