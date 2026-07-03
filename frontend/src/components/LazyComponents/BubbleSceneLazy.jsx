"use client";

import dynamic from "next/dynamic";
import React from "react";

const BubbleSceneLazy = dynamic(() => import("../BubbleScene"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "480px" }} className="animate-pulse bg-zinc-900" />
  ),
});

export default BubbleSceneLazy;