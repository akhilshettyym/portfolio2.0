"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const simulationVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const simulationFragmentShader = `
uniform sampler2D textureA;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;
uniform int frame;
varying vec2 vUv;

const float delta = 1.4;

void main() {
  vec2 uv = vUv;

  if (frame == 0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec4 data = texture2D(textureA, uv);
  float pressure = data.x;
  float pVel = data.y;

  vec2 texelSize = 1.0 / resolution;
  float p_right = texture2D(textureA, uv + vec2(texelSize.x, 0.0)).x;
  float p_left = texture2D(textureA, uv + vec2(-texelSize.x, 0.0)).x;
  float p_up = texture2D(textureA, uv + vec2(0.0, texelSize.y)).x;
  float p_down = texture2D(textureA, uv + vec2(0.0, -texelSize.y)).x;

  if (uv.x <= texelSize.x) p_left = p_right;
  if (uv.x >= 1.0 - texelSize.x) p_right = p_left;
  if (uv.y <= texelSize.y) p_down = p_up;
  if (uv.y >= 1.0 - texelSize.y) p_up = p_down;

  pVel += delta * (-2.0 * pressure + p_right + p_left) / 4.0;
  pVel += delta * (-2.0 * pressure + p_up + p_down) / 4.0;

  pressure += delta * pVel;
  pVel -= 0.005 * delta * pressure;
  pVel *= 1.0 - 0.002 * delta;
  pressure *= 0.999;

  vec2 mouseUV = mouse / resolution;
if (mouse.x > 0.0) {
  float radius = 0.035;
  float dist = distance(uv, mouseUV);

  if (dist <= radius) {
    pressure += 2.0 * (1.0 - dist / radius);
  }
}

  gl_FragColor = vec4(
    pressure,
    pVel,
    (p_right - p_left) / 2.0,
    (p_up - p_down) / 2.0
  );
}
`;

const renderVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const renderFragmentShader = `
uniform sampler2D textureA;
uniform sampler2D textureB;
varying vec2 vUv;

void main() {
  vec4 data = texture2D(textureA, vUv);

  vec2 distortion = 0.02 * data.zw;
  vec4 color = texture2D(textureB, vUv + distortion);

  vec3 normal = normalize(vec3(-data.z * 2.0, 0.5, -data.w * 2.0));
  vec3 lightDir = normalize(vec3(-3.0, 10.0, 3.0));
  float specular = pow(max(0.0, dot(normal, lightDir)), 60.0) * 1.5;

  gl_FragColor = color + vec4(vec3(specular), 0.0);
}
`;

export default function LiquidBackground() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        const scene = new THREE.Scene();
        const simScene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        const mouse = new THREE.Vector2();
        let frame = 0;
        let rafId = 0;

        const getRenderSize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            return {
                width: Math.floor(window.innerWidth * dpr),
                height: Math.floor(window.innerHeight * dpr),
                dpr,
            };
        };

        let { width, height } = getRenderSize();

        const options = {
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            stencilBuffer: false,
            depthBuffer: false,
        };

        let rtA = new THREE.WebGLRenderTarget(width, height, options);
        let rtB = new THREE.WebGLRenderTarget(width, height, options);

        const simMaterial = new THREE.ShaderMaterial({
            uniforms: {
                textureA: { value: null },
                mouse: { value: mouse },
                resolution: { value: new THREE.Vector2(width, height) },
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
            transparent: true,
        });

        const plane = new THREE.PlaneGeometry(2, 2);
        const simQuad = new THREE.Mesh(plane, simMaterial);
        const renderQuad = new THREE.Mesh(plane, renderMaterial);

        simScene.add(simQuad);
        scene.add(renderQuad);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { alpha: true });

        if (!ctx) return;

        const bgColor = "#93CCEA";
        const textColor = "#fef4b8";
        const titleText = "";

        const drawTextureText = (w, h) => {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, w, h);

            const fontSize = Math.round(250 * (window.devicePixelRatio || 1));
            ctx.fillStyle = textColor;
            ctx.font = `bold ${fontSize}px Test Sohne, system-ui, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.textRendering = "geometricPrecision";
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.fillText(titleText, w / 2, h / 2);
        };

        drawTextureText(width, height);

        const textTexture = new THREE.CanvasTexture(canvas);
        textTexture.minFilter = THREE.LinearFilter;
        textTexture.magFilter = THREE.LinearFilter;
        textTexture.format = THREE.RGBAFormat;
        textTexture.needsUpdate = true;

        const onResize = () => {
            const size = getRenderSize();
            width = size.width;
            height = size.height;

            renderer.setPixelRatio(size.dpr);
            renderer.setSize(window.innerWidth, window.innerHeight);

            rtA.dispose();
            rtB.dispose();
            rtA = new THREE.WebGLRenderTarget(width, height, options);
            rtB = new THREE.WebGLRenderTarget(width, height, options);

            simMaterial.uniforms.resolution.value.set(width, height);

            canvas.width = width;
            canvas.height = height;
            drawTextureText(width, height);
            textTexture.needsUpdate = true;
        };

        const onMouseMove = (e) => {
            mouse.x = e.clientX * (window.devicePixelRatio || 1);
            mouse.y = (window.innerHeight - e.clientY) * (window.devicePixelRatio || 1);
        };

        const onMouseLeave = () => {
            mouse.set(0, 0);
        };

        window.addEventListener("resize", onResize);
        renderer.domElement.addEventListener("mousemove", onMouseMove);
        renderer.domElement.addEventListener("mouseleave", onMouseLeave);

        const animate = () => {
            simMaterial.uniforms.frame.value = frame++;
            simMaterial.uniforms.time.value = performance.now() / 1000;

            simMaterial.uniforms.textureA.value = rtA.texture;
            renderer.setRenderTarget(rtB);
            renderer.render(simScene, camera);

            renderMaterial.uniforms.textureA.value = rtB.texture;
            renderMaterial.uniforms.textureB.value = textTexture;
            renderer.setRenderTarget(null);
            renderer.render(scene, camera);

            [rtA, rtB] = [rtB, rtA];

            rafId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", onResize);
            renderer.domElement.removeEventListener("mousemove", onMouseMove);
            renderer.domElement.removeEventListener("mouseleave", onMouseLeave);

            plane.dispose();
            simMaterial.dispose();
            renderMaterial.dispose();
            textTexture.dispose();
            rtA.dispose();
            rtB.dispose();
            renderer.dispose();

            if (renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-10 h-full w-full overflow-hidden"
            aria-hidden="true"
        />
    );
}
