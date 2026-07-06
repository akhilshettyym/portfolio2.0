"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import {
  calibratePerformance,
  getSavedTier,
  PERFORMANCE_TIER_EVENT,
  PERFORMANCE_TIERS,
  savePerformanceTier,
} from "@/lib/performance/performanceTier";
import { PerformanceTierContext } from "@/components/PerformanceBootstrap";

export function usePerformanceTier(calibrationDurationMs) {
  const context = useContext(PerformanceTierContext);
  const [tier, setTier] = useState(() => getSavedTier() || PERFORMANCE_TIERS.LOW);
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

    const saved = getSavedTier();
    if (saved) {
      setTier(saved);
      setReady(true);
      return undefined;
    }

    runCalibration();
    return undefined;
  }, [context, runCalibration]);

  useEffect(() => {
    if (context) return undefined;

    const onTierChange = (event) => {
      if (event.detail) setTier(event.detail);
    };

    window.addEventListener(PERFORMANCE_TIER_EVENT, onTierChange);
    return () => window.removeEventListener(PERFORMANCE_TIER_EVENT, onTierChange);
  }, [context]);

  const fallback = {
    tier,
    ready,
    calibrating,
    runCalibration,
    isTier1: tier === PERFORMANCE_TIERS.HIGH,
    isTier2: tier === PERFORMANCE_TIERS.LOW,
  };

  return context || fallback;
}