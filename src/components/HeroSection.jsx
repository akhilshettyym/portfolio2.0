"use client";

import "@/styles/clouds.css";
import * as THREE from "three";
import { motion } from "framer-motion";
import GlitchText from "./basic/GlitchText";
import WeatherIcon from "./basic/WeatherIcon";
import WordCarousel from "./basic/WordCarousel";
import { CLOUD_SHADER } from "@/utils/shader-utils";
import { getWeatherScene } from "../utils/weather-scene";
import { HiMiniPlay, HiMiniPause } from "react-icons/hi2";
import { startTransition, useEffect, useRef, useState, memo } from "react";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

function isSameScene(a, b) {
    if (!a || !b) return false;
    return (
        a.background === b.background &&
        a.clouds === b.clouds
    );
}

const HeroSectionComponent = () => {

    const btnRef = useRef(null);
    const speedRef = useRef(0.8);
    const containerRef = useRef(null);
    const tunnelPositionRef = useRef(0);

    const [paused, setPaused] = useState(false);
    const [sceneAssets, setSceneAssets] = useState(null);

    const pausedRef = useRef(false);
    const sceneAssetsRef = useRef(null);

    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    useEffect(() => {
        try {
            const cachedScene = localStorage.getItem("weatherSceneAssets");

            if (cachedScene) {
                const parsed = JSON.parse(cachedScene);
                sceneAssetsRef.current = parsed;

                startTransition(() => {
                    setSceneAssets(parsed);
                });
            }

            const cloudControl = localStorage.getItem("cloudControl");

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
                    if (isSameScene(prev, nextScene)) {
                        return prev;
                    }

                    localStorage.setItem("weatherSceneAssets", JSON.stringify(nextScene));
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

                    localStorage.setItem("weatherSceneAssets", JSON.stringify(fallback));

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

    // useEffect(() => {
    //     if (!sceneAssets) return;
    //     const container = containerRef.current;
    //     const btn = btnRef.current;

    //     if (!container) return;

    //     let mesh;
    //     let mesh2;
    //     let camera;
    //     let texture;
    //     let material;
    //     let renderer;
    //     let threeScene;
    //     let isAnimating = true;

    //     let mouseX = 0;
    //     let mouseY = 0;
    //     let windowHalfX = window.innerWidth / 2;
    //     let windowHalfY = window.innerHeight / 2;
    //     let animationId;

    //     const onMouseMove = (e) => {
    //         if (pausedRef.current || !isAnimating) return;

    //         mouseX = (e.clientX - windowHalfX) * 0.25;
    //         mouseY = (e.clientY - windowHalfY) * 0.15;
    //     };

    //     const onResize = () => {
    //         windowHalfX = window.innerWidth / 2;
    //         windowHalfY = window.innerHeight / 2;

    //         if (!camera || !renderer || !isAnimating) return;

    //         camera.aspect = window.innerWidth / window.innerHeight;
    //         camera.updateProjectionMatrix();
    //         renderer.setSize(window.innerWidth, window.innerHeight);
    //         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    //     };

    //     const animate = () => {
    //         if (!isAnimating) return;

    //         animationId = requestAnimationFrame(animate);

    //         if (camera) {
    //             const targetSpeed = pausedRef.current ? 0 : 0.8;
    //             speedRef.current += (targetSpeed - speedRef.current) * 0.025;
    //             tunnelPositionRef.current += speedRef.current;

    //             const mouseFactor = pausedRef.current ? 0 : 1;
    //             camera.position.x += ((mouseX * mouseFactor) - camera.position.x) * 0.01;
    //             camera.position.y += ((-mouseY * mouseFactor) - camera.position.y) * 0.01;
    //             camera.position.z = -(tunnelPositionRef.current % 8000) + 8000;
    //         }

    //         if (renderer && threeScene && camera) {
    //             renderer.render(threeScene, camera);
    //         }
    //     };

    //     const handleBtnMouseMove = (e) => {
    //         if (!btn) return;

    //         const rect = btn.getBoundingClientRect();
    //         const x = e.clientX - rect.left - rect.width / 2;
    //         const y = e.clientY - rect.top - rect.height / 2;

    //         btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    //     };

    //     const handleBtnMouseLeave = () => {
    //         if (!btn) return;
    //         btn.style.transform = "translate(0px, 0px)";
    //     };

    //     threeScene = new THREE.Scene();

    //     camera = new THREE.PerspectiveCamera(30,
    //         window.innerWidth / window.innerHeight,
    //         1, 3000
    //     );

    //     camera.position.z = 6000;

    //     renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    //     renderer.setSize(window.innerWidth, window.innerHeight);
    //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    //     container.appendChild(renderer.domElement);

    //     const textureLoader = new THREE.TextureLoader();

    //     textureLoader.load(`/clouds/${sceneAssets?.clouds}.svg`, (loadedTexture) => {
    //         texture = loadedTexture;

    //         texture.colorSpace = THREE.SRGBColorSpace;

    //         texture.generateMipmaps = false;
    //         texture.magFilter = THREE.LinearFilter;
    //         texture.minFilter = THREE.LinearFilter;
    //         texture.needsUpdate = true;

    //         const fog = new THREE.Fog(0xffffff, -100, 3000);
    //         threeScene.fog = fog;

    //         material = new THREE.ShaderMaterial({
    //             uniforms: {
    //                 map: { value: texture },
    //                 fogColor: { value: fog.color },
    //                 fogNear: { value: fog.near },
    //                 fogFar: { value: fog.far },
    //             },
    //             vertexShader: CLOUD_SHADER.vertexShader,
    //             fragmentShader: CLOUD_SHADER.fragmentShader,
    //             depthWrite: false,
    //             depthTest: false,
    //             transparent: true,
    //         });

    //         const planeGeo = new THREE.PlaneGeometry(64, 64);
    //         const planeObj = new THREE.Object3D();
    //         const geometries = [];

    //         for (let i = 0; i < 8000; i++) {
    //             planeObj.position.x = Math.random() * 1000 - 500;
    //             planeObj.position.y = -Math.random() * Math.random() * 200 - 15;
    //             planeObj.position.z = i;
    //             planeObj.rotation.z = Math.random() * Math.PI;
    //             planeObj.scale.x = planeObj.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

    //             planeObj.updateMatrix();

    //             const cloned = planeGeo.clone();
    //             cloned.applyMatrix4(planeObj.matrix);
    //             geometries.push(cloned);
    //         }

    //         const mergedGeo = BufferGeometryUtils.mergeGeometries(geometries);

    //         mesh = new THREE.Mesh(mergedGeo, material);
    //         mesh.renderOrder = 2;

    //         mesh2 = mesh.clone();
    //         mesh2.position.z = -8000;
    //         mesh2.renderOrder = 1;

    //         threeScene.add(mesh);
    //         threeScene.add(mesh2);

    //         planeGeo.dispose();
    //         animate();
    //     });

    //     window.addEventListener("mousemove", onMouseMove);
    //     window.addEventListener("resize", onResize);

    //     if (btn) {
    //         btn.addEventListener("mousemove", handleBtnMouseMove);
    //         btn.addEventListener("mouseleave", handleBtnMouseLeave);
    //     }

    //     return () => {
    //         isAnimating = false;

    //         window.removeEventListener("mousemove", onMouseMove);
    //         window.removeEventListener("resize", onResize);

    //         if (btn) {
    //             btn.removeEventListener("mousemove", handleBtnMouseMove);
    //             btn.removeEventListener("mouseleave", handleBtnMouseLeave);
    //             btn.style.transform = "translate(0px, 0px)";
    //         }

    //         if (animationId) cancelAnimationFrame(animationId);

    //         if (mesh) {
    //             threeScene?.remove(mesh);
    //             mesh.geometry?.dispose?.();
    //             mesh = null;
    //         }

    //         if (mesh2) {
    //             threeScene?.remove(mesh2);
    //             mesh2.geometry?.dispose?.();
    //             mesh2 = null;
    //         }

    //         if (material) {
    //             material.dispose();
    //             material = null;
    //         }
    //         if (texture) {
    //             texture.dispose();
    //             texture = null;
    //         }

    //         if (renderer) {
    //             renderer.dispose();
    //             if (container && container.contains(renderer.domElement)) {
    //                 container.removeChild(renderer.domElement);
    //             }
    //             renderer = null;
    //         }

    //         if (threeScene) {
    //             threeScene = null;
    //         }
    //     };
    // }, [sceneAssets]);

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
            if (pausedRef.current || !isAnimating) return;

            mouseX = (e.clientX - windowHalfX) * 0.25;
            mouseY = (e.clientY - windowHalfY) * 0.15;
        };

        const onResize = () => {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            if (!camera || !renderer || !isAnimating) return;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );

            renderer.setPixelRatio(
                Math.min(window.devicePixelRatio, 2)
            );
        };

        const animate = () => {
            if (!isAnimating || isDisposed) return;

            animationId = requestAnimationFrame(animate);

            const targetSpeed = pausedRef.current ? 0 : 0.8;

            speedRef.current +=
                (targetSpeed - speedRef.current) * 0.025;

            tunnelPositionRef.current +=
                speedRef.current;

            if (camera) {
                const mouseFactor =
                    pausedRef.current ? 0 : 1;

                camera.position.x +=
                    ((mouseX * mouseFactor) -
                        camera.position.x) *
                    0.01;

                camera.position.y +=
                    ((-mouseY * mouseFactor) -
                        camera.position.y) *
                    0.01;

                camera.position.z =
                    -(tunnelPositionRef.current % 8000) +
                    8000;
            }

            if (renderer && camera) {
                renderer.render(scene, camera);
            }
        };

        const handleBtnMouseMove = (e) => {
            if (!btn) return;

            const rect = btn.getBoundingClientRect();

            const x =
                e.clientX -
                rect.left -
                rect.width / 2;

            const y =
                e.clientY -
                rect.top -
                rect.height / 2;

            btn.style.transform =
                `translate(${x * 0.2}px, ${y * 0.2}px)`;
        };

        const handleBtnMouseLeave = () => {
            if (!btn) return;
            btn.style.transform = "translate(0px, 0px)";
        };

        async function init() {
            try {
                camera = new THREE.PerspectiveCamera(
                    30,
                    window.innerWidth /
                    window.innerHeight,
                    1,
                    3000
                );

                camera.position.z = 6000;

                renderer = new THREE.WebGLRenderer({
                    alpha: true,
                    antialias: false,
                    powerPreference:
                        "high-performance",
                });

                renderer.setSize(
                    window.innerWidth,
                    window.innerHeight
                );

                renderer.setPixelRatio(
                    Math.min(window.devicePixelRatio, 2)
                );

                renderer.outputColorSpace =
                    THREE.SRGBColorSpace;

                container.appendChild(
                    renderer.domElement
                );

                const textureLoader =
                    new THREE.TextureLoader();

                texture =
                    await textureLoader.loadAsync(
                        `/clouds/${sceneAssets.clouds}.svg`
                    );

                if (isDisposed) return;

                texture.colorSpace =
                    THREE.SRGBColorSpace;

                texture.generateMipmaps = false;
                texture.magFilter =
                    THREE.LinearFilter;
                texture.minFilter =
                    THREE.LinearFilter;
                texture.needsUpdate = true;

                const fog = new THREE.Fog(
                    0xffffff,
                    -100,
                    3000
                );

                scene.fog = fog;

                material =
                    new THREE.ShaderMaterial({
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

                        vertexShader:
                            CLOUD_SHADER.vertexShader,

                        fragmentShader:
                            CLOUD_SHADER.fragmentShader,

                        depthWrite: false,
                        depthTest: false,
                        transparent: true,
                    });

                const planeGeo =
                    new THREE.PlaneGeometry(
                        64,
                        64
                    );

                const planeObj =
                    new THREE.Object3D();

                const geometries = [];

                for (
                    let i = 0;
                    i < 8000;
                    i++
                ) {
                    planeObj.position.x =
                        Math.random() * 1000 -
                        500;

                    planeObj.position.y =
                        -Math.random() *
                        Math.random() *
                        200 -
                        15;

                    planeObj.position.z = i;

                    planeObj.rotation.z =
                        Math.random() * Math.PI;

                    planeObj.scale.x =
                        planeObj.scale.y =
                        Math.random() *
                        Math.random() *
                        1.5 +
                        0.5;

                    planeObj.updateMatrix();

                    const cloned =
                        planeGeo.clone();

                    cloned.applyMatrix4(
                        planeObj.matrix
                    );

                    geometries.push(cloned);
                }

                const mergedGeo =
                    BufferGeometryUtils.mergeGeometries(
                        geometries
                    );

                geometries.forEach((g) =>
                    g.dispose()
                );

                mesh = new THREE.Mesh(
                    mergedGeo,
                    material
                );

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
                    console.error(
                        "Cloud scene init failed:",
                        error
                    );
                }
            }
        }

        init();

        window.addEventListener(
            "mousemove",
            onMouseMove
        );

        window.addEventListener(
            "resize",
            onResize
        );

        if (btn) {
            btn.addEventListener(
                "mousemove",
                handleBtnMouseMove
            );

            btn.addEventListener(
                "mouseleave",
                handleBtnMouseLeave
            );
        }

        return () => {
            isDisposed = true;
            isAnimating = false;

            window.removeEventListener(
                "mousemove",
                onMouseMove
            );

            window.removeEventListener(
                "resize",
                onResize
            );

            if (btn) {
                btn.removeEventListener(
                    "mousemove",
                    handleBtnMouseMove
                );

                btn.removeEventListener(
                    "mouseleave",
                    handleBtnMouseLeave
                );

                btn.style.transform =
                    "translate(0px, 0px)";
            }

            if (animationId) {
                cancelAnimationFrame(
                    animationId
                );
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

                if (
                    container.contains(
                        renderer.domElement
                    )
                ) {
                    container.removeChild(
                        renderer.domElement
                    );
                }
            }
        };
    }, [sceneAssets]);
    
    const handleCloudControl = () => {
        setPaused((prev) => {
            const nextState = !prev;
            localStorage.setItem("cloudControl", nextState);
            return nextState;
        });
    };

    return (
        <section className="relative min-h-screen w-full overflow-hidden text-white pb-8 md:pb-12">
            <div className="wrapper">

                <div ref={containerRef} className="canvas-bg" style={{ backgroundImage: sceneAssets ? `linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.05)), url("/clouds_background/${sceneAssets.background}.png")` : "none" }} />

                <button type="button" onClick={handleCloudControl} aria-label={paused ? "Resume animation" : "Pause animation"} className="absolute top-60 right-8 z-9999 flex items-center justify-center h-12 w-12 group ">
                    <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" style={{ animation: "spin 18s linear infinite" }}>

                        <defs>
                            <path id="hero-control-ring" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
                        </defs>

                        <text fill="rgba(0,0,0,0.3)" fontSize="10" letterSpacing="2.5" className="uppercase">
                            <textPath href="#hero-control-ring" startOffset="0%">
                                CONTROL THE CLOUDS • CONTROL THE CLOUDS •
                            </textPath>
                        </text>
                    </svg>

                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/10 backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:border-white/25">
                        {paused ? (
                            <>
                                <HiMiniPlay size={18} className="translate-x-px text-white/90" />
                                <div className="absolute right-full top-1/2 -translate-y-1/2 hidden group-hover:block pointer-events-none drop-shadow-md">
                                    <svg width="40" height="100" viewBox="0 0 2 100" className="overflow-visible">
                                        <defs>
                                            <path id="leftTextCurve" d="M 40,89 A 40,40 0 0,1 35,10" fill="transparent" />
                                        </defs>
                                        <text className="fill-slate-700 font-bold text-[8px] uppercase">
                                            <textPath href="#leftTextCurve" startOffset="50%" textAnchor="middle"> Run Clouds </textPath>
                                        </text>
                                    </svg>
                                </div>
                            </>
                        ) : (
                            <>
                                <HiMiniPause size={18} className="text-white/90" />
                                <div className="absolute right-full top-1/2 -translate-y-1/2 hidden group-hover:block pointer-events-none drop-shadow-md">
                                    <svg width="40" height="100" viewBox="0 0 2 100" className="overflow-visible">
                                        <defs>
                                            <path id="leftTextCurve" d="M 39,89 A 40,40 0 0,1 35,10" fill="transparent" />
                                        </defs>
                                        <text className="fill-slate-700 font-bold text-[8px] uppercase">
                                            <textPath href="#leftTextCurve" startOffset="50%" textAnchor="middle"> Stall Clouds </textPath>
                                        </text>
                                    </svg>
                                </div>
                            </>
                        )}
                    </div>
                </button>

                <div className="absolute top-80 right-8 z-9999 flex items-center justify-center h-12 w-12 group">
                    {sceneAssets && (<WeatherIcon />)}
                </div>

                <div className="hero-text">
                    <span className="line dim uppercase">
                        BUILD SYSTEMS <br />
                    </span>
                    <span className="line dim uppercase">
                        OPTIMIZE SCALE × LATENCY <br />
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

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="absolute bottom-0 left-0 w-full z-50 pointer-events-none text-gray-400">
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