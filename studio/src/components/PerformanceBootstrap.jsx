"use client";

import GlobalCursor from "@/components/GlobalCursor";
import { TIER_EVENT, PERF_TIERS } from "@/utils/storage";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { calibratePerformance, getSavedTier, savePerformanceTier } from "@/lib/performance/performanceTier";

export const PerformanceTierContext = createContext(null);

export default function PerformanceBootstrap({ children }) {
  const [tier, setTier] = useState(() => getSavedTier() || PERF_TIERS.LOW);
  const [ready, setReady] = useState(() => Boolean(getSavedTier()));
  const [calibrating, setCalibrating] = useState(false);

  const runCalibration = useCallback(async () => {
    setCalibrating(true);
    try {
      const result = await calibratePerformance();
      savePerformanceTier(result);
      setTier(result);
      setReady(true);
      return result;
    } finally {
      setCalibrating(false);
    }
  }, []);

  useEffect(() => {
    if (ready) return undefined;

    const id = window.setTimeout(() => {
      runCalibration();
    }, 120);
    return () => window.clearTimeout(id);
  }, [ready, runCalibration]);

  useEffect(() => {
    const onTierChange = (event) => {
      if (!event.detail) return;
      setTier(event.detail);
      setReady(true);
    };

    window.addEventListener(TIER_EVENT, onTierChange);
    return () => window.removeEventListener(TIER_EVENT, onTierChange);
  }, []);

  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const first = args[0];
      if (typeof first === "string" && first.includes("THREE.Clock: This module has been deprecated")) {
        return;
      }
      originalWarn(...args);
    };
    return () => {
      console.warn = originalWarn;
    };
  }, []);

  const value = useMemo(
    () => ({
      tier,
      ready,
      calibrating,
      runCalibration,
      isTier1: tier === PERF_TIERS.HIGH,
      isTier2: tier === PERF_TIERS.LOW,
    }),
    [calibrating, ready, runCalibration, tier],
  );

  return (
    <PerformanceTierContext.Provider value={value}>
      <GlobalCursor />
      {children}
    </PerformanceTierContext.Provider>
  );
}
