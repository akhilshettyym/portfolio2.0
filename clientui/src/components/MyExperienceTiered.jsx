"use client";

import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const MyExperience = dynamic(() => import("./MyExperience"), {
    loading: () => <div style={{ width: "100%", height: "600px", background: "#0a0a0a" }} />,
    ssr: false,
});

/**
 * Tier-aware MyExperience wrapper
 * - Tier 1: Full interactive experience with all animations
 * - Tier 2: Lazy loads on viewport, simplified interactions
 */
export default function MyExperienceTiered(props) {
    const { isTier2, ready } = usePerformanceTier();
    const { ref, shouldRender } = useLazyLoad();

    if (!ready) {
        return <div ref={ref} style={{ width: "100%", height: "600px", background: "#0a0a0a" }} />;
    }

    // Tier 2: Only render when in viewport
    if (isTier2 && !shouldRender) {
        return <div ref={ref} style={{ width: "100%", height: "600px", background: "#0a0a0a" }} />;
    }

    return (
        <div ref={ref}>
            <Suspense fallback={<div style={{ width: "100%", height: "600px", background: "#0a0a0a" }} />}>
                <MyExperience {...props} isTieredWrapper={isTier2} />
            </Suspense>
        </div>
    );
}