"use client";

import { TIER_EVENT, PERF_TIERS } from "@/utils/storage";
import { useCallback, useContext, useEffect, useState } from "react";
import { PerformanceTierContext } from "@/components/core/PerformanceBootstrap";
import { calibratePerformance, getSavedTier, savePerformanceTier } from "@/lib/performance/performanceTier";

export function usePerformanceTier(calibrationDurationMs) {
  const context = useContext(PerformanceTierContext);
  const [tier, setTier] = useState(() => getSavedTier() || PERF_TIERS.LOW);
  const [ready, setReady] = useState(() => Boolean(getSavedTier()));
  const [calibrating, setCalibrating] = useState(false);

  const runCalibration = useCallback(async () => {
    setCalibrating(true);
    const result = await calibratePerformance(calibrationDurationMs);
    savePerformanceTier(result);
    setTier(result);
    setReady(true);
    setCalibrating(false);
    return result;
  }, [calibrationDurationMs]);

  useEffect(() => {
    if (context) return undefined;
    if (ready) return undefined;

    const handle = setTimeout(() => {
      runCalibration();
    }, 0);

    return () => clearTimeout(handle);
  }, [context, ready, runCalibration]);

  useEffect(() => {
    if (context) return undefined;

    const onTierChange = (event) => {
      if (event.detail) setTier(event.detail);
    };

    window.addEventListener(TIER_EVENT, onTierChange);
    return () => window.removeEventListener(TIER_EVENT, onTierChange);
  }, [context]);

  const fallback = {
    tier,
    ready,
    calibrating,
    runCalibration,
    isTier1: tier === PERF_TIERS.HIGH,
    isTier2: tier === PERF_TIERS.LOW,
  };

  return context || fallback;
}
