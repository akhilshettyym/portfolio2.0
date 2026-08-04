"use client";

import * as THREE from "three";
import "@/styles/hero-section.css";
import { motion } from "framer-motion";
import { SiRevealdotjs } from "react-icons/si";
import { useTheme } from "@/context/ThemeContext";
import LimpModal from "@/components/basic/LimpModal";
import GlitchText from "@/components/basic/GlitchText";
import { getWeatherScene } from "@/utils/weather-scene";
import WeatherIcon from "@/components/basic/WeatherIcon";
import LiquidGlass from "@/components/basic/LiquidGlass";
import { CLOUD_SHADER, HERO_SHADER } from "@/utils/basic";
import { HiMiniPlay, HiMiniPause } from "react-icons/hi2";
import WordCarousel from "@/components/basic/WordCarousel";
import { CLOUD_CONTROL, ASSET_CACHE } from "@/utils/storage";
import { createThreeTimer } from "@/lib/performance/threeTimer";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useCanvasVisibility } from "@/hooks/useCanvasVisibility";
import { LoadingContext } from "@/components/basic/LoaderWrapper";
import { getQualityPreset } from "@/lib/performance/applyQualityTier";
import { startTransition, useEffect, useRef, useState, memo, useContext } from "react";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

function isSameScene(a, b) {
  if (!a || !b) return false;
  return a.background === b.background && a.clouds === b.clouds;
}

const HeroSection = () => {
  const { theme } = useTheme();
  const isDarkOrMetal = theme === "dark" || theme === "metal";

  const btnRef = useRef(null);
  const sectionRef = useRef(null);
  const speedRef = useRef(0.8);
  const containerRef = useRef(null);
  const tunnelPositionRef = useRef(0);

  const [paused, setPaused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sceneAssets, setSceneAssets] = useState(null);

  const { triggerIntroRestart } = useContext(LoadingContext);
  const { tier, ready, isTier2 } = usePerformanceTier();
  const { isVisible: canvasVisible, frameSkipInterval } = useCanvasVisibility(containerRef, tier);

  const quality = getQualityPreset(tier);
  const maxCloudPlanes = quality.cloudPlanes ? Math.floor(quality.cloudPlanes * 1.5) : 1500;

  const pausedRef = useRef(false);
  const sceneAssetsRef = useRef(null);
  const visibilityRef = useRef({ canvasVisible, frameSkipInterval });

  useEffect(() => {
    visibilityRef.current = { canvasVisible, frameSkipInterval };
  }, [canvasVisible, frameSkipInterval]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (!ready) {
      const resetTimer = setTimeout(() => {
        setShowModal(false);
      }, 0);
      return () => clearTimeout(resetTimer);
    }

    const timer = setTimeout(() => {
      setShowModal(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [ready]);

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

    const dpr = Math.min(window.devicePixelRatio, 2);
    let width = Math.floor(window.innerWidth * dpr);
    let height = Math.floor(window.innerHeight * dpr);

    const rtOptions = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
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

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text = "AKHIL SHETTY";

      const baseFontSize = 100;
      ctx.font = `900 ${baseFontSize}px "Arial Black", "Impact", system-ui, sans-serif`;

      if ("letterSpacing" in ctx) {
        ctx.letterSpacing = "-0.09em";
      }

      const textWidth = ctx.measureText(text).width;

      const maxPhysicalWidth = 750 * dpr;
      const targetWidth = Math.min(w * 0.7, maxPhysicalWidth);

      const globalScale = targetWidth / textWidth;

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(globalScale, globalScale);

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = baseFontSize * 0.02;
      ctx.lineJoin = "round";

      ctx.fillText(text, 0, 0);
      ctx.strokeText(text, 0, 0);

      ctx.restore();

      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      return tex;
    };

    const onMouseMove = (e) => {
      if (!pausedRef.current && isAnimating && !isTier2) {
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
          animationId = requestAnimationFrame(animate);
        }, 180);
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

      if (!isTier2) {
        const delta = Math.min(timer.update(), 0.033);
        const frameSpeed = delta * 60;
        const targetSpeed = pausedRef.current ? 0 : 0.8;
        speedRef.current += (targetSpeed - speedRef.current) * 0.025;
        tunnelPositionRef.current += speedRef.current * frameSpeed;

        if (camera) {
          const mouseFactor = pausedRef.current ? 0 : 1;
          camera.position.x += (mouseX * mouseFactor - camera.position.x) * 0.01;
          camera.position.y += (-mouseY * mouseFactor - camera.position.y) * 0.01;
          camera.position.z = -(tunnelPositionRef.current % 8000) + 8000;
        }
      } else if (camera) {
        camera.position.z = 8000;
      }

      renderFullScene();

      if (isTier2) return;
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

        if (isDisposed) return;

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

      if (mesh) {
        scene.remove(mesh);
        mesh.geometry?.dispose();
      }
      if (mesh2) {
        scene.remove(mesh2);
        mesh2.geometry?.dispose();
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
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      }
    };
  }, [quality.antialias, maxCloudPlanes, sceneAssets, tier, isTier2]);

  const handleCloudControl = () => {
    if (isTier2) return;
    setPaused((prev) => {
      const nextState = !prev;
      localStorage.setItem(CLOUD_CONTROL, nextState);
      return nextState;
    });
  };

  useEffect(() => {
    if (isTier2) {
      pausedRef.current = true;
      window.requestAnimationFrame(() => setPaused(true));
    }
  }, [isTier2]);

  const handleRestartIntroScene = () => triggerIntroRestart();

  return (
    <div ref={sectionRef} className="relative min-h-screen w-full overflow-hidden text-white pb-8 md:pb-12">
      {showModal && <LimpModal />}

      <div className="wrapper">
        <div
          ref={containerRef}
          className={`canvas-bg absolute inset-0 z-0 ${isDarkOrMetal ? "bg-black" : ""}`}
          style={{
            backgroundImage: isDarkOrMetal
              ? "none"
              : sceneAssets
                ? `linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.05)), url("/clouds_background/${sceneAssets.background}.png")`
                : "none",
          }}
        />

        <div className="absolute top-60 right-0 z-9999">
          <LiquidGlass width="50px" height="180px" className="p-0">
            <button
              type="button"
              onClick={handleCloudControl}
              aria-label={paused ? "Resume animation" : "Pause animation"}
              disabled={isTier2}
              className={`group absolute top-3 left-1/2 -translate-x-1/2 h-11 w-11 z-20`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative z-10 flex h-10 w-8 items-center justify-center rounded-full border border-white/10 bg-black/10 backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:border-white/30">
                  {paused ? (
                    <HiMiniPlay size={14} className="translate-x-[0.5px] text-black/50" />
                  ) : (
                    <HiMiniPause size={14} className="text-black/50" />
                  )}
                </div>
              </div>
              <div className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-4 whitespace-nowrap rounded-lg bg-transparent border border-white/0 backdrop-blur-xl px-3.5 py-1.5 text-[11px] font-medium text-black/50 opacity-0 translate-x-3 transition-all duration-200 group-hover:translate-x-0 group-hover:border group-hover:border-slate-100 group-hover:opacity-100 shadow-xl uppercase">
                {isTier2 ? "DISABLED" : paused ? "Run Clouds" : "Stall Clouds"}
              </div>
            </button>

            <button
              type="button"
              onClick={handleRestartIntroScene}
              className="group absolute top-14 left-1/2 -translate-x-1/2 h-12 w-12 z-20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="mr-1/2 relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/10 backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:border-white/30">
                  <SiRevealdotjs size={15} className="translate-x-[0.5px] text-black/50" />
                </div>
              </div>
              <div className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-4 whitespace-nowrap rounded-lg bg-transparent border border-white/0 backdrop-blur-xl px-3.5 py-1.5 text-[11px] font-medium text-black/50 opacity-0 translate-x-3 transition-all duration-200 group-hover:translate-x-0 group-hover:border group-hover:border-slate-100 group-hover:opacity-100 shadow-xl uppercase">
                Run Intro
              </div>
            </button>

            {sceneAssets && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
                <WeatherIcon />
              </div>
            )}
          </LiquidGlass>
        </div>

        <div className="hero-text">
          <span className="line dim uppercase">
            BUILD SYSTEMS <br />
          </span>
          <span className="line dim uppercase">
            OPTIMIZE SCALE x LATENCY <br />
          </span>
          <span className="line strong">
            <span className="text-md uppercase tracking-tight"> OPS </span> <WordCarousel />
          </span>

          <button ref={btnRef} type="button" className="btn">
            <span className="label">
              <span className="main"> See how we create outcomes </span>
              <span className="alt"> Explore our work → </span>
            </span>
          </button>
        </div>

        <div className="hero-subtext-wrap">
          <p className="hero-subtext">
            Design and code, refined until <br />
            nothing feels unnecessary.
          </p>
          <span className="dot tl" />
          <span className="dot tr" />
          <span className="dot bl" />
          <span className="dot br" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute bottom-0 left-0 w-full z-50 pointer-events-none text-gray-400">
          <div className="relative px-10 py-4 text-xs tracking-widest">
            <div className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-auto hover:text-gray-200 transition">
              ©001
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto hover:text-gray-200 transition">
              (DEV)
            </div>
            <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-auto">
              <GlitchText text="SCROLL_MORE__" />
            </div>
          </div>
        </motion.div>

        <div className="scroll-wrap" style={{ top: "110px", right: "40px" }}>
          <span className="scroll-text"> DISCOVER </span>
          <div className="scroll-indicator" />
        </div>

        <div className="corner" style={{ top: "120px", left: "40px" }} />
        <div className="corner" style={{ bottom: "40px", left: "40px" }} />
        <div className="corner" style={{ bottom: "40px", right: "40px" }} />
      </div>
    </div>
  );
};

export default memo(HeroSection);