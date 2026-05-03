"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

export default function Loader({ onFinish, duration = 3000 }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(max-width: 640px)");
        setIsMobile(media.matches);

        const handler = (e) => setIsMobile(e.matches);
        media.addEventListener("change", handler);

        return () => media.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        const start = Date.now();

        const id = setInterval(() => {
            const p = Math.min(((Date.now() - start) / duration) * 100, 100);
            setProgress(p);

            if (p >= 100) {
                clearInterval(id);

                setTimeout(() => {
                    setDone(true);
                    onFinish?.();
                }, 800);
            }
        }, 16);

        return () => clearInterval(id);
    }, [duration, onFinish]);

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xffffff, 6, 18);

        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        camera.position.z = isMobile ? 6 : 5;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: !isMobile,
        });

        renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        containerRef.current.appendChild(renderer.domElement);

        let controls;
        if (!isMobile) {
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
        }

        const geometry = new THREE.BufferGeometry();
        const count = isMobile ? 900 : 2000;

        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: isMobile ? 0.025 : 0.02,
            color: 0x111111,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        let frameId;

        function animate() {
            frameId = requestAnimationFrame(animate);

            points.rotation.y += isMobile ? 0.0007 : 0.001;
            points.rotation.x += isMobile ? 0.0003 : 0.0005;

            controls?.update();
            renderer.render(scene, camera);
        }

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", handleResize);
            renderer.dispose();
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, [isMobile]);

    useEffect(() => {
        if (!done) return;

        gsap.to(containerRef.current, {
            scale: isMobile ? 2 : 3,
            opacity: 0,
            duration: 1.2,
            ease: "power4.inOut",
        });
    }, [done, isMobile]);

    const radius = isMobile ? 70 : 85;
    const stroke = 2;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const strokeDashoffset =
        circumference - (progress / 100) * circumference;

    return (
        <div className="fixed inset-0 z-999 overflow-hidden bg-white">

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.10),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.06),transparent_55%)]" />
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-50/10 to-transparent" />
            </div>

            <div className="absolute inset-0 pointer-events-none text-black text-xl font-light">
                <div className="absolute top-4 left-4"> + </div>
                <div className="absolute top-4 right-4"> + </div>
                <div className="absolute bottom-4 left-4"> + </div>
                <div className="absolute bottom-4 right-4"> + </div>
            </div>

            <div ref={containerRef} className="absolute inset-0" />

            <div className="absolute inset-0 flex items-center justify-center">
                <div className={`relative flex items-center justify-center ${isMobile ? "w-36 h-36" : "w-50 h-50"}`}>

                    <svg height={isMobile ? 160 : 200} width={isMobile ? 160 : 200} className="absolute -rotate-90">
                        <circle stroke="rgba(0,0,0,0.08)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx="50%" cy="50%" />
                        <circle stroke="black" fill="transparent" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} r={normalizedRadius} cx="50%" cy="50%"
                            style={{
                                transition: "stroke-dashoffset 0.1s linear",
                                filter: "drop-shadow(0 0 6px rgba(0,0,0,0.2))",
                            }} />
                    </svg>

                    <div className={`text-black font-light tabular-nums ${isMobile ? "text-xl" : "text-2xl"}`}>
                        {Math.floor(progress)}%
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 w-full flex justify-center text-center px-6">
                <div className="text-[10px] sm:text-[11px] leading-5 text-black/60 max-w-md tracking-wide font-mono">

                    <div className="text-black/80 text-sm sm:text-md">
                        AKHIL SHETTY // identity: portfolio_instance
                    </div>

                    {progress < 25 && (
                        <>
                            <div className="text-black/40">[ boot sequence initiated ]</div>
                            <div className="text-black/20 mt-1">loading core modules...</div>
                        </>
                    )}

                    {progress >= 25 && progress < 55 && (
                        <>
                            <div className="text-black/40">[ authentication check ]</div>
                            <div className="text-black/20 mt-1">verifying identity matrix...</div>
                        </>
                    )}

                    {progress >= 55 && progress < 85 && (
                        <>
                            <div className="text-black/40">[ system calibration ]</div>
                            <div className="text-black/20 mt-1">synchronizing environment state...</div>
                        </>
                    )}

                    {progress >= 85 && progress < 100 && (
                        <>
                            <div className="text-black/40">[ finalizing ]</div>
                            <div className="text-black/20 mt-1">preparing interface shell...</div>
                        </>
                    )}

                    {progress >= 100 && (
                        <>
                            <div className="text-black/40">[ portfolio unlocked ]</div>
                            <div className="text-black/20 mt-1">welcome, - akhil shetty</div>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}