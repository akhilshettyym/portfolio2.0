"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { FLOW_STATE } from "@/utils/basic";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useViewportDetection } from "@/hooks/useViewportDetection";

const vertexShader = FLOW_STATE?.vertexShader;
const fragmentShaderTier1 = FLOW_STATE?.fragmentShaderTier1;
const fragmentShaderTier2 = FLOW_STATE?.fragmentShaderTier2;

export default function FlowState({
  className = "",

  density = 16,
  matrixSpeed = 0.16,
  matrixOpacity = 0.5,

  xScale = 1.2,
  yScale = 0.4,
  distortion = 0.055,
  lineIntensity = 0.075,
  lineSpeed = 0.45,
  lineOpacity = 0.9,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const { isTier2 } = usePerformanceTier();

  const { ref: viewportRef, isVisible } = useViewportDetection({
    threshold: 0,
    rootMargin: "0px",
  });

  const setContainerRef = (node) => {
    containerRef.current = node;
    viewportRef.current = node;
  };

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) {
      return undefined;
    }

    let renderer = null;
    let scene = null;
    let camera = null;
    let mesh = null;
    let geometry = null;
    let material = null;

    let animationFrameId = null;
    let destroyed = false;
    let documentHidden = document.hidden;
    let lastFrameTime = 0;

    const quality = isTier2
      ? {
          shader: fragmentShaderTier2,
          pixelRatio: 1,
          maxFps: 30,
          timeStep: 0.012,
          powerPreference: "low-power",

          density: Math.max(density * 0.55, 5),

          matrixSpeed: matrixSpeed * 0.45,
          matrixOpacity: matrixOpacity * 0.55,
          xScale: xScale * 0.8,
          yScale: yScale * 0.75,
          distortion: 0,
          lineIntensity: lineIntensity * 0.65,
          lineSpeed,
          lineOpacity: lineOpacity * 0.75,
        }
      : {
          shader: fragmentShaderTier1,

          pixelRatio: Math.min(window.devicePixelRatio || 1, 2),

          maxFps: 60,
          timeStep: 0.006,
          powerPreference: "high-performance",

          density,
          matrixSpeed,
          matrixOpacity,

          xScale,
          yScale,
          distortion,
          lineIntensity,

          lineSpeed: lineSpeed * 3.5,

          lineOpacity,
        };

    const uniforms = {
      resolution: {
        value: new THREE.Vector2(1, 1),
      },

      time: {
        value: 0,
      },

      density: {
        value: quality.density,
      },

      matrixSpeed: {
        value: quality.matrixSpeed,
      },

      matrixOpacity: {
        value: quality.matrixOpacity,
      },

      xScale: {
        value: quality.xScale,
      },

      yScale: {
        value: quality.yScale,
      },

      distortion: {
        value: quality.distortion,
      },

      lineIntensity: {
        value: quality.lineIntensity,
      },

      lineSpeed: {
        value: quality.lineSpeed,
      },

      lineOpacity: {
        value: quality.lineOpacity,
      },
    };

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: quality.powerPreference,
    });

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(quality.pixelRatio);
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    geometry = new THREE.BufferGeometry();

    const positions = new Float32Array([
      -1, -1, 0, 1, -1, 0, 1, 1, 0,

      -1, -1, 0, 1, 1, 0, -1, 1, 0,
    ]);

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader: quality.shader,

      uniforms,

      transparent: true,
      depthWrite: false,
      depthTest: false,

      blending: THREE.NormalBlending,
    });

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    const resize = () => {
      if (destroyed || !renderer) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const width = Math.max(Math.floor(rect.width), 1);
      const height = Math.max(Math.floor(rect.height), 1);

      renderer.setPixelRatio(quality.pixelRatio);
      renderer.setSize(width, height, false);

      uniforms.resolution.value.set(width * quality.pixelRatio, height * quality.pixelRatio);
    };

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(container);

    resize();

    const handleVisibilityChange = () => {
      documentHidden = document.hidden;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const frameInterval = 1000 / quality.maxFps;

    const animate = (currentTime) => {
      if (destroyed) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(animate);

      if (documentHidden) {
        return;
      }

      if (isTier2) {
        if (currentTime - lastFrameTime < frameInterval) {
          return;
        }

        lastFrameTime = currentTime;
      }

      uniforms.time.value += quality.timeStep;

      renderer.render(scene, camera);
    };

    animationFrameId = window.requestAnimationFrame(animate);

    return () => {
      destroyed = true;

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (scene && mesh) {
        scene.remove(mesh);
      }

      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
    };
  }, [
    isVisible,
    isTier2,
    density,
    matrixSpeed,
    matrixOpacity,
    xScale,
    yScale,
    distortion,
    lineIntensity,
    lineSpeed,
    lineOpacity,
  ]);

  return (
    <div
      ref={setContainerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
