"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
    simulationVertexShader,
    simulationFragmentShader,
    renderVertexShader,
    renderFragmentShader,
} from "@/utils/shaders";

export default function Hero() {
    const mountRef = useRef(null);
    const threeRef = useRef({});

    useEffect(() => {
        let isMounted = true;

        async function init() {
            if (!mountRef.current) return;

            // 🔥 LOAD CUSTOM FONT
            const font = new FontFace(
                "AkhilFont",
                "url(/fonts/Arehalfsenough.ttf)"
            );

            await font.load();
            document.fonts.add(font);

            if (!isMounted) return;

            const container = mountRef.current;

            const scene = new THREE.Scene();
            const simScene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: false,
            });

            const DPR = Math.min(window.devicePixelRatio, 2);

            const getSize = () => {
                const rect = container.getBoundingClientRect();
                return {
                    width: rect.width,
                    height: rect.height,
                };
            };

            let { width, height } = getSize();

            renderer.setPixelRatio(DPR);
            renderer.setSize(width, height);
            renderer.setClearColor(0xffffff, 1);

            container.appendChild(renderer.domElement);

            const mouse = new THREE.Vector2(-10, -10);
            let frame = 0;

            let simWidth = width * DPR;
            let simHeight = height * DPR;

            const options = {
                format: THREE.RGBAFormat,
                type: THREE.FloatType,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                stencilBuffer: false,
                depthBuffer: false,
            };

            let rtA = new THREE.WebGLRenderTarget(simWidth, simHeight, options);
            let rtB = new THREE.WebGLRenderTarget(simWidth, simHeight, options);

            const simMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    textureA: { value: null },
                    mouse: { value: mouse },
                    resolution: { value: new THREE.Vector2(simWidth, simHeight) },
                    time: { value: 0 },
                    frame: { value: 0 },
                },
                vertexShader: simulationVertexShader,
                fragmentShader: simulationFragmentShader,
            });

            const renderMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    textureA: { value: null },
                    textureB: { value: null },
                },
                vertexShader: renderVertexShader,
                fragmentShader: renderFragmentShader,
            });

            const plane = new THREE.PlaneGeometry(2, 2);
            const simQuad = new THREE.Mesh(plane, simMaterial);
            const renderQuad = new THREE.Mesh(plane, renderMaterial);

            simScene.add(simQuad);
            scene.add(renderQuad);

            // 🎨 CANVAS TEXT
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            function drawText(w, h) {
                canvas.width = w;
                canvas.height = h;

                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, w, h);

                const fontSize = Math.round(w * 0.12);

                ctx.fillStyle = "#111111";
                ctx.font = `800 ${fontSize}px AkhilFont`;

                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                ctx.fillText(
                    "AKHIL SHETTY",
                    w / 2.4,
                    h * 0.75
                );
            }

            drawText(simWidth, simHeight);
            const textTexture = new THREE.CanvasTexture(canvas);

            let lastMove = 0;

            const handleMouseMove = (e) => {
                const rect = renderer.domElement.getBoundingClientRect();

                mouse.x = (e.clientX - rect.left) * DPR;
                mouse.y = (rect.bottom - e.clientY) * DPR;

                lastMove = performance.now();
            };

            renderer.domElement.addEventListener("mousemove", handleMouseMove);

            const handleResize = () => {
                const size = getSize();
                width = size.width;
                height = size.height;

                simWidth = width * DPR;
                simHeight = height * DPR;

                renderer.setSize(width, height);

                rtA.setSize(simWidth, simHeight);
                rtB.setSize(simWidth, simHeight);

                simMaterial.uniforms.resolution.value.set(simWidth, simHeight);

                drawText(simWidth, simHeight);
                textTexture.needsUpdate = true;
            };

            window.addEventListener("resize", handleResize);

            let raf;

            const animate = () => {
                simMaterial.uniforms.frame.value = frame++;

                if (performance.now() - lastMove > 80) {
                    mouse.set(-10, -10);
                }

                simMaterial.uniforms.textureA.value = rtA.texture;

                renderer.setRenderTarget(rtB);
                renderer.render(simScene, camera);

                renderMaterial.uniforms.textureA.value = rtB.texture;
                renderMaterial.uniforms.textureB.value = textTexture;

                renderer.setRenderTarget(null);
                renderer.render(scene, camera);

                [rtA, rtB] = [rtB, rtA];

                raf = requestAnimationFrame(animate);
            };

            animate();

            threeRef.current = {
                renderer,
                rtA,
                rtB,
                simMaterial,
                renderMaterial,
                plane,
                textTexture,
                handleResize,
                handleMouseMove,
                raf,
            };

            return () => {
                cancelAnimationFrame(raf);

                renderer.dispose();
                rtA.dispose();
                rtB.dispose();
                simMaterial.dispose();
                renderMaterial.dispose();
                plane.dispose();
                textTexture.dispose();

                window.removeEventListener("resize", handleResize);
                renderer.domElement.removeEventListener("mousemove", handleMouseMove);

                if (container && renderer.domElement) {
                    container.removeChild(renderer.domElement);
                }
            };
        }

        init();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="w-full h-screen flex items-center justify-center bg-white">
            <div ref={mountRef} className="w-300 h-35 border-2 border-black overflow-hidden" />
        </div>
    );
}