"use client";

import { useEffect, useRef } from "react";

const GlobalCursor = () => {
    const cursorRef = useRef(null);
    const frameRef = useRef(null);
    const pointRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const cursor = cursorRef.current;
        const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;

        if (!cursor || !supportsFinePointer) return undefined;

        const moveCursor = () => {
            frameRef.current = null;
            cursor.style.transform = `translate3d(${pointRef.current.x}px, ${pointRef.current.y}px, 0)`;
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
            document.documentElement.removeEventListener("mouseleave", onPointerLeave);

            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, []);

    return <div ref={cursorRef} className="global-cursor-dot" aria-hidden="true" data-active="false" />;
};

export default GlobalCursor;
