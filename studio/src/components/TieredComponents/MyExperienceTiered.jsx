"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useLazyLoad } from "@/hooks/useViewportDetection";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const MyExperience = dynamic(() => import("../MyExperience"), {
  loading: () => (
    <div style={{ width: "100%", height: "600px", background: "#ffffff" }} />
  ),
  ssr: false,
});

export default function MyExperienceTiered(props) {
  const { isTier2, ready } = usePerformanceTier();
  const { ref, shouldRender } = useLazyLoad();

  if (!ready) {
    return (
      <div ref={ref} style={{ width: "100%", height: "600px", background: "#ffffff" }} />
    );
  }

  if (isTier2 && !shouldRender) {
    return (
      <div ref={ref} style={{ width: "100%", height: "600px", background: "#ffffff" }} />
    );
  }

  return (
    <div ref={ref}>
      <Suspense
        fallback={
          <div style={{ width: "100%", height: "600px", background: "#ffffff" }} />
        }
      >
        <MyExperience {...props} isTieredWrapper={isTier2} />
      </Suspense>
    </div>
  );
}
