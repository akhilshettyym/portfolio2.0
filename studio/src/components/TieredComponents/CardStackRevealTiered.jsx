"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const DynamicCardStackReveal = dynamic(() => import("@/components/CardStackReveal"), {
  loading: () => <div style={{ width: "100%", height: "500px", background: "#ffffff" }} />,
  ssr: false,
});

export default function CardStackRevealTiered(props) {
  const { isTier2, ready } = usePerformanceTier();
  const { ref, shouldRender } = useLazyLoad({ rootMargin: "200px 0px", threshold: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(handle);
  }, []);

  if (!mounted || !ready) {
    return <div ref={ref} style={{ width: "100%", minHeight: "500px", background: "#ffffff" }} />;
  }

  if (isTier2 && !shouldRender) {
    return <div ref={ref} style={{ width: "100%", minHeight: "500px", background: "#ffffff" }} />;
  }

  return (
    <div ref={ref} style={{ width: "100%", background: "#ffffff", position: "relative" }}>
      <Suspense fallback={<div style={{ width: "100%", height: "500px", background: "#ffffff" }} />}>
        <DynamicCardStackReveal {...props} isTieredWrapper={isTier2} />
      </Suspense>
    </div>
  );
}
