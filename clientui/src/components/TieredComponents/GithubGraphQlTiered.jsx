"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const DynamicGithubGraphQl = dynamic(() => import("@/components/GithubGraphQl"), {
    loading: () => <div style={{ width: "100%", height: "300px", background: "#0a0a0a" }} className="w-full animate-pulse" />,
    ssr: false,
});

const GithubGraphQlTiered = (props) => {
    const { isTier2, ready } = usePerformanceTier();
    const { ref, shouldRender } = useLazyLoad();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !ready) {
        return <div ref={ref} style={{ width: "100%", minHeight: "300px", background: "#0a0a0a" }} />;
    }

    if (isTier2 && !shouldRender) {
        return <div ref={ref} style={{ width: "100%", minHeight: "300px", background: "#0a0a0a" }} />;
    }

    return (
        <div ref={ref} style={{ width: "100%", background: "#0a0a0a", position: "relative" }}>
            <Suspense fallback={<div style={{ width: "100%", height: "300px", background: "#0a0a0a" }} />}>
                <DynamicGithubGraphQl {...props} isTieredWrapper={isTier2} />
            </Suspense>
        </div>
    );
};

export default GithubGraphQlTiered;