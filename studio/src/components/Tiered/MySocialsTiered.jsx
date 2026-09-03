"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const LoadingFallback = () => <div style={{ width: "100%", minHeight: "500px", background: "transparent" }} />;

const DynamicMySocials = dynamic(() => import("@/components/sections/MySocials"), {
  ssr: false,
  loading: LoadingFallback,
});

export default function MySocialsTiered(props) {
  const { isMobile } = useDeviceType();
  const { isTier2, ready } = usePerformanceTier();

  const [mounted, setMounted] = useState(false);

  const { ref, shouldPreload } = useLazyLoad({
    preloadMargin: "900px 0px",
    rootMargin: "0px",
    threshold: 0,
  });

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => {
      window.clearTimeout(handle);
    };
  }, []);

  if (isTier2 || isMobile) {
    return null;
  }

  if (!mounted || !ready) {
    return <div ref={ref} style={{ width: "100%", minHeight: "500px", background: "transparent" }} />;
  }

  if (!shouldPreload) {
    return <div ref={ref} style={{ width: "100%", minHeight: "500px", background: "transparent" }} />;
  }

  return (
    <div ref={ref} style={{ width: "100%", background: "transparent", position: "relative" }}>
      <Suspense fallback={<LoadingFallback />}>
        <DynamicMySocials {...props} isTieredWrapper={isTier2} />
      </Suspense>
    </div>
  );
}
