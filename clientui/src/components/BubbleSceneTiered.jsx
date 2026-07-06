"use client";

import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic import of BubbleScene to defer loading
const BubbleScene = dynamic(() => import("./BubbleScene"), {
    loading: () => <div style={{ width: "100%", height: "400px", background: "#0a0a0a" }} />,
    ssr: false,
});

/**
 * Tier-aware BubbleScene wrapper
 * - Tier 1: Full rendering, all effects
 * - Tier 2: Lazy loads, deferred rendering, simplified effects
 */
export default function BubbleSceneTiered(props) {
    const { isTier2, ready } = usePerformanceTier();
    const { ref, shouldRender } = useLazyLoad();

    // Don't render if not ready
    if (!ready) {
        return <div ref={ref} style={{ width: "100%", height: "400px", background: "#0a0a0a" }} />;
    }

    // Tier 2: Lazy load on viewport entry
    if (isTier2 && !shouldRender) {
        return <div ref={ref} style={{ width: "100%", height: "400px", background: "#0a0a0a" }} />;
    }

    return (
        <div ref={ref}>
            <Suspense fallback={<div style={{ width: "100%", height: "400px", background: "#0a0a0a" }} />}>
                <BubbleScene {...props} isTieredWrapper={isTier2} />
            </Suspense>
        </div>
    );
}