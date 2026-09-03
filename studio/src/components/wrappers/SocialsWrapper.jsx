"use client";

import React from "react";
import { useDeviceType } from "@/hooks/useDeviceType";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import MySocialsReveal from "@/components/animations/MySocialsReveal";

export default function SocialsWrapper() {

    const { isMobile } = useDeviceType();
    const { isTier2 } = usePerformanceTier();

    if (isTier2 || isMobile) {
        return null;
    }

    return <MySocialsReveal />;
}
