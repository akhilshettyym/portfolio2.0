// "use client";

// import Lenis from "lenis";
// import { createContext, useContext, useEffect, useRef } from "react";

// const LenisContext = createContext(null);

// export function LenisProvider({ children }) {
//   const lenisRef = useRef(null);
//   const rafRef = useRef(null);

//   useEffect(() => {
//     lenisRef.current = new Lenis({
//       duration: 1.2,
//       smoothWheel: true,
//       gestureOrientation: "vertical",
//       touchMultiplier: 2,
//     });

//     const raf = (time) => {
//       lenisRef.current?.raf(time);
//       rafRef.current = requestAnimationFrame(raf);
//     };

//     rafRef.current = requestAnimationFrame(raf);

//     return () => {
//       if (rafRef.current) {
//         cancelAnimationFrame(rafRef.current);
//       }

//       lenisRef.current?.destroy();
//       lenisRef.current = null;
//     };
//   }, []);

//   return (
//     <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
//   );
// }

// export function useLenis() {
//   return useContext(LenisContext);
// }





"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const LenisContext = createContext(null);

export function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);
  const { isTier2 } = usePerformanceTier();

  useEffect(() => {
    if (isTier2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 0.9,
      smoothWheel: true,
      gestureOrientation: "vertical",
      touchMultiplier: 1.25,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    const raf = (time) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
      window.lenis = null;
    };
  }, [isTier2]);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}

export function useLenis() {
  return useContext(LenisContext);
}
