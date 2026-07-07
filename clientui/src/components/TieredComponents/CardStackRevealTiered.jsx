"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const CardStackReveal = dynamic(() => import("../CardStackReveal"), {
    // Match fallback background with your layout theme (white)
    loading: () => <div style={{ width: "100%", height: "500px", background: "#ffffff" }} />,
    ssr: false,
});

const CardStackRevealTiered = (props) => {
    const { isTier2, ready } = usePerformanceTier();

    // Pass aggressive intersection properties if your hook supports options
    const { ref, shouldRender } = useLazyLoad({ rootMargin: "200px 0px", threshold: 0 });

    if (!ready) {
        return <div ref={ref} style={{ width: "100%", height: "500px", background: "#ffffff" }} />;
    }

    if (isTier2 && !shouldRender) {
        return <div ref={ref} style={{ width: "100%", height: "500px", background: "#ffffff" }} />;
    }

    return (
        <div ref={ref}>
            <Suspense fallback={<div style={{ width: "100%", height: "500px", background: "#ffffff" }} />}>
                <CardStackReveal {...props} isTieredWrapper={isTier2} />
            </Suspense>
        </div>
    );
}

export default CardStackRevealTiered;