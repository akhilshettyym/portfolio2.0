"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CLOUD_CONTROL } from "@/utils/storage";
import HeroSection from "@/components/sections/HeroSection";
import SceneControls from "@/components/basic/SceneControls";

const CONTROLS_REVEAL_DELAY = 10000;

function dispatchHeroEvent(name) {
  window.dispatchEvent(new CustomEvent(name));
}

function PersistentHeroControls({ visible }) {
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

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
      isTier2={false}
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
  const isInfoRoute = pathname === "/";

  return (
    <>
      <motion.div
        aria-hidden={!isInfoRoute}
        initial={false}
        animate={{
          opacity: isInfoRoute ? 1 : 0,
          visibility: isInfoRoute ? "visible" : "hidden",
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="pointer-events-none fixed inset-0 z-0">
        <HeroSection active={isInfoRoute} />
      </motion.div>

      <PersistentHeroControls visible={isInfoRoute} />
    </>
  );
}
