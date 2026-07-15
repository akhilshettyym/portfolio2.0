"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const LoadingFallback = () => (
    <div style={{ width: "100%", minHeight: "400px", background: "#ffffff" }} />
);

const BubbleScene = dynamic(() => import("@/components/BubbleScene"), {
    loading: LoadingFallback,
    ssr: false,
});

export default function BubbleSceneTiered(props) {
    const { isTier2, ready } = usePerformanceTier();
    const { ref, shouldRender } = useLazyLoad();

    if (!ready || (isTier2 && !shouldRender)) {
        return <div ref={ref}><LoadingFallback /></div>;
    }

    return (
        <div ref={ref} style={{ background: "#ffffff", minHeight: "400px" }}>
            <Suspense fallback={<LoadingFallback />}>
                <BubbleScene {...props} isTieredWrapper={isTier2} />
            </Suspense>
        </div>
    );
};