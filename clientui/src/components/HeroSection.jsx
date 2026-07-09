"use client";

import * as THREE from "three";
import "@/styles/hero-section.css";
import { motion } from "framer-motion";
import { SiRevealdotjs } from "react-icons/si";
import { CLOUD_SHADER } from "@/utils/basic-utils";
import GlitchText from "@/components/basic/GlitchText";
import { getWeatherScene } from "@/utils/weather-scene";
import WeatherIcon from "@/components/basic/WeatherIcon";
import LiquidGlass from "@/components/basic/LiquidGlass";
import { HiMiniPlay, HiMiniPause } from "react-icons/hi2";
import WordCarousel from "@/components/basic/WordCarousel";
import { createThreeTimer } from "@/lib/performance/threeTimer";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { LoadingContext } from "@/components/basic/LoaderWrapper";
import { CLOUD_CONTROL, WEATHER_SCENE_ASSETS } from "@/utils/localstorage";
import { startTransition, useEffect, useRef, useState, memo, useContext } from "react";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { getQualityPreset, getRendererPixelRatio } from "@/lib/performance/applyQualityTier";

function isSameScene(a, b) {
    if (!a || !b) return false;
    return a.background === b.background && a.clouds === b.clouds;
}

const HeroSectionComponent = () => {
    const btnRef = useRef(null);
    const sectionRef = useRef(null);
    const speedRef = useRef(0.8);
    const containerRef = useRef(null);
    const tunnelPositionRef = useRef(0);

    const [paused, setPaused] = useState(false);
    const [sceneAssets, setSceneAssets] = useState(null);

    const { triggerIntroRestart } = useContext(LoadingContext);
    const { tier, ready, isTier2 } = usePerformanceTier();

    const quality = getQualityPreset(tier);
    const maxCloudPlanes = getQualityPreset("tier_1")?.cloudPlanes || 64;

    const pausedRef = useRef(false);
    const sceneAssetsRef = useRef(null);

    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    useEffect(() => {
        try {
            const cachedScene = localStorage.getItem(WEATHER_SCENE_ASSETS);

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
        if (!ready || !isTier2 || !sectionRef.current) return undefined;

        const dismissed = sessionStorage.getItem("tier_2_notice_seen") === "true";
        if (dismissed) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                sessionStorage.setItem("tier_2_notice_seen", "true");
                observer.disconnect();
            },
            { threshold: 0.35 },
        );

        observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [isTier2, ready]);

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
                    if (isSameScene(prev, nextScene)) {
                        return prev;
                    }

                    localStorage.setItem(WEATHER_SCENE_ASSETS, JSON.stringify(nextScene));
                    return nextScene;
                });
            } catch (error) {
                console.error("Failed to load weather scene:", error);

                if (!mounted) return;
                if (!sceneAssetsRef.current) {
                    const fallback = {
                        background: "morning_clear",
                        clouds: "morning_clear",
                    };

                    localStorage.setItem(WEATHER_SCENE_ASSETS, JSON.stringify(fallback));

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

        let mesh = null;
        let mesh2 = null;
        let camera = null;
        let texture = null;
        let material = null;
        let renderer = null;
        let animationId = null;

        let isAnimating = true;
        let isDisposed = false;

        let mouseX = 0;
        let mouseY = 0;

        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;

        const scene = new THREE.Scene();

        const onMouseMove = (e) => {
            if (pausedRef.current || !isAnimating || isTier2) return;

            mouseX = (e.clientX - windowHalfX) * 0.25;
            mouseY = (e.clientY - windowHalfY) * 0.15;
        };

        const onResize = () => {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            if (!camera || !renderer || !isAnimating) return;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(getRendererPixelRatio(tier));

            if (isTier2 && renderer && camera) {
                renderer.render(scene, camera);
            }
        };

        const timer = createThreeTimer();

        const animate = () => {
            if (!isAnimating || isDisposed) return;

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

            if (renderer && camera) {
                renderer.render(scene, camera);
            }

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

        async function init() {
            try {
                camera = new THREE.PerspectiveCamera(
                    30,
                    window.innerWidth / window.innerHeight,
                    1,
                    3000,
                );

                camera.position.z = 6000;

                renderer = new THREE.WebGLRenderer({
                    alpha: true,
                    antialias: quality.antialias,
                    powerPreference: tier === "tier_1" ? "high-performance" : "default",
                });

                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(getRendererPixelRatio(tier));
                renderer.outputColorSpace = THREE.SRGBColorSpace;

                container.appendChild(renderer.domElement);

                const textureLoader = new THREE.TextureLoader();

                texture = await textureLoader.loadAsync(
                    `/clouds/${sceneAssets.clouds}.svg`,
                );

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
                        fogColor: {
                            value: fog.color,
                        },
                        fogNear: {
                            value: fog.near,
                        },
                        fogFar: {
                            value: fog.far,
                        },
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
                    planeObj.position.x = Math.random() * 1000 - 500;
                    planeObj.position.y = -Math.random() * Math.random() * 200 - 15;
                    planeObj.position.z = i * (8000 / maxCloudPlanes);
                    planeObj.rotation.z = Math.random() * Math.PI;
                    planeObj.scale.x = planeObj.scale.y = Math.random() * Math.random() * 1.5 + 0.5;
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
                if (!isDisposed) {
                    console.error("Cloud scene init failed:", error);
                }
            }
        }

        init();

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("resize", onResize);

        if (btn) {
            btn.addEventListener("mousemove", handleBtnMouseMove);
            btn.addEventListener("mouseleave", handleBtnMouseLeave);
        }

        return () => {
            isDisposed = true;
            isAnimating = false;

            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("resize", onResize);

            if (btn) {
                btn.removeEventListener("mousemove", handleBtnMouseMove);
                btn.removeEventListener("mouseleave", handleBtnMouseLeave);
                btn.style.transform = "translate(0px, 0px)";
            }

            if (animationId) {
                cancelAnimationFrame(animationId);
            }

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

            if (renderer) {
                renderer.dispose();

                if (container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
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
            setPaused(true);
            pausedRef.current = true;
        }
    }, [isTier2]);

    const handleRestartIntroScene = () => {
        triggerIntroRestart();
    }

    return (
        <section ref={sectionRef} className="relative min-h-screen w-full overflow-hidden text-white pb-8 md:pb-12">
            <div className="wrapper">

                <div ref={containerRef} className="canvas-bg" style={{ backgroundImage: sceneAssets ? `linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.05)), url("/clouds_background/${sceneAssets.background}.png")` : "none" }} />

                <div className="absolute top-60 right-0 z-9999">
                    <LiquidGlass width="50px" height="180px" className="p-0">
                        <button type="button" onClick={handleCloudControl} aria-label={paused ? "Resume animation" : "Pause animation"} disabled={isTier2} className={`group absolute top-3 left-1/2 -translate-x-1/2 h-11 w-11 z-20`}>

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
                                {paused ? "Run Clouds" : "Stall Clouds"}
                            </div>
                        </button>


                        <button type="button" onClick={handleRestartIntroScene} className="group absolute top-14 left-1/2 -translate-x-1/2 h-12 w-12 z-20">
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
                        <span className="text-md uppercase tracking-tight"> OPS </span>{" "}
                        <WordCarousel />
                    </span>

                    <button ref={btnRef} type="button" className="btn">
                        <span className="label">
                            <span className="main"> See how we create outcomes </span>
                            <span className="alt"> Explore our work → </span>
                        </span>
                    </button>
                </div>

                <div className="hero-name"> AKHIL SHETTY </div>

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

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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
        </section>
    );
};

const HeroSection = memo(HeroSectionComponent);

export default HeroSection;