"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import anime from "animejs";
import { createNoise3D, createNoise4D } from "simplex-noise";

export default function ParticleScene() {
    const canvasRef = useRef(null);

    useEffect(() => {
        let scene, camera, renderer, controls, composer, bloomPass;
        let particlesGeometry, particlesMaterial, particleSystem;
        let clock;

        let currentShapeIndex = 0;
        let isMorphing = false;

        const CONFIG = {
            particleCount: 8000,
            shapeSize: 12,
            morphDuration: 2500,
            bloomStrength: 1.2,
            bloomRadius: 0.4,
            bloomThreshold: 0.1,
            colorScheme: "fire",
        };

        const noise3D = createNoise3D();
        const noise4D = createNoise4D();

        const SHAPES = [
            (count, size) => {
                const arr = new Float32Array(count * 3);
                for (let i = 0; i < count; i++) {
                    const t = Math.random() * Math.PI * 2;
                    const r = Math.random() * size;
                    arr[i * 3] = Math.cos(t) * r;
                    arr[i * 3 + 1] = (Math.random() - 0.5) * size;
                    arr[i * 3 + 2] = Math.sin(t) * r;
                }
                return arr;
            },
            (count, size) => {
                const arr = new Float32Array(count * 3);
                for (let i = 0; i < count; i++) {
                    const t = (i / count) * Math.PI * 10;
                    arr[i * 3] = Math.cos(t) * size;
                    arr[i * 3 + 1] = (i / count - 0.5) * size * 2;
                    arr[i * 3 + 2] = Math.sin(t) * size;
                }
                return arr;
            },
        ];

        function init() {
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            camera.position.z = 25;

            renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                antialias: true,
            });

            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            clock = new THREE.Clock();

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;

            // Lights
            scene.add(new THREE.AmbientLight(0xffffff, 0.6));

            const dir = new THREE.DirectionalLight(0xffffff, 1);
            dir.position.set(5, 10, 5);
            scene.add(dir);

            // Geometry
            particlesGeometry = new THREE.BufferGeometry();

            const positions = SHAPES[0](CONFIG.particleCount, CONFIG.shapeSize);

            particlesGeometry.setAttribute(
                "position",
                new THREE.BufferAttribute(positions, 3)
            );

            const material = new THREE.PointsMaterial({
                size: 0.08,
                color: new THREE.Color("black"), // ⚫ text-like black particles
                transparent: true,
                opacity: 0.9,
            });

            particleSystem = new THREE.Points(particlesGeometry, material);
            scene.add(particleSystem);

            setupPost();

            animate();
        }

        function setupPost() {
            composer = new EffectComposer(renderer);
            composer.addPass(new RenderPass(scene, camera));

            bloomPass = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                CONFIG.bloomStrength,
                CONFIG.bloomRadius,
                CONFIG.bloomThreshold
            );

            composer.addPass(bloomPass);
        }

        function morph() {
            if (isMorphing) return;
            isMorphing = true;

            const next = (currentShapeIndex + 1) % SHAPES.length;

            const from = particlesGeometry.attributes.position.array;
            const to = SHAPES[next](CONFIG.particleCount, CONFIG.shapeSize);

            anime({
                duration: CONFIG.morphDuration,
                easing: "easeInOutQuad",
                update: (anim) => {
                    const t = anim.progress / 100;

                    for (let i = 0; i < from.length; i++) {
                        from[i] += (to[i] - from[i]) * 0.03 * t;
                    }

                    particlesGeometry.attributes.position.needsUpdate = true;
                },
                complete: () => {
                    currentShapeIndex = next;
                    isMorphing = false;
                },
            });
        }

        function animate() {
            requestAnimationFrame(animate);

            const t = clock.getElapsedTime();

            particleSystem.rotation.y = t * 0.1;

            controls.update();
            composer.render();
        }

        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener("resize", onResize);
        window.addEventListener("click", morph);

        init();

        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("click", morph);

            renderer.dispose();
            scene.clear();
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 bg-white" />;
}