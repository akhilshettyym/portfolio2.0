// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { getSavedTier, calibratePerformance, saveCalibration } from "@/lib/performance/performanceTier";

// export function usePerformanceTier(calibrationDurationMs = 5000) {
//     const [tier, setTier] = useState("tier_2");
//     const [ready, setReady] = useState(false);
//     const [calibrating, setCalibrating] = useState(false);

//     useEffect(() => {
//         const saved = getSavedTier();
//         if (saved) {
//             setTier(saved);
//             setReady(true);
//         }
//     }, []);

//     const runCalibration = useCallback(async (drawFrame) => {
//         setCalibrating(true);
//         const resultTier = await calibratePerformance(drawFrame, calibrationDurationMs);
//         setTier(resultTier);
//         saveCalibration(resultTier);
//         setCalibrating(false);
//         setReady(true);
//         return resultTier;
//     }, [calibrationDurationMs]);

//     return { tier, ready, calibrating, runCalibration };
// }