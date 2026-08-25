"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const LoadingFallback = () => <div style={{ width: "100%", minHeight: "600px", background: "transparent" }} />;

const MyExperience = dynamic(() => import("../sections/MyExperience"), {
  loading: LoadingFallback,
  ssr: false,
});

export default function MyExperienceTiered(props) {
  const { isTier2, ready } = usePerformanceTier();
  const { ref, shouldPreload } = useLazyLoad({ preloadMargin: "900px 0px", rootMargin: "0px", threshold: 0 });

  if (!ready) {
    return <div ref={ref} style={{ width: "100%", minHeight: "600px", background: "transparent" }} />;
  }

  if (!shouldPreload) {
    return <div ref={ref} style={{ width: "100%", minHeight: "600px", background: "transparent" }} />;
  }

  return (
    <div ref={ref}>
      <Suspense fallback={<LoadingFallback />}>
        <MyExperience {...props} isTieredWrapper={isTier2} />
      </Suspense>
    </div>
  );
}
