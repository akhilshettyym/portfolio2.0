"use client";

import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const GithubGraphQl = dynamic(() => import("./GithubGraphQl"), {
    loading: () => <div style={{ width: "100%", height: "300px", background: "#0a0a0a" }} />,
    ssr: false,
});

/**
 * Tier-aware GitHub GraphQL wrapper
 * - Tier 1: Full data fetching and rendering
 * - Tier 2: Lazy loads on viewport entry, simplified rendering
 */
export default function GithubGraphQlTiered(props) {
    const { isTier2, ready } = usePerformanceTier();
    const { ref, shouldRender } = useLazyLoad();

    if (!ready) {
        return <div ref={ref} style={{ width: "100%", height: "300px", background: "#0a0a0a" }} />;
    }

    // Tier 2: Lazy load on viewport entry
    if (isTier2 && !shouldRender) {
        return <div ref={ref} style={{ width: "100%", height: "300px", background: "#0a0a0a" }} />;
    }

    return (
        <div ref={ref}>
            <Suspense fallback={<div style={{ width: "100%", height: "300px", background: "#0a0a0a" }} />}>
                <GithubGraphQl {...props} isTieredWrapper={isTier2} />
            </Suspense>
        </div>
    );
}