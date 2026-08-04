"use client";

import dynamic from "next/dynamic";
import LazyLoad from "@/components/basic/LazyLoad";
import { Suspense, useEffect, useState } from "react";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const DynamicMySocials = dynamic(() => import("@/components/MySocials"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "500px", background: "#ffffff" }} className="w-full animate-pulse" />,
});

export default function MySocialsTiered(props) {
  const { isMobile } = useDeviceType();
  const [mounted, setMounted] = useState(false);
  const { isTier2, ready } = usePerformanceTier();
  const { ref, shouldRender } = useLazyLoad({ rootMargin: "200px 0px", threshold: 0 });

  useEffect(() => {
    const handle = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(handle);
  }, []);

  if (!mounted || !ready || isTier2 || isMobile) {
    return null;
  }

  if (!shouldRender) {
    return (
      <section id="socials">
        <LazyLoad threshold={0.1} rootMargin="200px 0px" once={true}>
          <div ref={ref} style={{ width: "100%", minHeight: "500px", background: "#ffffff" }} />
        </LazyLoad>
      </section>
    );
  }

  return (
    <section id="socials">
      <LazyLoad threshold={0.1} rootMargin="200px 0px" once={true}>
        <div ref={ref} style={{ width: "100%", background: "#ffffff", position: "relative" }}>
          <Suspense fallback={<div style={{ minHeight: "500px", background: "#ffffff" }} className="w-full" />}>
            <DynamicMySocials {...props} isTieredWrapper={isTier2} />
          </Suspense>
        </div>
      </LazyLoad>
    </section>
  );
}
