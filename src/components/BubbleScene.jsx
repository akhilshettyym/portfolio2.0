"use client";

import gsap from "gsap";
import * as THREE from "three";
import "@/styles/bubblescene.css";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { radii, positions } from "@/utils/basic-utils";

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

        scene.background = new THREE.Color("#ffffff");

        scene.fog = new THREE.Fog("#ffffff", 18, 38);

        const camera = new THREE.PerspectiveCamera(
            25,
            wrapper.clientWidth / wrapper.clientHeight,
            0.1,
            1000
        );

        camera.position.z = 24;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: false,
        });

        renderer.setSize(
            wrapper.clientWidth,
            wrapper.clientHeight
        );

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        renderer.outputColorSpace = THREE.SRGBColorSpace;

        renderer.toneMapping = THREE.ACESFilmicToneMapping;

        renderer.toneMappingExposure = 1.2;

        const controls = new OrbitControls(
            camera,
            renderer.domElement
        );

        controls.enableDamping = true;
        controls.enableRotate = false;
        controls.enableZoom = false;
        controls.enablePan = false;

        const loader = new THREE.TextureLoader();

        const texturePaths = ["animate", "css", "docker", "express", "figma", "firebase", "git", "github", "html", "java", "javascript", "jest", "kuber", "nextjs", "nodejs", "reactjs", "salesforce", "sql", "tailwind", "tedx", "threejs"];

        const textures = texturePaths.map((name) => {
            const texture = loader.load(`/bubbles/bubbles.${name}.svg`);
            texture.colorSpace = THREE.SRGBColorSpace;
            return texture;
        });

        const group = new THREE.Group();
        scene.add(group);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight("#ffffff", 0.9);
        directionalLight.position.set(10, 10, 10);

        scene.add(directionalLight);

        const bubbles = [];

        positions.forEach((pos, index) => {
            const radius = radii[index] ?? 0.5;
            const randomTexture = textures[Math.floor(Math.random() * textures.length)];
            const material = new THREE.SpriteMaterial({ map: randomTexture, transparent: true, depthWrite: false });
            const bubble = new THREE.Sprite(material);
            const scale = radius * 2.7;

            bubble.scale.set(scale, scale, scale);
            bubble.position.set(pos.x, -25, pos.z);
            bubble.userData = { originalPosition: { ...pos }, velocity: new THREE.Vector3(), radius, hovered: false };
            bubbles.push(bubble);

            group.add(bubble);
        });

        const damping = 0.94;
        const mouseForce = 0.025;
        const returnStrength = 0.022;
        const breathingSpeed = 0.0015;
        const breathingAmplitude = 0.05;
        const hoverScale = 2.8;

        const tempVector = new THREE.Vector3();
        const mouse = new THREE.Vector2(-10, -10);
        const raycaster = new THREE.Raycaster();

        function startAnimation() {
            if (animationStarted) return;

            animationStarted = true;

            bubbles.forEach((bubble, i) => {
                const delay = i * 0.015;

                gsap.to(bubble.position, {
                    x: bubble.userData.originalPosition.x,
                    y: bubble.userData.originalPosition.y,
                    z: bubble.userData.originalPosition.z,
                    duration: 1,
                    delay,
                    ease: "power2.out",
                });

                gsap.fromTo(
                    bubble.scale,
                    {
                        x: 0,
                        y: 0,
                    },
                    {
                        x: bubble.userData.radius * 2.7,
                        y: bubble.userData.radius * 2.7,
                        duration: 0.9,
                        delay,
                        ease: "back.out(1.2)",
                    }
                );
            });

            setTimeout(() => {
                loadingComplete = true;
            }, 1300);
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (
                        entry.isIntersecting &&
                        entry.intersectionRatio > 0.5
                    ) {
                        startAnimation();
                    }
                });
            },
            {
                threshold: [0.5],
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
            }, 120);
        };

        window.addEventListener("mousemove", onMouseMove);

        function handleCollisions() {
            for (let i = 0; i < bubbles.length; i++) {
                const bubbleA = bubbles[i];

                const radiusA = bubbleA.userData.radius;

                for (let j = i + 1; j < bubbles.length; j++) {
                    const bubbleB = bubbles[j];
                    const radiusB = bubbleB.userData.radius;
                    const distance = bubbleA.position.distanceTo(bubbleB.position);
                    const minDistance = (radiusA + radiusB) * 1.1;

                    if (distance < minDistance) {
                        tempVector.subVectors(
                            bubbleB.position,
                            bubbleA.position
                        );

                        tempVector.normalize();

                        const pushStrength = (minDistance - distance) * 0.035;

                        bubbleA.position.add(
                            tempVector
                                .clone()
                                .multiplyScalar(
                                    -pushStrength
                                )
                        );

                        bubbleB.position.add(
                            tempVector
                                .clone()
                                .multiplyScalar(
                                    pushStrength
                                )
                        );
                    }
                }
            }
        }

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            const time = Date.now() * breathingSpeed;

            if (loadingComplete) {
                let intersects = [];

                if (mouse.x !== -10 && mouse.y !== -10) {
                    raycaster.setFromCamera(mouse, camera);
                    intersects = raycaster.intersectObjects(bubbles);
                }

                bubbles.forEach((bubble, i) => {
                    const original = bubble.userData.originalPosition;
                    const velocity = bubble.userData.velocity;
                    const breathingY = Math.sin(time + i * 0.3) * breathingAmplitude;
                    const breathingZ = Math.cos(time + i * 0.3) * breathingAmplitude * 0.35;

                    const returnForce =
                        new THREE.Vector3(
                            original.x -
                            bubble.position.x,

                            original.y +
                            breathingY -
                            bubble.position.y,

                            original.z +
                            breathingZ -
                            bubble.position.z
                        ).multiplyScalar(returnStrength);

                    velocity.add(returnForce);

                    let isHovered = false;

                    if (mouse.x !== -10 && mouse.y !== -10) {
                        intersects.forEach((hit) => {
                            if (hit.object === bubble) {
                                isHovered = true;

                                const pushDirection =
                                    new THREE.Vector3()
                                        .subVectors(
                                            bubble.position,
                                            hit.point
                                        )
                                        .normalize();

                                velocity.add(
                                    pushDirection.multiplyScalar(
                                        mouseForce
                                    )
                                );
                            }
                        });
                    }

                    if (isHovered && !bubble.userData.hovered) {
                        bubble.userData.hovered = true;

                        gsap.to(bubble.scale, {
                            x:
                                bubble.userData
                                    .radius *
                                hoverScale,

                            y:
                                bubble.userData
                                    .radius *
                                hoverScale,

                            duration: 0.35,
                            ease: "power2.out",
                        });
                    }

                    if (!isHovered && bubble.userData.hovered) {
                        bubble.userData.hovered =
                            false;

                        gsap.to(bubble.scale, {
                            x:
                                bubble.userData
                                    .radius * 2.7,

                            y:
                                bubble.userData
                                    .radius * 2.7,

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

            group.rotation.y += 0.0008;
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
        <section className="bubble-wrapper">
            <div ref={wrapperRef} className="bubble-scene-panel">
                <canvas ref={canvasRef} />

                <div className="bubble-content">
                    <p className="bubble-kicker"> Creative 3D Motion </p>

                    <h2 className="bubble-heading"> Interactive Bubble Scene </h2>

                    <p className="bubble-text">
                        Smooth floating animations with
                        real-time mouse interactions and
                        dynamic collisions powered by
                        Three.js.
                    </p>

                    <p className="bubble-text">
                        Fully responsive immersive
                        experience with fluid motion
                        and interactive depth.
                    </p>
                </div>
            </div>
        </section>
    );
}