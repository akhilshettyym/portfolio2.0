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

    useEffect(() => {
        if (!mountRef.current) return;

        const container = mountRef.current;

        const scene = new THREE.Scene();
        const simScene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const text = "AKHIL SHETTY";
        const fontSize = 60;

        ctx.font = `900 ${fontSize}px Arial`;

        const textWidth = ctx.measureText(text).width;
        const paddingX = 50;
        const paddingY = 50;

        const width = textWidth + paddingX;
        const height = fontSize + paddingY;

        canvas.width = width;
        canvas.height = height;

        function drawText() {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = "#000000";
            ctx.font = `1000 ${fontSize}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(text, width / 2, height / 2);
        }

        drawText();

        const textTexture = new THREE.CanvasTexture(canvas);

        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        const options = {
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
        };

        let rtA = new THREE.WebGLRenderTarget(width, height, options);
        let rtB = new THREE.WebGLRenderTarget(width, height, options);

        const mouse = new THREE.Vector2(-10, -10);
        const prevMouse = new THREE.Vector2(-10, -10);
        const velocity = new THREE.Vector2(0, 0);

        let lastMoveTime = performance.now();

        const handleMouseMove = (e) => {
            const rect = renderer.domElement.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = rect.bottom - e.clientY;

            mouse.set(x, y);

            velocity.x = x - prevMouse.x;
            velocity.y = y - prevMouse.y;

            prevMouse.set(x, y);

            lastMoveTime = performance.now();
        };

        renderer.domElement.addEventListener("mousemove", handleMouseMove);

        const simMaterial = new THREE.ShaderMaterial({
            uniforms: {
                textureA: { value: null },
                mouse: { value: mouse },
                velocity: { value: velocity },
                resolution: { value: new THREE.Vector2(width, height) },
                frame: { value: 0 },

                decay: { value: 0.90 },
                strength: { value: 1.4 },
            },
            vertexShader: simulationVertexShader,
            fragmentShader: simulationFragmentShader,
        });

        const renderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                textureA: { value: null },
                textureB: { value: textTexture },
            },
            vertexShader: renderVertexShader,
            fragmentShader: `
                uniform sampler2D textureA;
                uniform sampler2D textureB;
                varying vec2 vUv;

                void main() {
                    vec4 sim = texture2D(textureA, vUv);
                    vec4 text = texture2D(textureB, vUv);
                    vec2 uv = vUv + sim.zw * 0.35;
                    vec4 finalText = texture2D(textureB, uv);
                    float mask = step(0.5, 1.0 - finalText.r);
                    vec3 color = vec3(0.0);
                    gl_FragColor = vec4(color, mask);
                }
            `,
            transparent: true,
        });

        const plane = new THREE.PlaneGeometry(2, 2);

        simScene.add(new THREE.Mesh(plane, simMaterial));
        scene.add(new THREE.Mesh(plane, renderMaterial));

        let frame = 0;
        let raf;

        const animate = () => {
            frame++;

            const now = performance.now();

            if (now - lastMoveTime > 120) {
                velocity.multiplyScalar(0.85);
                mouse.set(-10, -10);
            } else {
                velocity.multiplyScalar(0.92);
            }

            simMaterial.uniforms.frame.value = frame;
            simMaterial.uniforms.textureA.value = rtA.texture;

            renderer.setRenderTarget(rtB);
            renderer.render(simScene, camera);

            renderMaterial.uniforms.textureA.value = rtB.texture;

            renderer.setRenderTarget(null);
            renderer.render(scene, camera);

            [rtA, rtB] = [rtB, rtA];

            raf = requestAnimationFrame(animate);
        };

        animate();


        return () => {
            cancelAnimationFrame(raf);

            renderer.dispose();
            rtA.dispose();
            rtB.dispose();
            simMaterial.dispose();
            renderMaterial.dispose();
            plane.dispose();
            textTexture.dispose();

            renderer.domElement.removeEventListener("mousemove", handleMouseMove);

            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div className="inline-block">
            <div ref={mountRef} />
        </div>
    );
}