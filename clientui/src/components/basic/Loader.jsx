"use client";

import gsap from "gsap";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import LocationModal from "@/components/basic/LocationModal";
import { hasLocationPreference } from "@/utils/weather-scene";
import { createThreeTimer } from "@/lib/performance/threeTimer";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getQualityPreset, getRendererPixelRatio } from "@/lib/performance/applyQualityTier";

const Loader = ({ onFinish, duration = 3000 }) => {
  const containerRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const { tier, calibrating } = usePerformanceTier();
  const quality = getQualityPreset(tier);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Hydration & responsive guards
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const modalTriggeredRef = useRef(false);
  const progressRef = useRef(0);
  const pausePointRef = useRef(null);

  // Determine a random point to pause for the location modal
  useEffect(() => {
    pausePointRef.current = Math.floor(Math.random() * 30) + 20;
  }, []);

  // Handle client-side mounting and media queries
  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");

    // Safely defer state transformations away from the layout-mount paint block
    const handle = setTimeout(() => {
      setMounted(true);
      setIsMobile(media.matches);
    }, 0);

    const handler = (e) => setIsMobile(e.matches);
    media.addEventListener("change", handler);

    return () => {
      clearTimeout(handle);
      media.removeEventListener("change", handler);
    };
  }, []);

  // Progress animation loop
  useEffect(() => {
    let frameId;

    const animate = () => {
      if (!isPaused) {
        progressRef.current += 100 / (duration / 16);

        const next = Math.min(progressRef.current, 100);
        setProgress(next);

        const hasPreference = typeof window !== "undefined" && hasLocationPreference();

        if (!hasPreference && !modalTriggeredRef.current && next >= pausePointRef.current) {
          modalTriggeredRef.current = true;
          setIsPaused(true);
          setShowLocationModal(true);
          return;
        }

        if (next >= 100) {
          setProgress(100);
          setTimeout(() => {
            setDone(true);
            onFinish?.();
          }, 800);
          return;
        }
      }
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [duration, isPaused, onFinish]);

  // Three.js Scene Setup
  useEffect(() => {
    // Optimization: Prevent initialization until the component has mounted 
    // and the correct client-side responsive environment state is known.
    if (!mounted || !containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 6, 18);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = isMobile ? 6 : 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile && quality.antialias,
      powerPreference: tier === "tier_1" ? "high-performance" : "default",
    });

    renderer.setPixelRatio(isMobile ? 1 : getRendererPixelRatio(tier));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    let controls;
    if (!isMobile && tier === "tier_1") {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
    }

    const geometry = new THREE.BufferGeometry();
    const count = Math.round((isMobile ? 850 : 2000) * quality.particleMultiplier);
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.025 : 0.02,
      color: 0x111111,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let frameId;
    const timer = createThreeTimer();

    function animate() {
      frameId = requestAnimationFrame(animate);
      const delta = Math.min(timer.update(), 0.033);
      const speed = delta * 60;

      points.rotation.y += (isMobile ? 0.0007 : 0.001) * speed;
      points.rotation.x += (isMobile ? 0.0003 : 0.0005) * speed;

      controls?.update();
      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container?.removeChild(renderer.domElement);
    };
  }, [mounted, isMobile, quality.antialias, quality.particleMultiplier, tier]);

  // Handle outro GSAP transitions once progress is complete
  useEffect(() => {
    if (!done) return;

    gsap.to(containerRef.current, {
      scale: isMobile ? 2 : 3,
      opacity: 0,
      duration: 1.2,
      ease: "power4.inOut",
    });
  }, [done, isMobile]);

  const handleLocationSelected = () => {
    setShowLocationModal(false);
    setTimeout(() => {
      setIsPaused(false);
    }, 300);
  };

  // UI Circular Progress calculations
  const radius = isMobile ? 70 : 85;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-999 overflow-hidden bg-white">
      {/* Visual Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-50/10 to-transparent" />
      </div>

      {/* Decorative Grid Markers */}
      <div className="absolute inset-0 pointer-events-none text-black text-xl font-light">
        <div className="absolute top-4 left-4"> + </div>
        <div className="absolute top-4 right-4"> + </div>
        <div className="absolute bottom-4 left-4"> + </div>
        <div className="absolute bottom-4 right-4"> + </div>
      </div>

      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Main Loader Core Layout */}
      <div className="absolute inset-0 flex items-center justify-center">
        {mounted && (
          /* Client Hydrated State: Adapts safely to mobile or desktop sizes */
          <div className={`relative flex items-center justify-center ${isMobile ? "w-36 h-36" : "w-50 h-50"}`}>
            <svg height={isMobile ? 160 : 200} width={isMobile ? 160 : 200} className="absolute -rotate-90">
              <circle stroke="rgba(0,0,0,0.08)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx="50%" cy="50%" />
              <circle stroke="black" fill="transparent" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} r={normalizedRadius} cx="50%" cy="50%" style={{ transition: "stroke-dashoffset 0.1s linear", filter: "drop-shadow(0 0 6px rgba(0,0,0,0.2))" }} />
            </svg>

            <div className={`text-black font-normal tabular-nums ${isMobile ? "text-xl" : "text-2xl"}`}>
              {Math.floor(progress)}%
            </div>
          </div>
        )}

        {!mounted && (
          /* Server Rendering State: Matches layout defaults exactly to prevent hydration layout shifting */
          <div className="relative flex items-center justify-center w-50 h-50">
            <svg height={200} width={200} className="absolute -rotate-90">
              <circle stroke="rgba(0,0,0,0.08)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx="50%" cy="50%" />
              <circle stroke="black" fill="transparent" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} r={normalizedRadius} cx="50%" cy="50%" style={{ transition: "stroke-dashoffset 0.1s linear", filter: "drop-shadow(0 0 6px rgba(0,0,0,0.2))" }} />
            </svg>

            <div className="text-black font-normal tabular-nums text-2xl">
              {Math.floor(progress)}%
            </div>
          </div>
        )}
      </div>

      {/* Status Logs and Metadata */}
      <div className="absolute bottom-8 w-full flex justify-center text-center px-6">
        <div className="text-[10px] sm:text-[11px] leading-5 text-black/60 max-w-md tracking-wide">
          <div className="text-black/80 font-normal text-sm sm:text-md">
            AKHIL SHETTY {"//"} identity: portfolio_instance
          </div>

          {progress < 25 && (
            <>
              <div className="text-black/40">[ boot sequence initiated ]</div>
              <div className="text-black/20 mt-1">loading core modules...</div>
            </>
          )}

          {progress >= 25 && progress < 55 && (
            <>
              <div className="text-black/40">[ authentication check ]</div>
              <div className="text-black/20 mt-1">verifying identity matrix...</div>
            </>
          )}

          {progress >= 55 && progress < 85 && (
            <>
              <div className="text-black/40">[ system calibration ]</div>
              <div className="text-black/20 mt-1">
                {calibrating ? "measuring rendering capacity..." : "synchronizing environment state..."}
              </div>
            </>
          )}

          {progress >= 85 && progress < 100 && (
            <>
              <div className="text-black/40">[ finalizing ]</div>
              <div className="text-black/20 mt-1">preparing interface shell...</div>
            </>
          )}

          {progress >= 100 && (
            <>
              <div className="text-black/40">[ portfolio unlocked ]</div>
              <div className="text-black/20 mt-1">welcome, - akhil shetty</div>
            </>
          )}
        </div>
      </div>

      <LocationModal open={showLocationModal} onComplete={handleLocationSelected} />
    </div>
  );
};

export default Loader;