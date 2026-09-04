"use client";

import * as THREE from "three";
import "@/styles/hero-section.css";
import { useTheme } from "@/context/ThemeContext";
import HeroLayer from "@/components/basic/HeroLayer";
import { getWeatherScene } from "@/utils/weather-scene";
import { CLOUD_SHADER, HERO_SHADER } from "@/utils/basic";
import { CLOUD_CONTROL, ASSET_CACHE } from "@/utils/storage";
import { createThreeTimer } from "@/lib/performance/threeTimer";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useCanvasVisibility } from "@/hooks/useCanvasVisibility";
import { LoadingContext } from "@/components/wrappers/LoaderWrapper";
import { startTransition, useEffect, useRef, useState, memo, useContext } from "react";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { getQualityPreset, getRendererPixelRatio } from "@/lib/performance/applyQualityTier";

function isSameScene(a, b) {
  if (!a || !b) return false;
  return a.background === b.background && a.clouds === b.clouds;
}

const HeroSection = ({ active = true }) => {
  const { theme } = useTheme();
  const isDarkOrMetal = theme === "dark" || theme === "metal";

  const btnRef = useRef(null);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const tunnelPositionRef = useRef(0);

  const [paused, setPaused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sceneAssets, setSceneAssets] = useState(null);

  const { triggerIntroRestart } = useContext(LoadingContext);
  const { tier, ready, isTier2 } = usePerformanceTier();

  const speedRef = useRef(isTier2 ? 0 : 0.8);

  const { isVisible: canvasVisible, frameSkipInterval } = useCanvasVisibility(
    containerRef,
    tier === "tier_2" ? "tier_1" : tier,
  );

  const quality = getQualityPreset(tier);
  const maxCloudPlanes = quality.cloudPlanes ? Math.min(quality.cloudPlanes, tier === "tier_1" ? 1800 : 1250) : 1250;

  const pausedRef = useRef(false);
  const sceneAssetsRef = useRef(null);
  const visibilityRef = useRef({ canvasVisible, frameSkipInterval });

  useEffect(() => {
    visibilityRef.current = {
      canvasVisible: active && canvasVisible,
      frameSkipInterval: active ? frameSkipInterval : Infinity,
    };
  }, [active, canvasVisible, frameSkipInterval]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (!ready || tier !== "tier_2") {
      return;
    }

    const timer = setTimeout(() => {
      setShowModal(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
      setShowModal(false);
    };
  }, [ready, tier]);

  useEffect(() => {
    try {
      const cachedScene = localStorage.getItem(ASSET_CACHE);
      if (cachedScene) {
        const parsed = JSON.parse(cachedScene);
        sceneAssetsRef.current = parsed;
        startTransition(() => {
          setSceneAssets(parsed);
        });
      }
      const cloudControl = localStorage.getItem(CLOUD_CONTROL);
      if (cloudControl !== null) {
        const value = cloudControl === "true";
        pausedRef.current = value;
        startTransition(() => {
          setPaused(value);
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    sceneAssetsRef.current = sceneAssets;
  }, [sceneAssets]);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const sceneData = await getWeatherScene();
        if (!mounted) return;

        const nextScene = {
          background: sceneData.backgroundKey ?? "morning_clear",
          clouds: sceneData.cloudKey ?? "morning_clear",
        };

        setSceneAssets((prev) => {
          if (isSameScene(prev, nextScene)) return prev;
          localStorage.setItem(ASSET_CACHE, JSON.stringify(nextScene));
          return nextScene;
        });
      } catch (error) {
        console.error("Failed to load weather scene:", error);
        if (!mounted) return;
        if (!sceneAssetsRef.current) {
          const fallback = { background: "morning_clear", clouds: "morning_clear" };
          localStorage.setItem(ASSET_CACHE, JSON.stringify(fallback));
          sceneAssetsRef.current = fallback;
          setSceneAssets(fallback);
        }
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!sceneAssets) return;

    const container = containerRef.current;
    const btn = btnRef.current;
    if (!container) return;

    let mesh = null,
      mesh2 = null,
      camera = null,
      texture = null,
      material = null,
      renderer = null;
    let animationId = null,
      resumeTimeoutId = null;
    let isAnimating = true,
      isDisposed = false;

    let mouseX = 0,
      mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const scene = new THREE.Scene();
    const simScene = new THREE.Scene();
    const textRenderScene = new THREE.Scene();
    const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const fluidMouse = new THREE.Vector2();

    const dpr = getRendererPixelRatio(tier, tier === "tier_1" ? 1.2 : 1);
    let width = Math.floor(window.innerWidth * dpr);
    let height = Math.floor(window.innerHeight * dpr);

    const rtOptions = {
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    };

    let rtA = new THREE.WebGLRenderTarget(width, height, rtOptions);
    let rtB = new THREE.WebGLRenderTarget(width, height, rtOptions);
    let simMaterial = null,
      renderMaterial = null,
      quadGeometry = null;
    let simQuad = null,
      renderQuad = null,
      textTexture = null;

    const createTextTexture = (w, h) => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      if (tier !== "tier_2") {
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const text = "AKHIL SHETTY";
        const baseFontSize = 130;

        ctx.font = `900 ${baseFontSize}px "Helvetica Neue", "Arial", sans-serif`;

        if ("letterSpacing" in ctx) {
          ctx.letterSpacing = "-0.12em";
        }

        const textWidth = ctx.measureText(text).width;
        const targetWidth = Math.min(w * 0.72, 820 * dpr);
        const widthScale = targetWidth / textWidth;
        const heightScale = widthScale * 1.02;

        const horizontalPosition = w * 0.5;
        const verticalPosition = h * 0.5;

        ctx.save();
        ctx.translate(horizontalPosition, verticalPosition);
        ctx.scale(widthScale, heightScale);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;

      return tex;
    };

    const onMouseMove = (e) => {
      if (!pausedRef.current && !isTier2 && isAnimating) {
        mouseX = (e.clientX - windowHalfX) * 0.25;
        mouseY = (e.clientY - windowHalfY) * 0.15;
      }
      fluidMouse.x = e.clientX * dpr;
      fluidMouse.y = (window.innerHeight - e.clientY) * dpr;
    };

    const onMouseLeave = () => {
      fluidMouse.set(0, 0);
    };

    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        fluidMouse.x = e.touches[0].clientX * dpr;
        fluidMouse.y = (window.innerHeight - e.touches[0].clientY) * dpr;
      }
    };

    const timer = createThreeTimer();
    let frameCount = 0;

    const renderFullScene = () => {
      if (!renderer || !camera) return;

      simMaterial.uniforms.frame.value = frameCount;
      simMaterial.uniforms.time.value = performance.now() * 0.001;
      simMaterial.uniforms.textureA.value = rtA.texture;

      renderer.setRenderTarget(rtB);
      renderer.render(simScene, orthoCamera);

      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(scene, camera);

      renderMaterial.uniforms.textureA.value = rtB.texture;
      renderer.autoClear = false;
      renderer.render(textRenderScene, orthoCamera);
      renderer.autoClear = true;

      const temp = rtA;
      rtA = rtB;
      rtB = temp;
    };

    const onResize = () => {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      if (!camera || !renderer || !isAnimating) return;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(dpr);

      width = Math.floor(window.innerWidth * dpr);
      height = Math.floor(window.innerHeight * dpr);

      rtA.dispose();
      rtB.dispose();
      rtA = new THREE.WebGLRenderTarget(width, height, rtOptions);
      rtB = new THREE.WebGLRenderTarget(width, height, rtOptions);

      if (simMaterial) {
        simMaterial.uniforms.resolution.value.set(width, height);
        const oldTex = textTexture;
        textTexture = createTextTexture(width, height);
        simMaterial.uniforms.textTexture.value = textTexture;
        renderMaterial.uniforms.textureB.value = textTexture;
        oldTex.dispose();
      }

      if (isTier2) renderFullScene();
    };

    const animate = () => {
      if (!isAnimating || isDisposed) return;

      const visibility = visibilityRef.current;

      if (!visibility.canvasVisible) {
        resumeTimeoutId = window.setTimeout(() => {
          animate();
        }, 500);
        return;
      }

      if (visibility.frameSkipInterval === Infinity) {
        renderFullScene();
        resumeTimeoutId = window.setTimeout(() => {
          animationId = requestAnimationFrame(animate);
        }, 300);
        return;
      }

      if (visibility.frameSkipInterval !== 1) {
        if (frameCount % visibility.frameSkipInterval !== 0) {
          frameCount++;
          animationId = requestAnimationFrame(animate);
          return;
        }
      }
      frameCount++;

      const delta = Math.min(timer.update(), 0.033);
      const frameSpeed = delta * 60;
      const isCloudsPaused = pausedRef.current || isTier2;
      const targetSpeed = isCloudsPaused ? 0 : 0.8;

      speedRef.current += (targetSpeed - speedRef.current) * 0.025;

      if (isCloudsPaused && Math.abs(speedRef.current) < 0.001) {
        speedRef.current = 0;
      }

      tunnelPositionRef.current += speedRef.current * frameSpeed;

      if (camera) {
        const mouseFactor = isCloudsPaused ? 0 : 1;
        camera.position.x += (mouseX * mouseFactor - camera.position.x) * 0.01;
        camera.position.y += (-mouseY * mouseFactor - camera.position.y) * 0.01;
        camera.position.z = -(tunnelPositionRef.current % 8000) + 8000;
      }

      renderFullScene();

      animationId = requestAnimationFrame(animate);
    };

    const handleBtnMouseMove = (e) => {
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    };

    const handleBtnMouseLeave = () => {
      if (!btn) return;
      btn.style.transform = "translate(0px, 0px)";
    };

    async function initWebGL() {
      try {
        if (typeof document !== "undefined") {
          await document.fonts.ready;
        }

        if (isDisposed) return;

        camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 3000);
        camera.position.z = 6000;

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: quality.antialias,
          powerPreference: tier === "tier_1" ? "high-performance" : "default",
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(dpr);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

        textTexture = createTextTexture(width, height);

        simMaterial = new THREE.ShaderMaterial({
          uniforms: {
            textureA: { value: null },
            textTexture: { value: textTexture },
            mouse: { value: fluidMouse },
            resolution: { value: new THREE.Vector2(width, height) },
            time: { value: 0 },
            frame: { value: 0 },
          },
          vertexShader: HERO_SHADER.simulationVertexShader,
          fragmentShader: HERO_SHADER.simulationFragmentShader,
        });

        renderMaterial = new THREE.ShaderMaterial({
          uniforms: {
            textureA: { value: null },
            textureB: { value: textTexture },
          },
          vertexShader: HERO_SHADER.renderVertexShader,
          fragmentShader: HERO_SHADER.renderFragmentShader,
          transparent: true,
          depthWrite: false,
          depthTest: false,
        });

        quadGeometry = new THREE.PlaneGeometry(2, 2);
        simQuad = new THREE.Mesh(quadGeometry, simMaterial);
        renderQuad = new THREE.Mesh(quadGeometry, renderMaterial);

        simScene.add(simQuad);
        textRenderScene.add(renderQuad);

        const textureLoader = new THREE.TextureLoader();
        texture = await textureLoader.loadAsync(`/clouds/${sceneAssets.clouds}.svg`);

        if (isDisposed) {
          texture.dispose();
          return;
        }

        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = false;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.needsUpdate = true;

        const fog = new THREE.Fog(0xffffff, -100, 3000);
        scene.fog = fog;

        material = new THREE.ShaderMaterial({
          uniforms: {
            map: { value: texture },
            fogColor: { value: fog.color },
            fogNear: { value: fog.near },
            fogFar: { value: fog.far },
          },
          vertexShader: CLOUD_SHADER.vertexShader,
          fragmentShader: CLOUD_SHADER.fragmentShader,
          depthWrite: false,
          depthTest: false,
          transparent: true,
        });

        const planeGeo = new THREE.PlaneGeometry(64, 64);
        const planeObj = new THREE.Object3D();
        const geometries = [];

        for (let i = 0; i < maxCloudPlanes; i++) {
          planeObj.position.x = Math.random() * 1400 - 700;
          planeObj.position.y = -Math.random() * Math.random() * 200 - 15;
          planeObj.position.z = i * (8000 / maxCloudPlanes);
          planeObj.rotation.z = Math.random() * Math.PI;
          planeObj.scale.x = planeObj.scale.y = Math.random() * Math.random() * 2.5 + 1.2;
          planeObj.updateMatrix();

          const cloned = planeGeo.clone();
          cloned.applyMatrix4(planeObj.matrix);
          geometries.push(cloned);
        }

        const mergedGeo = BufferGeometryUtils.mergeGeometries(geometries);
        geometries.forEach((g) => g.dispose());
        if (!mergedGeo) throw new Error("Cloud geometry merge failed");

        mesh = new THREE.Mesh(mergedGeo, material);
        mesh.renderOrder = 2;

        mesh2 = mesh.clone();
        mesh2.position.z = -8000;
        mesh2.renderOrder = 1;

        scene.add(mesh);
        scene.add(mesh2);
        planeGeo.dispose();

        animate();
      } catch (error) {
        if (!isDisposed) console.error("Combined WebGL Initialization Failed:", error);
      }
    }

    initWebGL();

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    container.addEventListener("mouseleave", onMouseLeave, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onMouseLeave, { passive: true });

    if (btn) {
      btn.addEventListener("mousemove", handleBtnMouseMove, { passive: true });
      btn.addEventListener("mouseleave", handleBtnMouseLeave, { passive: true });
    }

    return () => {
      isDisposed = true;
      isAnimating = false;

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onMouseLeave);

      if (btn) {
        btn.removeEventListener("mousemove", handleBtnMouseMove);
        btn.removeEventListener("mouseleave", handleBtnMouseLeave);
        btn.style.transform = "translate(0px, 0px)";
      }

      if (animationId) cancelAnimationFrame(animationId);
      if (resumeTimeoutId) window.clearTimeout(resumeTimeoutId);

      const disposedGeometries = new Set();
      if (mesh) {
        scene.remove(mesh);
        if (mesh.geometry && !disposedGeometries.has(mesh.geometry)) {
          mesh.geometry.dispose();
          disposedGeometries.add(mesh.geometry);
        }
      }
      if (mesh2) {
        scene.remove(mesh2);
        if (mesh2.geometry && !disposedGeometries.has(mesh2.geometry)) {
          mesh2.geometry.dispose();
          disposedGeometries.add(mesh2.geometry);
        }
      }
      material?.dispose();
      texture?.dispose();

      quadGeometry?.dispose();
      simMaterial?.dispose();
      renderMaterial?.dispose();
      textTexture?.dispose();
      rtA?.dispose();
      rtB?.dispose();

      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
        renderer.forceContextLoss?.();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      }
    };
  }, [quality.antialias, maxCloudPlanes, sceneAssets, tier, isTier2]);

  const handleCloudControl = () => {
    if (isTier2) return;
    setPaused((prev) => {
      const nextState = !prev;
      localStorage.setItem(CLOUD_CONTROL, nextState);
      window.dispatchEvent(new CustomEvent("hero-cloud-state"));
      return nextState;
    });
  };

  const handleRestartIntroScene = () => triggerIntroRestart();

  useEffect(() => {
    window.addEventListener("hero-toggle-clouds", handleCloudControl);
    window.addEventListener("hero-restart-intro", handleRestartIntroScene);

    return () => {
      window.removeEventListener("hero-toggle-clouds", handleCloudControl);
      window.removeEventListener("hero-restart-intro", handleRestartIntroScene);
    };
  });

  return (
    <div ref={sectionRef} className="relative min-h-screen w-full overflow-hidden pb-8 text-white md:pb-12">
      <div className="wrapper relative min-h-screen w-full">
        <div
          ref={containerRef}
          className={`canvas-bg absolute inset-0 z-0 ${isDarkOrMetal ? "bg-black" : ""}`}
          style={{
            backgroundImage: isDarkOrMetal
              ? "none"
              : sceneAssets
                ? `linear-gradient(
                 to bottom,
                 rgba(255,255,255,0.35),
                 rgba(255,255,255,0.05)
               ),
               url("/clouds_background/${sceneAssets.background}.png")`
                : "none",
          }}
        />
      </div>

      <HeroLayer theme={theme} />
    </div>
  );
};

export default memo(HeroSection);