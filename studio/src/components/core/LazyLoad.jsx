"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = "0px",
  preloadMargin = "700px 0px",
  once = true,
  placeholder = null,
  className = "",
  style = {},
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldPreload, setShouldPreload] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            visibilityObserver.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldPreload(true);
          if (once) {
            preloadObserver.unobserve(entry.target);
          }
        } else if (!once) {
          setShouldPreload(false);
        }
      },
      { threshold: 0, rootMargin: preloadMargin },
    );

    visibilityObserver.observe(element);
    preloadObserver.observe(element);

    return () => {
      visibilityObserver.disconnect();
      preloadObserver.disconnect();
    };
  }, [threshold, rootMargin, preloadMargin, once]);

  return (
    <div ref={containerRef} className={className} style={style}>
      {shouldPreload ? (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={isVisible || shouldReduceMotion ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
          viewport={{ once: true, amount: 0.1, margin: rootMargin }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", height: "100%" }}>
          {children}
        </motion.div>
      ) : (
        placeholder
      )}
    </div>
  );
}
