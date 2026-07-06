// "use client";

// import { useEffect, useRef } from "react";
// import { usePerformanceTier } from "@/hooks/usePerformanceTier";

// export default function PerformanceBootstrap({ onDrawFrame, onReady, children }) {
//     const { ready, calibrating, runCalibration } = usePerformanceTier(5000);
//     const hasRun = useRef(false);

//     useEffect(() => {
//         if (hasRun.current) return;
//         hasRun.current = true;

//         const savedTier = window.localStorage.getItem("tier");
//         if (!savedTier) {
//             runCalibration(onDrawFrame).then((tier) => onReady(tier));
//         } else {
//             onReady(savedTier);
//         }
//     }, [runCalibration, onDrawFrame, onReady]);

//     return (
//         <>
//             {children}
//             {calibrating && (
//                 <div className="fixed bottom-4 right-4 z-50 rounded-full bg-black/80 px-4 py-2 text-xs text-white pointer-events-none">
//                     Calibrating...
//                 </div>
//             )}
//         </>
//     );
// }