"use client";

import dynamic from "next/dynamic";

const DevTicker = dynamic(() => import("@/components/sections/DevTicker"), { ssr: false });

export default function TickerWrapper() {
  return <DevTicker />
};