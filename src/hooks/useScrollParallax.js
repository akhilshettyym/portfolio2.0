"use client";

import { useRef, useEffect } from "react";
import { useMotionValue, useTransform } from "framer-motion";
import { useLenis } from "@/context/LenisContext";

export function useScrollParallax(speed = 0.3) {
    const ref = useRef(null);
    const lenis = useLenis();

    const scrollY = useMotionValue(0);

    const y = useTransform(scrollY, (v) => v * -speed);

    useEffect(() => {
        if (!lenis) return;

        const update = ({ scroll }) => {
            scrollY.set(scroll);
        };

        lenis.on("scroll", update);

        return () => {
            lenis.off("scroll", update);
        };
    }, [lenis, scrollY]);

    return {
        ref,
        style: { y },
    };
}