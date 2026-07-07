"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const GithubGraphQl = dynamic(() => import("../GithubGraphQl"), {
    loading: () => <div style={{ width: "100%", height: "300px", background: "#0a0a0a" }} />,
    ssr: false,
});

const GithubGraphQlTiered = (props) => {
    const { isTier2, ready } = usePerformanceTier();
    const { ref, shouldRender } = useLazyLoad();

    if (!ready) {
        return <div ref={ref} style={{ width: "100%", height: "300px", background: "#0a0a0a" }} />;
    }

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

export default GithubGraphQlTiered;