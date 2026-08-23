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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { root, rootMargin, threshold },
    );

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

      const observer = new IntersectionObserver(
        ([entry]) => {
          setVisibleElements((prev) => {
            const next = new Set(prev);
            if (entry.isIntersecting) {
              next.add(i);
            } else {
              next.delete(i);
            }
            return next;
          });
        },
        { threshold: 0.1 },
      );

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
  const [isVisible, setIsVisible] = useState(false);
  const [shouldPreload, setShouldPreload] = useState(false);
  const ref = useRef(null);
  const once = options.once ?? true;
  const root = options.root ?? null;
  const rootMargin = options.rootMargin ?? "0px";
  const preloadMargin = options.preloadMargin ?? "700px 0px";
  const threshold = options.threshold ?? 0;
  const preloadThreshold = options.preloadThreshold ?? 0;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, root, rootMargin, threshold]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldPreload(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setShouldPreload(false);
        }
      },
      { root, rootMargin: preloadMargin, threshold: preloadThreshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, preloadMargin, preloadThreshold, root]);

  return {
    ref,
    shouldRender: isVisible,
    shouldPreload,
    isVisible,
  };
}
