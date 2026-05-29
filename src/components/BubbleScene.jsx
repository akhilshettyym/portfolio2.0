"use client";

import gsap from "gsap";
import * as THREE from "three";
import "@/styles/bubblescene.css";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { RADII, POSITIONS, TEXTURE_PATHS } from "@/utils/basic-utils";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function BubbleScene() {

    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;

        if (!canvas || !wrapper) return;

        let animationFrameId;
        let loadingComplete = false;
        let animationStarted = false;
        let mouseMoveTimeout;
        let resizeObserver;

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog("#ffffff", 18, 48);

        const camera = new THREE.PerspectiveCamera(28, wrapper.clientWidth / wrapper.clientHeight, 0.1, 1000);
        camera.position.z = 24;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.045;

        controls.enableRotate = false;
        controls.enableZoom = false;
        controls.enablePan = false;

        const loader = new THREE.TextureLoader();

        const textures = TEXTURE_PATHS.map((name) => {
            const texture = loader.load(`/bubbles/bubbles.${name}.svg`);
            texture.colorSpace = THREE.SRGBColorSpace;
            return texture;
        });

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight("#dbeafe", 0.75);
        directionalLight.position.set(8, 12, 10);
        scene.add(directionalLight);

        const group = new THREE.Group();
        scene.add(group);

        const bubbles = [];
        POSITIONS.forEach((pos, index) => {
            const radius = RADII[index] ?? 0.5;
            const randomTexture = textures[Math.floor(Math.random() * textures.length)];

            const material = new THREE.SpriteMaterial({
                map: randomTexture,
                transparent: true,
                depthWrite: false,
            });

            const bubble = new THREE.Sprite(material);
            const scale = radius * 2.6;

            bubble.scale.set(scale, scale, scale);
            bubble.position.set(pos.x, -20, pos.z);

            bubble.userData = {
                originalPosition: {
                    x: pos.x,
                    y: pos.y,
                    z: pos.z,
                },

                velocity: new THREE.Vector3(),
                radius,
                hovered: false,
                floatOffset: Math.random() * Math.PI * 2,
            };

            bubbles.push(bubble);
            group.add(bubble);
        });

        const damping = 0.965;
        const mouseForce = 0.012;
        const returnStrength = 0.012;
        const floatSpeed = 0.0007;
        const floatAmplitude = 0.18;
        const hoverScale = 2.9;

        const mouse = new THREE.Vector2(-10, -10);
        const raycaster = new THREE.Raycaster();
        const tempVector = new THREE.Vector3();

        function startAnimation() {
            if (animationStarted) return;

            animationStarted = true;

            bubbles.forEach((bubble, i) => {
                const delay = i * 0.025;

                gsap.to(bubble.position, {
                    x: bubble.userData.originalPosition.x,
                    y: bubble.userData.originalPosition.y,
                    z: bubble.userData.originalPosition.z,

                    duration: 1.8,
                    delay,
                    ease: "power3.out",
                });

                gsap.fromTo(
                    bubble.scale,
                    {
                        x: 0,
                        y: 0,
                    },
                    {
                        x: bubble.userData.radius * 2.6,
                        y: bubble.userData.radius * 2.6,

                        duration: 1.4,
                        delay,
                        ease: "elastic.out(1, 0.75)",
                    }
                );
            });

            setTimeout(() => {
                loadingComplete = true;
            }, 1800);
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
                        startAnimation();
                    }
                });
            },
            {
                threshold: [0.45],
            }
        );

        observer.observe(wrapper);

        const onMouseMove = (event) => {
            const rect = wrapper.getBoundingClientRect();

            const isInside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;

            if (!isInside) {
                mouse.x = -10;
                mouse.y = -10;
                return;
            }

            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            clearTimeout(mouseMoveTimeout);

            mouseMoveTimeout = setTimeout(() => {
                mouse.x = -10;
                mouse.y = -10;
            }, 140);
        };

        window.addEventListener("mousemove", onMouseMove);

        function handleCollisions() {
            for (let i = 0; i < bubbles.length; i++) {
                const bubbleA = bubbles[i];

                for (let j = i + 1; j < bubbles.length; j++) {
                    const bubbleB = bubbles[j];

                    const radiusA = bubbleA.userData.radius;
                    const radiusB = bubbleB.userData.radius;

                    const minDistance = (radiusA + radiusB) * 1.35;
                    const distance = bubbleA.position.distanceTo(bubbleB.position);

                    if (distance > 0 && distance < minDistance) {
                        tempVector.subVectors(
                            bubbleB.position,
                            bubbleA.position
                        );

                        tempVector.normalize();

                        const overlap = minDistance - distance;
                        const correction = overlap * 0.012;

                        bubbleA.position.add(tempVector.clone().multiplyScalar(-correction));
                        bubbleB.position.add(tempVector.clone().multiplyScalar(correction));
                    }
                }
            }
        }

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            const time = performance.now() * floatSpeed;

            if (loadingComplete) {
                let intersects = [];

                if (mouse.x !== -10 && mouse.y !== -10) {
                    raycaster.setFromCamera(mouse, camera);
                    intersects = raycaster.intersectObjects(bubbles);
                }

                bubbles.forEach((bubble) => {
                    const { originalPosition, velocity, floatOffset } = bubble.userData;

                    const targetY = originalPosition.y + Math.sin(time + floatOffset) * floatAmplitude;
                    const targetX = originalPosition.x + Math.cos(time * 0.8 + floatOffset) * .08;
                    const targetZ = originalPosition.z + Math.sin(time * 0.65 + floatOffset) * 0.12;

                    velocity.x += (targetX - bubble.position.x) * returnStrength;
                    velocity.y += (targetY - bubble.position.y) * returnStrength;
                    velocity.z += (targetZ - bubble.position.z) * returnStrength;

                    let isHovered = false;

                    intersects.forEach((hit) => {
                        if (hit.object === bubble) {
                            isHovered = true;

                            const pushDirection = new THREE.Vector3().subVectors(bubble.position, hit.point).normalize();
                            velocity.add(pushDirection.multiplyScalar(mouseForce)
                            );
                        }
                    });

                    if (isHovered && !bubble.userData.hovered) {
                        bubble.userData.hovered = true;

                        gsap.to(bubble.scale, {
                            x: bubble.userData.radius * hoverScale,
                            y: bubble.userData.radius * hoverScale,
                            duration: 0.4,
                            ease: "power3.out",
                        });
                    }

                    if (!isHovered && bubble.userData.hovered) {
                        bubble.userData.hovered = false;

                        gsap.to(bubble.scale, {
                            x: bubble.userData.radius * 2.6,
                            y: bubble.userData.radius * 2.6,

                            duration: 0.7,
                            ease: "power3.out",
                        });
                    }

                    velocity.multiplyScalar(damping);

                    bubble.position.add(velocity);
                    bubble.lookAt(camera.position);
                });

                handleCollisions();
            }

            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        const onResize = () => {
            const width = wrapper.clientWidth;
            const height = wrapper.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(wrapper);

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(mouseMoveTimeout);

            observer.disconnect();
            resizeObserver?.disconnect();
            window.removeEventListener("mousemove", onMouseMove);
            controls.dispose();
            renderer.dispose();
            textures.forEach((texture) => texture.dispose());
            bubbles.forEach((bubble) => { bubble.material.dispose() });
        };
    }, []);

    return (
        <section className="bubble-wrapper" style={{ height: "600px" }}>
            <div ref={wrapperRef} className="bubble-scene-panel" style={{ height: "100%", position: "relative", borderRadius: "36px", overflow: "hidden", background: `adial-gradient(circle at top, rgba(255,255,255,0.95) 0%, rgba(244,247,255,0.82) 35%, rgba(235,242,255,0.55) 65%, rgba(255,255,255,0.18) 100%)` }}>
                <div className="bubble-radial-bg" style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at center, rgba(191,219,254,0.18), rgba(255,255,255,0))` }} />

                <canvas ref={canvasRef} />

                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true, amount: 0.4 }} className="bubble-content absolute bottom-0 left-0 z-20 w-full p-10">
                    <div className="max-w-2xl">
                        <div className="border-b border-black/10 pb-3">
                            <div className="grid grid-cols-[100px_1fr]">
                                <div className="flex items-start">
                                    <p className="text-[35px] font-semibold text-gray-300"> 01. </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[20px] font-bold text-gray-600"> Systems &amp; Ecosystem </p>

                                    <div className="flex flex-wrap gap-1">
                                        <div className="rounded-full bg-gray-100 px-2 py-2 backdrop-blur-sm">
                                            <p className="text-[10px] leading-none text-gray-400"> a.
                                                <span className="text-slate-500"> {" "}
                                                    Interactive Interfaces{" "}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="rounded-full bg-gray-100 px-2 py-2 backdrop-blur-sm">
                                            <p className="text-[10px] leading-none text-gray-400"> b.
                                                <span className="text-slate-500"> {" "}
                                                    Services &amp; APIs{" "}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="rounded-full bg-gray-100 px-2 py-2 backdrop-blur-sm">
                                            <p className="text-[10px] leading-none text-gray-400"> c.
                                                <span className="text-slate-500"> {" "}
                                                    Cloud Infrastructure{" "}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="grid grid-cols-[100px_1fr]">
                                <div className="flex items-start">
                                    <p className="text-[35px] font-semibold text-gray-300"> 02. </p>
                                </div>

                                <div className="space-y-1 mt-2">
                                    <p className="text-[20px] font-bold text-gray-600"> Core Architecture Framework </p>

                                    <div className="flex flex-wrap gap-1">
                                        <div className="rounded-full bg-gray-100 px-2 py-2 backdrop-blur-sm">
                                            <p className="text-[10px] leading-none text-gray-400"> a.
                                                <span className="text-slate-500"> {" "}
                                                    Distributed Environments{" "}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="rounded-full bg-gray-100 px-2 py-2 backdrop-blur-sm">
                                            <p className="text-[10px] leading-none text-gray-400"> b.
                                                <span className="text-slate-500"> {" "}
                                                    Client-Side Interfaces{" "}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="rounded-full bg-gray-100 px-2 py-2 backdrop-blur-sm">
                                            <p className="text-[10px] leading-none text-gray-400"> c.
                                                <span className="text-slate-500"> {" "}
                                                    Automated Deployments{" "}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}