"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const MySocials = dynamic(() => import("@/components/MySocials"), {
    ssr: false,
    loading: () => (
        <div style={{ height: "480px" }} className="animate-pulse bg-zinc-900" />
    ),
});

const MySocialsTiered = (props) => {
    const { isTier2, ready } = usePerformanceTier();
    const { ref, shouldRender } = useLazyLoad();

    if (!ready) {
        return <div ref={ref} style={{ width: "100%", height: "500px", background: "#0a0a0a" }} />;
    }

    if (isTier2 && !shouldRender) {
        return <div ref={ref} style={{ width: "100%", height: "500px", background: "#0a0a0a" }} />;
    }

    return (
        <div ref={ref}>
            <Suspense fallback={<div style={{ width: "100%", height: "500px", background: "#0a0a0a" }} />}>
                <MySocials {...props} isTieredWrapper={isTier2} />
            </Suspense>
        </div>
    );
}

export default MySocialsTiered;