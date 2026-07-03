"use client";

import dynamic from "next/dynamic";
import React from "react";

const MySocialsLazy = dynamic(() => import("@/components/MySocials"), {
    ssr: false,
    loading: () => (
        <div style={{ height: "480px" }} className="animate-pulse bg-zinc-900" />
    ),
});

export default MySocialsLazy;