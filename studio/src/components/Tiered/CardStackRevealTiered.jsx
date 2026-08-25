"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const LoadingFallback = () => <div style={{ width: "100%", minHeight: "500px", background: "transparent" }} />;

const DynamicCardStackReveal = dynamic(() => import("@/components/sections/CardStackReveal"), {
  loading: LoadingFallback,
  ssr: false,
});

export default function CardStackRevealTiered(props) {
  const { isTier2, ready } = usePerformanceTier();
  const { ref, shouldPreload } = useLazyLoad({ preloadMargin: "900px 0px", rootMargin: "0px", threshold: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(handle);
  }, []);

  if (!mounted || !ready) {
    return <div ref={ref} style={{ width: "100%", minHeight: "500px", background: "transparent" }} />;
  }

  if (!shouldPreload) {
    return <div ref={ref} style={{ width: "100%", minHeight: "500px", background: "transparent" }} />;
  }

  return (
    <div ref={ref} style={{ width: "100%", background: "transparent", position: "relative" }}>
      <Suspense fallback={<LoadingFallback />}>
        <DynamicCardStackReveal {...props} isTieredWrapper={isTier2} />
      </Suspense>
    </div>
  );
}
