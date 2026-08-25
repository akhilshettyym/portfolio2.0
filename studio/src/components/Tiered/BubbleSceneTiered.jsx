"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const LoadingFallback = () => <div style={{ width: "100%", minHeight: "400px", background: "transparent" }} />;

const BubbleScene = dynamic(() => import("@/components/sections/BubbleScene"), {
  loading: LoadingFallback,
  ssr: false,
});

export default function BubbleSceneTiered(props) {
  const { isTier2, ready } = usePerformanceTier();

  if (!ready) {
    return <LoadingFallback />;
  }

  return (
    <div style={{ background: "transparent", minHeight: "400px" }}>
      <Suspense fallback={<LoadingFallback />}>
        <BubbleScene {...props} isTieredWrapper={isTier2} />
      </Suspense>
    </div>
  );
}
