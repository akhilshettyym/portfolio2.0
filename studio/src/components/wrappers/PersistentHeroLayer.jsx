"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CLOUD_CONTROL } from "@/utils/storage";
import HeroSection from "@/components/sections/HeroSection";
import SceneControls from "@/components/basic/SceneControls";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const CONTROLS_REVEAL_DELAY = 10000;

function dispatchHeroEvent(name) {
  window.dispatchEvent(new CustomEvent(name));
}

function PersistentHeroControls({ visible }) {
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isTier2 } = usePerformanceTier();

  useEffect(() => {
    const revealTimer = window.setTimeout(() => {
      setMounted(true);
    }, CONTROLS_REVEAL_DELAY);

    return () => {
      window.clearTimeout(revealTimer);
    };
  }, []);

  useEffect(() => {
    const syncCloudState = () => {
      setTimeout(() => {
        try {
          setPaused(window.localStorage.getItem(CLOUD_CONTROL) === "true");
        } catch {
          setPaused(false);
        }
      }, 0);
    };

    syncCloudState();

    window.addEventListener("storage", syncCloudState);
    window.addEventListener("hero-cloud-state", syncCloudState);

    return () => {
      window.removeEventListener("storage", syncCloudState);
      window.removeEventListener("hero-cloud-state", syncCloudState);
    };
  }, []);

  const handleCloudControl = () => {
    if (isTier2) return;
    dispatchHeroEvent("hero-toggle-clouds");
  };

  const handleRestartIntroScene = () => {
    dispatchHeroEvent("hero-restart-intro");
  };

  if (!mounted || !visible) {
    return null;
  }

  return (
    <SceneControls
      paused={paused}
      isTier2={isTier2}
      handleCloudControl={handleCloudControl}
      handleRestartIntroScene={handleRestartIntroScene}
      sceneAssets
      triggerCover="/album.svg"
      reveal
    />
  );
}

export default function PersistentHeroLayer() {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);
  const isInfoRoute = pathname === "/";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasMounted(true);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <div
        aria-hidden={!isInfoRoute}
        style={{
          opacity: hasMounted && isInfoRoute ? 1 : 0,
          visibility: hasMounted && isInfoRoute ? "visible" : "hidden",
          transition: "opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), visibility 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="pointer-events-none fixed inset-0 z-0">
        <HeroSection active={isInfoRoute} />
      </div>

      <PersistentHeroControls visible={isInfoRoute} />
    </>
  );
}
