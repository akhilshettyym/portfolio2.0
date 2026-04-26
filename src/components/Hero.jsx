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
            alpha: false, // IMPORTANT: no transparency confusion
        });

        const DPR = Math.min(window.devicePixelRatio, 2);
        renderer.setPixelRatio(DPR);

        // FORCE WHITE BACKGROUND
        renderer.setClearColor(0xffffff, 1);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const text = "AKHIL SHETTY";
        const fontSize = 40;

        ctx.font = `900 ${fontSize}px Inter, Helvetica, Arial`;

        const textWidth = ctx.measureText(text).width;

        const padding = 30;
        const width = Math.ceil(textWidth + padding * 2);
        const height = Math.ceil(fontSize + padding * 2);

        canvas.width = width;
        canvas.height = height;

        function drawText() {
            // WHITE BG
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);

            ctx.save();
            ctx.translate(width / 2, height / 2);

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.font = `900 ${fontSize}px Inter, Helvetica, Arial`;

            // BLACK TEXT
            ctx.fillStyle = "#000000";

            ctx.fillText(text, 0, 0);

            ctx.restore();
        }

        drawText();

        const textTexture = new THREE.CanvasTexture(canvas);
        textTexture.needsUpdate = true;

        renderer.setSize(width / DPR, height / DPR);
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

        let lastMove = 0;
        let frame = 0;

        const handleMouseMove = (e) => {
            const rect = renderer.domElement.getBoundingClientRect();

            mouse.x = (e.clientX - rect.left) * DPR;
            mouse.y = (rect.bottom - e.clientY) * DPR;

            lastMove = performance.now();
        };

        renderer.domElement.addEventListener("mousemove", handleMouseMove);

        const simMaterial = new THREE.ShaderMaterial({
            uniforms: {
                textureA: { value: null },
                mouse: { value: mouse },
                resolution: { value: new THREE.Vector2(width, height) },
                frame: { value: 0 },
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
            fragmentShader: renderFragmentShader,
            transparent: true,
        });

        const plane = new THREE.PlaneGeometry(2, 2);

        simScene.add(new THREE.Mesh(plane, simMaterial));
        scene.add(new THREE.Mesh(plane, renderMaterial));

        let raf;

        const animate = () => {
            frame++;

            if (performance.now() - lastMove > 80) {
                mouse.set(-10, -10);
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

    return <div ref={mountRef} />;
}