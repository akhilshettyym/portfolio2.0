"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const simulationVertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
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

    if(frame == 0){
        gl_FragColor = vec4(0.0);
        return;
    }

    vec4 data = texture2D(textureA, uv);

    float pressure = data.x;
    float pVel = data.y;

    vec2 texelSize = 1.0 / resolution;

    float p_right = texture2D(textureA, uv + vec2(texelSize.x, 0.0)).x;
    float p_left  = texture2D(textureA, uv - vec2(texelSize.x, 0.0)).x;
    float p_up    = texture2D(textureA, uv + vec2(0.0, texelSize.y)).x;
    float p_down  = texture2D(textureA, uv - vec2(0.0, texelSize.y)).x;

    if(uv.x <= texelSize.x) p_left = p_right;
    if(uv.x >= 1.0 - texelSize.x) p_right = p_left;

    if(uv.y <= texelSize.y) p_down = p_up;
    if(uv.y >= 1.0 - texelSize.y) p_up = p_down;

    pVel += delta * (-2.0 * pressure + p_right + p_left) / 4.0;
    pVel += delta * (-2.0 * pressure + p_up + p_down) / 4.0;

    pressure += delta * pVel;

    pVel -= 0.005 * delta * pressure;
    pVel *= 1.0 - 0.002 * delta;

    pressure *= 0.999;

    vec2 mouseUV = mouse / resolution;

    if(mouse.x > 0.0){
        float radius = 0.04;

        float dist = distance(uv, mouseUV);

        if(dist < radius){
            pressure += 2.5 * (1.0 - dist / radius);
        }
    }

    gl_FragColor = vec4(
        pressure,
        pVel,
        (p_right - p_left) * 0.5,
        (p_up - p_down) * 0.5
    );
}
`;

const renderVertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`;

const renderFragmentShader = `
uniform sampler2D textureA;
uniform sampler2D textureB;

varying vec2 vUv;

void main() {

    vec4 data = texture2D(textureA, vUv);

    vec2 distortion = data.zw * 0.03;

    vec4 color = texture2D(
        textureB,
        clamp(vUv + distortion, 0.0, 1.0)
    );

    vec3 normal = normalize(
        vec3(
            -data.z * 2.0,
            0.5,
            -data.w * 2.0
        )
    );

    vec3 lightDir = normalize(
        vec3(-3.0, 10.0, 3.0)
    );

    float specular =
        pow(
            max(0.0, dot(normal, lightDir)),
            60.0
        ) * 1.25;

    gl_FragColor =
        color +
        vec4(vec3(specular), 0.0);
}
`;

export default function LiquidBackground({
    backgroundImage,
}) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        if (!backgroundImage) return;

        const container = containerRef.current;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.setClearColor(0x000000, 0);

        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const simScene = new THREE.Scene();

        const camera =
            new THREE.OrthographicCamera(
                -1,
                1,
                1,
                -1,
                0,
                1
            );

        const mouse = new THREE.Vector2();

        let frame = 0;
        let rafId;

        const dpr = Math.min(
            window.devicePixelRatio,
            2
        );

        let width = Math.floor(
            window.innerWidth * dpr
        );

        let height = Math.floor(
            window.innerHeight * dpr
        );

        const options = {
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            depthBuffer: false,
            stencilBuffer: false,
        };

        let rtA =
            new THREE.WebGLRenderTarget(
                width,
                height,
                options
            );

        let rtB =
            new THREE.WebGLRenderTarget(
                width,
                height,
                options
            );

        const screenshotTexture =
            new THREE.TextureLoader().load(
                backgroundImage
            );

        screenshotTexture.minFilter =
            THREE.LinearFilter;

        screenshotTexture.magFilter =
            THREE.LinearFilter;

        screenshotTexture.needsUpdate = true;

        const simMaterial =
            new THREE.ShaderMaterial({
                uniforms: {
                    textureA: {
                        value: null,
                    },
                    mouse: {
                        value: mouse,
                    },
                    resolution: {
                        value: new THREE.Vector2(
                            width,
                            height
                        ),
                    },
                    time: {
                        value: 0,
                    },
                    frame: {
                        value: 0,
                    },
                },
                vertexShader:
                    simulationVertexShader,
                fragmentShader:
                    simulationFragmentShader,
            });

        const renderMaterial =
            new THREE.ShaderMaterial({
                uniforms: {
                    textureA: {
                        value: null,
                    },
                    textureB: {
                        value: screenshotTexture,
                    },
                },
                vertexShader:
                    renderVertexShader,
                fragmentShader:
                    renderFragmentShader,
                transparent: true,
            });

        const plane =
            new THREE.PlaneGeometry(2, 2);

        const simQuad = new THREE.Mesh(
            plane,
            simMaterial
        );

        const renderQuad = new THREE.Mesh(
            plane,
            renderMaterial
        );

        simScene.add(simQuad);
        scene.add(renderQuad);

        const resize = () => {
            const dpr = Math.min(
                window.devicePixelRatio,
                2
            );

            width = Math.floor(
                window.innerWidth * dpr
            );

            height = Math.floor(
                window.innerHeight * dpr
            );

            renderer.setPixelRatio(dpr);

            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );

            rtA.dispose();
            rtB.dispose();

            rtA =
                new THREE.WebGLRenderTarget(
                    width,
                    height,
                    options
                );

            rtB =
                new THREE.WebGLRenderTarget(
                    width,
                    height,
                    options
                );

            simMaterial.uniforms.resolution.value.set(
                width,
                height
            );
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX * dpr;

            mouse.y =
                (window.innerHeight -
                    e.clientY) *
                dpr;
        };

        const handleMouseLeave = () => {
            mouse.set(0, 0);
        };

        window.addEventListener(
            "resize",
            resize
        );

        renderer.domElement.addEventListener(
            "mousemove",
            handleMouseMove
        );

        renderer.domElement.addEventListener(
            "mouseleave",
            handleMouseLeave
        );

        const animate = () => {
            simMaterial.uniforms.frame.value =
                frame++;

            simMaterial.uniforms.time.value =
                performance.now() * 0.001;

            simMaterial.uniforms.textureA.value =
                rtA.texture;

            renderer.setRenderTarget(rtB);
            renderer.render(
                simScene,
                camera
            );

            renderMaterial.uniforms.textureA.value =
                rtB.texture;

            renderer.setRenderTarget(null);

            renderer.render(
                scene,
                camera
            );

            [rtA, rtB] = [rtB, rtA];

            rafId =
                requestAnimationFrame(
                    animate
                );
        };

        animate();

        return () => {
            cancelAnimationFrame(rafId);

            window.removeEventListener(
                "resize",
                resize
            );

            renderer.domElement.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            renderer.domElement.removeEventListener(
                "mouseleave",
                handleMouseLeave
            );

            plane.dispose();

            simMaterial.dispose();
            renderMaterial.dispose();

            screenshotTexture.dispose();

            rtA.dispose();
            rtB.dispose();

            renderer.dispose();

            if (
                renderer.domElement.parentNode ===
                container
            ) {
                container.removeChild(
                    renderer.domElement
                );
            }
        };
    }, [backgroundImage]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full"
        />
    );
}