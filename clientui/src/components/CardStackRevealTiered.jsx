"use client";

import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CardStackReveal = dynamic(() => import("./CardStackReveal"), {
    loading: () => <div style={{ width: "100%", height: "500px", background: "#0a0a0a" }} />,
    ssr: false,
});

/**
 * Tier-aware CardStackReveal wrapper
 * - Tier 1: Smooth animations, full stacking effects
 * - Tier 2: Simplified animations, lazy loading
 */
export default function CardStackRevealTiered(props) {
    const { isTier2, ready } = usePerformanceTier();
    const { ref, shouldRender } = useLazyLoad();

    if (!ready) {
        return <div ref={ref} style={{ width: "100%", height: "500px", background: "#0a0a0a" }} />;
    }

    // Tier 2: Only render when visible
    if (isTier2 && !shouldRender) {
        return <div ref={ref} style={{ width: "100%", height: "500px", background: "#0a0a0a" }} />;
    }

    return (
        <div ref={ref}>
            <Suspense fallback={<div style={{ width: "100%", height: "500px", background: "#0a0a0a" }} />}>
                <CardStackReveal {...props} isTieredWrapper={isTier2} />
            </Suspense>
        </div>
    );
}