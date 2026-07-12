"use client";

import "@/styles/global_cursor.css";
import { useEffect, useRef, useState } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const GlobalCursor = () => {
    const cursorRef = useRef(null);
    const frameRef = useRef(null);
    const pointRef = useRef({ x: 0, y: 0 });
    const lastUpdateRef = useRef({ x: 0, y: 0 });
    const { isTier2 } = usePerformanceTier();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const cursor = cursorRef.current;
        const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
        if (!cursor || !supportsFinePointer) return undefined;

        const moveCursor = () => {
            frameRef.current = null;
            const dx = pointRef.current.x - lastUpdateRef.current.x;
            const dy = pointRef.current.y - lastUpdateRef.current.y;

            // Only update if movement is significant (>2px)
            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
                lastUpdateRef.current.x = pointRef.current.x;
                lastUpdateRef.current.y = pointRef.current.y;
                cursor.style.transform = `translate3d(${pointRef.current.x}px, ${pointRef.current.y}px, 0)`;
            }
        };

        const onPointerMove = (event) => {
            pointRef.current.x = event.clientX;
            pointRef.current.y = event.clientY;
            cursor.dataset.active = "true";
            if (!frameRef.current) {
                frameRef.current = requestAnimationFrame(moveCursor);
            }
        };

        const onPointerLeave = () => {
            cursor.dataset.active = "false";
        };

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        document.documentElement.addEventListener("mouseleave", onPointerLeave);

        return () => {
            window.removeEventListener("pointermove", onPointerMove);
            document.documentElement.removeEventListener(
                "mouseleave",
                onPointerLeave,
            );
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, []);

    const currentTier = isMounted ? (isTier2 ? "low" : "high") : "high";

    return (
        <div
            ref={cursorRef}
            className="global-cursor-dot"
            aria-hidden="true"
            data-active="false"
            data-tier={currentTier}
        />
    );
};

export default GlobalCursor;
