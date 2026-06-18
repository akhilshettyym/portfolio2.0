"use client";

import { useEffect } from "react";
import { useLenis } from "@/context/LenisContext";
import { useMotionValue, useTransform } from "framer-motion";

export function useScrollParallax(speed = 0.3) {
    const lenisRef = useLenis();

    const scrollY = useMotionValue(0);
    const y = useTransform(scrollY, (v) => v * -speed);

    useEffect(() => {
        const lenis = lenisRef?.current;

        if (!lenis) return;

        const update = ({ scroll }) => {
            scrollY.set(scroll);
        };

        lenis.on("scroll", update);

        return () => {
            lenis.off("scroll", update);
        };
    }, [lenisRef, scrollY]);

    return {
        style: { y },
    };
}