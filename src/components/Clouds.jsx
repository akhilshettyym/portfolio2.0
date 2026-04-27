"use client";

import "@/styles/clouds.css";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

export default function Clouds() {
    const containerRef = useRef(null);

    useEffect(() => {
        let camera, scene, renderer;
        let mouseX = 0,
            mouseY = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;
        let start_time = Date.now();

        const btn = document.querySelector(".btn");

        if (btn) {
            btn.addEventListener("mousemove", (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener("mouseleave", () => {
                btn.style.transform = `translate(0px, 0px)`;
            });
        }

        const cloudShader = {
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform sampler2D map;
        uniform vec3 fogColor;
        uniform float fogNear;
        uniform float fogFar;
        varying vec2 vUv;

        void main() {
          float depth = gl_FragCoord.z / gl_FragCoord.w;
          float fogFactor = smoothstep(fogNear, fogFar, depth);

          gl_FragColor = texture2D(map, vUv);
          gl_FragColor.w *= pow(gl_FragCoord.z, 20.0);
          gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);
        }
      `,
        };

        const container = containerRef.current;

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            30,
            window.innerWidth / window.innerHeight,
            1,
            3000
        );
        camera.position.z = 6000;

        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: false,
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        const textureLoader = new THREE.TextureLoader();

        textureLoader.load("/cloud.png", (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.magFilter = THREE.LinearMipMapLinearFilter;
            texture.minFilter = THREE.LinearMipMapLinearFilter;

            const fog = new THREE.Fog(0xcfefff, -100, 3000);
            scene.fog = fog;

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    map: { value: texture },
                    fogColor: { value: fog.color },
                    fogNear: { value: fog.near },
                    fogFar: { value: fog.far },
                },
                vertexShader: cloudShader.vertexShader,
                fragmentShader: cloudShader.fragmentShader,
                depthWrite: false,
                depthTest: false,
                transparent: true,
            });

            const planeGeo = new THREE.PlaneGeometry(64, 64);
            const planeObj = new THREE.Object3D();
            const geometries = [];

            for (let i = 0; i < 8000; i++) {
                planeObj.position.x = Math.random() * 1000 - 500;
                planeObj.position.y = -Math.random() * Math.random() * 200 - 15;
                planeObj.position.z = i;
                planeObj.rotation.z = Math.random() * Math.PI;
                planeObj.scale.x = planeObj.scale.y =
                    Math.random() * Math.random() * 1.5 + 0.5;

                planeObj.updateMatrix();

                const cloned = planeGeo.clone();
                cloned.applyMatrix4(planeObj.matrix);
                geometries.push(cloned);
            }

            const mergedGeo =
                BufferGeometryUtils.mergeGeometries(geometries);

            const mesh = new THREE.Mesh(mergedGeo, material);
            mesh.renderOrder = 2;

            const mesh2 = mesh.clone();
            mesh2.position.z = -8000;
            mesh2.renderOrder = 1;

            scene.add(mesh);
            scene.add(mesh2);

            animate();
        });

        function onMouseMove(e) {
            mouseX = (e.clientX - windowHalfX) * 0.25;
            mouseY = (e.clientY - windowHalfY) * 0.15;
        }

        function onResize() {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            requestAnimationFrame(animate);

            const position = ((Date.now() - start_time) * 0.03) % 8000;

            camera.position.x += (mouseX - camera.position.x) * 0.01;
            camera.position.y += (-mouseY - camera.position.y) * 0.01;
            camera.position.z = -position + 8000;

            renderer.render(scene, camera);
        }

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("resize", onResize);
            container.removeChild(renderer.domElement);
            renderer.dispose();
        };

    }, []);

    return (
        <div className="wrapper">
            <div ref={containerRef} className="canvas-bg" />

            <div className="hero-text">
                <span className="line dim">We're a creative-owned</span>
                <span className="line dim">agency that specialises</span>
                <span className="line strong">Super x Solid outcomes.</span>

                <a className="btn">
                    <span className="label">
                        <span className="main">See how we create outcomes</span>
                        <span className="alt">Explore our work →</span>
                    </span>
                </a>
            </div>

            <div className="hero-name">
                AKHIL SHETTY
            </div>

            {[
                { top: "110px", left: "40px" },
                { top: "110px", right: "40px" },
                { bottom: "40px", left: "40px" },
                { bottom: "40px", right: "40px" },
            ].map((pos, i) => (
                <div key={i} className="corner" style={pos} />
            ))}
        </div>
    );
}