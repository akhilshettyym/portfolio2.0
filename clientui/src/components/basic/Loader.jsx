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

export default function Loader({ onFinish, duration = 3000 }) {
  const containerRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const { tier, calibrating } = usePerformanceTier();
  const quality = getQualityPreset(tier);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const modalTriggeredRef = useRef(false);
  const progressRef = useRef(0);
  const pausePointRef = useRef(null);

  useEffect(() => {
    pausePointRef.current = Math.floor(Math.random() * 30) + 20;
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");

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

  useEffect(() => {
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

  const radius = isMobile ? 70 : 100;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-999 overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-50/10 to-transparent" />
      </div>

      <div className="absolute inset-0 pointer-events-none text-black text-xl font-light">
        <div className="absolute top-4 left-4"> + </div>
        <div className="absolute top-4 right-4"> + </div>
        <div className="absolute bottom-4 left-4"> + </div>
        <div className="absolute bottom-4 right-4"> + </div>
      </div>

      <div ref={containerRef} className="absolute inset-0" />

      <div className="absolute inset-0 flex items-center justify-center">
        {mounted && (
          <div className={`relative flex flex-col items-center justify-center ${isMobile ? "w-44 h-44" : "w-56 h-56"}`}>

            <svg className="absolute inset-0 w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeDasharray="2 6" />
              <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" strokeDasharray="10 10" />
            </svg>

            <svg className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite_reverse]" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" strokeDasharray="30 10" />
            </svg>

            <svg height={isMobile ? 160 : 200} width={isMobile ? 160 : 200} className="absolute -rotate-90">
              <circle stroke="rgba(0,0,0,0.03)" fill="transparent" strokeWidth={stroke + 2} r={normalizedRadius} cx="50%" cy="50%" />

              <circle stroke="rgba(0,0,0,0.15)" fill="transparent" strokeWidth={stroke + 4} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} r={normalizedRadius} cx="50%" cy="50%" style={{ transition: "stroke-dashoffset 0.1s linear", filter: "blur(4px)" }} />

              <circle stroke="#000000" fill="transparent" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} r={normalizedRadius} cx="50%" cy="50%" style={{ transition: "stroke-dashoffset 0.1s linear" }} />
            </svg>

            <div className="flex flex-col items-center justify-center z-10 mt-1">
              <div className={`text-black font-medium tracking-tighter tabular-nums ${isMobile ? "text-4xl" : "text-5xl"}`}>
                {Math.floor(progress)}
                <span className={`text-black/30 font-light ml-0.5 ${isMobile ? "text-xl" : "text-2xl"}`}>%</span>
              </div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-black/40 mt-1 font-medium">
                {progress >= 100 ? "Ready" : "Loading"}
              </div>
            </div>
          </div>
        )}

        {!mounted && (
          <div className="relative flex flex-col items-center justify-center w-56 h-56">

            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeDasharray="2 6" />
              <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" strokeDasharray="10 10" />
            </svg>

            <svg height={200} width={200} className="absolute -rotate-90">
              <circle stroke="rgba(0,0,0,0.03)" fill="transparent" strokeWidth={stroke + 2} r={normalizedRadius} cx="50%" cy="50%" />
              <circle stroke="#000000" fill="transparent" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} r={normalizedRadius} cx="50%" cy="50%" />
            </svg>

            <div className="flex flex-col items-center justify-center z-10 mt-1">
              <div className="text-black font-medium tracking-tighter tabular-nums text-5xl">
                {Math.floor(progress)}
                <span className="text-black/30 font-light ml-0.5 text-2xl">%</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-black/40 mt-1 font-medium">
                Loading
              </div>
            </div>
          </div>
        )}
      </div>

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