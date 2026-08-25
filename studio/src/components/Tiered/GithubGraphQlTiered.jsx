"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const LoadingFallback = () => <div style={{ width: "100%", minHeight: "420px", background: "transparent" }} />;

const DynamicGithubGraphQl = dynamic(() => import("@/components/sections/GithubGraphQl"), {
  loading: LoadingFallback,
  ssr: false,
});

export default function GithubGraphQlTiered(props) {
  const { isTier2, ready } = usePerformanceTier();
  const { ref, shouldRender, shouldPreload } = useLazyLoad({
    preloadMargin: "900px 0px",
    rootMargin: "0px",
    threshold: 0.05,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(handle);
  }, []);

  if (!mounted || !ready) {
    return <div ref={ref} style={{ width: "100%", minHeight: "420px", background: "transparent" }} />;
  }

  if (!shouldPreload) {
    return <div ref={ref} style={{ width: "100%", minHeight: "420px", background: "transparent" }} />;
  }

  return (
    <div ref={ref} style={{ width: "100%", background: "transparent", position: "relative" }}>
      <Suspense fallback={<LoadingFallback />}>
        <DynamicGithubGraphQl {...props} isTieredWrapper={isTier2} forceTriggerAnimation={shouldRender} />
      </Suspense>
    </div>
  );
}
