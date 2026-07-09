"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useDeviceType } from "@/utils/useDeviceType";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const DynamicMySocials = dynamic(() => import("@/components/MySocials"), {
    ssr: false,
    loading: () => <div style={{ minHeight: "500px", background: "#ffffff" }} className="w-full animate-pulse" />,
});

const MySocialsTiered = (props) => {
    const { isMobile } = useDeviceType();
    const [mounted, setMounted] = useState(false);
    const { isTier2, ready } = usePerformanceTier();
    const { ref, shouldRender } = useLazyLoad({ rootMargin: "200px 0px", threshold: 0 });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !ready) {
        return <div ref={ref} style={{ width: "100%", minHeight: "500px", background: "#ffffff" }} />;
    }

    if (isTier2 || isMobile) {
        return null;
    }

    if (!shouldRender) {
        return <div ref={ref} style={{ width: "100%", minHeight: "500px", background: "#ffffff" }} />;
    }

    return (
        <div ref={ref} style={{ width: "100%", background: "#ffffff", position: "relative" }}>
            <Suspense fallback={<div style={{ minHeight: "500px", background: "#ffffff" }} className="w-full" />}>
                <DynamicMySocials {...props} isTieredWrapper={isTier2} />
            </Suspense>
        </div>
    );
};

export default MySocialsTiered;