"use client";

import gsap from "gsap";
import * as THREE from "three";
import "@/styles/bubblescene.css";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { radii, positions } from "@/utils/basic-utils";

export default function BubbleScene() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        let animationFrameId;
        let loadingComplete = false;

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog("#f6f2ff", 18, 38);
        const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 24;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;

        const controls = new OrbitControls(camera, renderer.domElement);

        controls.enableDamping = true;
        controls.enableRotate = false;
        controls.enableZoom = false;
        controls.enablePan = false;

        const loader = new THREE.TextureLoader();

        const texture1 = loader.load("/bubbles/bubbles.animate.svg");
        const texture2 = loader.load("/bubbles/bubbles.css.svg");
        const texture3 = loader.load("/bubbles/bubbles.docker.svg");
        const texture4 = loader.load("/bubbles/bubbles.express.svg");
        const texture5 = loader.load("/bubbles/bubbles.figma.svg");
        const texture6 = loader.load("/bubbles/bubbles.firebase.svg");
        const texture7 = loader.load("/bubbles/bubbles.git.svg");
        const texture8 = loader.load("/bubbles/bubbles.github.svg");
        const texture9 = loader.load("/bubbles/bubbles.html.svg");
        const texture10 = loader.load("/bubbles/bubbles.java.svg");
        const texture11 = loader.load("/bubbles/bubbles.javascript.svg");
        const texture12 = loader.load("/bubbles/bubbles.jest.svg");
        const texture13 = loader.load("/bubbles/bubbles.kuber.svg");
        const texture14 = loader.load("/bubbles/bubbles.nextjs.svg");
        const texture15 = loader.load("/bubbles/bubbles.nodejs.svg");
        const texture16 = loader.load("/bubbles/bubbles.reactjs.svg");
        const texture17 = loader.load("/bubbles/bubbles.salesforce.svg");
        const texture18 = loader.load("/bubbles/bubbles.sql.svg");
        const texture19 = loader.load("/bubbles/bubbles.tailwind.svg");
        const texture20 = loader.load("/bubbles/bubbles.tedx.svg");
        const texture21 = loader.load("/bubbles/bubbles.threejs.svg");

        texture1.colorSpace = THREE.SRGBColorSpace;
        texture2.colorSpace = THREE.SRGBColorSpace;
        texture3.colorSpace = THREE.SRGBColorSpace;
        texture4.colorSpace = THREE.SRGBColorSpace;
        texture5.colorSpace = THREE.SRGBColorSpace;
        texture6.colorSpace = THREE.SRGBColorSpace;
        texture7.colorSpace = THREE.SRGBColorSpace;
        texture8.colorSpace = THREE.SRGBColorSpace;
        texture9.colorSpace = THREE.SRGBColorSpace;
        texture10.colorSpace = THREE.SRGBColorSpace;
        texture11.colorSpace = THREE.SRGBColorSpace;
        texture12.colorSpace = THREE.SRGBColorSpace;
        texture13.colorSpace = THREE.SRGBColorSpace;
        texture14.colorSpace = THREE.SRGBColorSpace;
        texture15.colorSpace = THREE.SRGBColorSpace;
        texture16.colorSpace = THREE.SRGBColorSpace;
        texture17.colorSpace = THREE.SRGBColorSpace;
        texture18.colorSpace = THREE.SRGBColorSpace;
        texture19.colorSpace = THREE.SRGBColorSpace;
        texture20.colorSpace = THREE.SRGBColorSpace;
        texture21.colorSpace = THREE.SRGBColorSpace;

        const textures = [texture1, texture2, texture3, texture4, texture5, texture6, texture7, texture8, texture9, texture10, texture11, texture12, texture13, texture14, texture15, texture16, texture17, texture18, texture19, texture20, texture21];


        const group = new THREE.Group();

        scene.add(group);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);

        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight("#ffffff", 1);

        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);

        const bubbles = [];

        positions.forEach((pos, index) => {
            const radius = radii[index] ?? 0.5;

            const randomTexture = textures[Math.floor(Math.random() * textures.length)];

            const material = new THREE.SpriteMaterial({
                map: randomTexture,
                transparent: true,
                depthWrite: false,
            });

            const bubble = new THREE.Sprite(material);
            const scale = radius * 2.7;

            bubble.scale.set(scale, scale, scale);
            bubble.position.set(pos.x, -25, pos.z);

            bubble.userData = {
                originalPosition: { ...pos },
                velocity: new THREE.Vector3(),
                radius,
                hovered: false,
            };

            bubbles.push(bubble);
            group.add(bubble);
        });

        const initY = -25;
        const damping = 0.9;
        const mouseForce = 0.08;
        const revolutionRadius = 4;
        const returnStrength = 0.045;
        const revolutionDuration = 2;
        const breathingSpeed = 0.0018;
        const breathingAmplitude = 0.08;
        const tempVector = new THREE.Vector3();
        const mouse = new THREE.Vector2(-10, -10);
        const raycaster = new THREE.Raycaster();

        let mouseMoveTimeout;
        let mouseMoving = false;

        function initLoadingAnimation() {
            bubbles.forEach((bubble, i) => {
                const delay = i * 0.02;

                gsap
                    .timeline()
                    .to(bubble.position, {
                        duration: revolutionDuration / 2,
                        y: revolutionRadius,
                        ease: "power2.out",
                        delay,

                        onUpdate: function () {
                            const progress = this.progress();
                            bubble.position.z = bubble.userData.originalPosition.z + Math.sin(progress * Math.PI) * revolutionRadius;
                        },
                    })

                    .to(bubble.position, {
                        duration: revolutionDuration / 2,
                        y: initY / 5,
                        ease: "power2.out",

                        onUpdate: function () {
                            const progress = this.progress();
                            bubble.position.z = bubble.userData.originalPosition.z - Math.sin(progress * Math.PI) * revolutionRadius;
                        },
                    })

                    .to(bubble.position, {
                        duration: 0.6,
                        x: bubble.userData.originalPosition.x,
                        y: bubble.userData.originalPosition.y,
                        z: bubble.userData.originalPosition.z,
                        ease: "power2.out",
                    });
            });
        }

        initLoadingAnimation();

        setTimeout(() => {
            loadingComplete = true;
        }, (revolutionDuration + 1) * 1000);

        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            mouseMoving = true;

            clearTimeout(mouseMoveTimeout);

            mouseMoveTimeout = setTimeout(() => {
                mouseMoving = false;
            }, 80);
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
                    const minDistance = (radiusA + radiusB) * 1.15;

                    if (distance < minDistance) {
                        tempVector.subVectors(bubbleB.position, bubbleA.position);
                        tempVector.normalize();

                        const pushStrength = (minDistance - distance) * 0.08;

                        bubbleA.position.add(
                            tempVector.clone().multiplyScalar(-pushStrength)
                        );

                        bubbleB.position.add(
                            tempVector.clone().multiplyScalar(pushStrength)
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

                if (mouseMoving) {
                    raycaster.setFromCamera(mouse, camera);
                    intersects = raycaster.intersectObjects(bubbles);
                }

                bubbles.forEach((bubble, i) => {
                    const original = bubble.userData.originalPosition;
                    const velocity = bubble.userData.velocity;
                    const breathingY = Math.sin(time + i * 0.3) * breathingAmplitude;
                    const breathingZ = Math.cos(time + i * 0.3) * breathingAmplitude * 0.5;
                    const returnForce = new THREE.Vector3(original.x - bubble.position.x,

                        original.y + breathingY - bubble.position.y,
                        original.z + breathingZ - bubble.position.z

                    ).multiplyScalar(returnStrength);

                    velocity.add(returnForce);

                    let isHovered = false;

                    if (mouseMoving) {
                        intersects.forEach((hit) => {
                            if (hit.object === bubble) {
                                isHovered = true;
                                const pushDirection = new THREE.Vector3().subVectors(bubble.position, hit.point).normalize();
                                velocity.add(pushDirection.multiplyScalar(mouseForce));
                            }
                        });
                    }

                    if (isHovered && !bubble.userData.hovered) {
                        bubble.userData.hovered = true;
                        gsap.to(bubble.scale, {
                            x: bubble.userData.radius * 2.9,
                            y: bubble.userData.radius * 2.9,
                            duration: 0.25,
                            ease: "power2.out",
                        });
                    }

                    if (!isHovered && bubble.userData.hovered) {
                        bubble.userData.hovered = false;
                        gsap.to(bubble.scale, {
                            x: bubble.userData.radius * 2.7,
                            y: bubble.userData.radius * 2.7,
                            duration: 0.5,
                            ease: "power3.out",
                        });
                    }

                    velocity.multiplyScalar(damping);

                    bubble.position.add(velocity);
                    bubble.lookAt(camera.position);
                });

                handleCollisions();
            }

            group.rotation.y += 0.0015;
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(mouseMoveTimeout);

            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("resize", onResize);

            controls.dispose();
            renderer.dispose();
            texture1.dispose();
            texture2.dispose();

            bubbles.forEach((bubble) => {
                bubble.material.dispose();
            });
        };
    }, []);

    return (
        <div className="bubble-wrapper">
            <canvas ref={canvasRef} />
        </div>
    );
}