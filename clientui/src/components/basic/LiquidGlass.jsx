"use client";

import * as THREE from "three";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const LiquidGlass = ({ children, width = "460px", height = "300px", className = "", padding = "p-8", ...props }) => {
    
    return (
        <div className={`flex items-center justify-center ${padding} ${className}`} {...props}>
            <div className="relative rounded-[2.5rem] shadow-2xl border border-white/40 backdrop-blur-md" style={{ width, height }}>
                <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
                    <div className="absolute inset-0 bg-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[28px_28px] opacity-30" />

                    <Canvas camera={{ position: [0, 0, 9], fov: 46 }} gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }} style={{ background: "transparent" }}>
                        <Suspense fallback={null}>
                            <ambientLight intensity={0.65} />
                            <directionalLight position={[10, 12, 8]} intensity={2.8} color="#ffffff" />
                            <pointLight position={[-12, -8, -10]} intensity={1.6} color="#e0e7ff" />
                            <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.2} enableDamping dampingFactor={0.12} />
                        </Suspense>
                    </Canvas>

                    <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/20 via-transparent to-transparent rounded-[2.5rem]" />
                    <div className="absolute inset-0.75 pointer-events-none border border-white/30 rounded-[2.4rem]" />
                    <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/5 via-transparent to-white/10 rounded-[2.5rem]" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-10 p-5 text-center pointer-events-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default LiquidGlass;