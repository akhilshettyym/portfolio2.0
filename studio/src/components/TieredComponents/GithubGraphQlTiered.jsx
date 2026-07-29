"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const DynamicGithubGraphQl = dynamic(() => import("@/components/GithubGraphQl"), {
  loading: () => (
    <div style={{ width: "100%", height: "300px", background: "#ffffff" }} className="w-full animate-pulse" />
  ),
  ssr: false,
});

export default function GithubGraphQlTiered(props) {
  const { isTier2, ready } = usePerformanceTier();
  const { ref, shouldRender } = useLazyLoad({ rootMargin: "300px 0px", threshold: 0.05 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(handle);
  }, []);

  if (!mounted || !ready) {
    return <div ref={ref} style={{ width: "100%", minHeight: "420px", background: "#ffffff" }} />;
  }

  if (isTier2 && !shouldRender) {
    return <div ref={ref} style={{ width: "100%", minHeight: "420px", background: "#ffffff" }} />;
  }

  return (
    <div ref={ref} style={{ width: "100%", background: "#ffffff", position: "relative" }}>
      <Suspense fallback={<div style={{ width: "100%", height: "300px", background: "#ffffff" }} />}>
        <DynamicGithubGraphQl {...props} isTieredWrapper={isTier2} forceTriggerAnimation={shouldRender} />
      </Suspense>
    </div>
  );
}
