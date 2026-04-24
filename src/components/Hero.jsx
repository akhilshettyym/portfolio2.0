// "use client";

// import { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { simulationVertexShader, simulationFragmentShader, renderVertexShader, renderFragmentShader } from "@/utils/shaders";
// import AboutConsole from "./AboutConsole";

// export default function Hero() {
//     const mountRef = useRef(null);
//     const threeRef = useRef({});

//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isResetting, setIsResetting] = useState(false);

//     const words = [
//         { text: "CORE JAVA" },
//         { text: "DATA STRUCTURES" },
//         { text: "MERN STACK" },
//         { text: "VERSION CONTROL" },
//         { text: "SALESFORCE" },
//         { text: "API INTEGRATIONS" },
//         { text: "FRAMEWORKS" },
//         { text: "ARCHITECTURES" },
//         { text: "DEPLOYMENT" },
//     ];

//     const loopedWords = [...words, ...words];

//     useEffect(() => {
//         if (!mountRef.current) return;

//         const scene = new THREE.Scene();
//         const simScene = new THREE.Scene();
//         const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

//         const renderer = new THREE.WebGLRenderer({
//             antialias: true,
//             alpha: false,
//         });

//         const DPR = Math.min(window.devicePixelRatio, 2);

//         renderer.setPixelRatio(DPR);
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         renderer.setClearColor(0x000000, 1);

//         mountRef.current.appendChild(renderer.domElement);

//         const mouse = new THREE.Vector2(-10, -10);
//         let frame = 0;

//         let width = window.innerWidth * DPR;
//         let height = window.innerHeight * DPR;

//         const options = {
//             format: THREE.RGBAFormat,
//             type: THREE.FloatType,
//             minFilter: THREE.LinearFilter,
//             magFilter: THREE.LinearFilter,
//             stencilBuffer: false,
//             depthBuffer: false,
//         };

//         let rtA = new THREE.WebGLRenderTarget(width, height, options);
//         let rtB = new THREE.WebGLRenderTarget(width, height, options);

//         const simMaterial = new THREE.ShaderMaterial({
//             uniforms: {
//                 textureA: { value: null },
//                 mouse: { value: mouse },
//                 resolution: { value: new THREE.Vector2(width, height) },
//                 time: { value: 0 },
//                 frame: { value: 0 },
//             },
//             vertexShader: simulationVertexShader,
//             fragmentShader: simulationFragmentShader,
//         });

//         const renderMaterial = new THREE.ShaderMaterial({
//             uniforms: {
//                 textureA: { value: null },
//                 textureB: { value: null },
//             },
//             vertexShader: renderVertexShader,
//             fragmentShader: renderFragmentShader,
//         });

//         const plane = new THREE.PlaneGeometry(2, 2);
//         const simQuad = new THREE.Mesh(plane, simMaterial);
//         const renderQuad = new THREE.Mesh(plane, renderMaterial);

//         simScene.add(simQuad);
//         scene.add(renderQuad);

//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");

//         function drawText(w, h) {
//             canvas.width = w;
//             canvas.height = h;

//             ctx.fillStyle = "#000000";
//             ctx.fillRect(0, 0, w, h);

//             const fontSize = Math.round(w * 0.08);

//             ctx.fillStyle = "#f5f5dc";
//             ctx.font = `800 ${fontSize}px Montserrat, Arial, sans-serif`;

//             ctx.textAlign = "left";
//             ctx.textBaseline = "middle";

//             const text = "AKHIL SHETTY";
//             const spacing = -fontSize * 0.005;

//             let totalWidth = 0;
//             for (let i = 0; i < text.length; i++) {
//                 totalWidth += ctx.measureText(text[i]).width;
//                 if (i < text.length - 1) totalWidth += spacing;
//             }

//             ctx.save();
//             ctx.translate(w / 2, h * 0.4 - fontSize * 0.10);
//             ctx.scale(1.5, 1);

//             let x = -totalWidth / 2;

//             for (let i = 0; i < text.length; i++) {
//                 const char = text[i];
//                 ctx.fillText(char, x, 0);
//                 x += ctx.measureText(char).width + spacing;
//             }

//             ctx.restore();
//         }

//         drawText(width, height);
//         const textTexture = new THREE.CanvasTexture(canvas);

//         let lastMove = 0;


//         const handleMouseMove = (e) => {
//             const rect = renderer.domElement.getBoundingClientRect();
//             mouse.x = (e.clientX - rect.left) * DPR;
//             mouse.y = (rect.bottom - e.clientY) * DPR;
//             lastMove = performance.now();
//         };

//         renderer.domElement.addEventListener("mousemove", handleMouseMove);

//         const handleResize = () => {
//             width = window.innerWidth * DPR;
//             height = window.innerHeight * DPR;

//             renderer.setSize(window.innerWidth, window.innerHeight);
//             rtA.setSize(width, height);
//             rtB.setSize(width, height);

//             simMaterial.uniforms.resolution.value.set(width, height);

//             drawText(width, height);
//             textTexture.needsUpdate = true;
//         };

//         window.addEventListener("resize", handleResize);

//         let raf;

//         const animate = () => {
//             simMaterial.uniforms.frame.value = frame++;

//             if (performance.now() - lastMove > 80) {
//                 mouse.set(-10, -10);
//             }

//             simMaterial.uniforms.textureA.value = rtA.texture;

//             renderer.setRenderTarget(rtB);
//             renderer.render(simScene, camera);

//             renderMaterial.uniforms.textureA.value = rtB.texture;
//             renderMaterial.uniforms.textureB.value = textTexture;

//             renderer.setRenderTarget(null);
//             renderer.render(scene, camera);

//             [rtA, rtB] = [rtB, rtA];

//             raf = requestAnimationFrame(animate);
//         };

//         animate();

//         threeRef.current = {
//             renderer, rtA, rtB, simMaterial, renderMaterial, plane, textTexture, handleResize, handleMouseMove, raf,
//         };

//         return () => {
//             const t = threeRef.current;

//             cancelAnimationFrame(t.raf);

//             t.renderer.dispose();
//             t.rtA.dispose();
//             t.rtB.dispose();
//             t.simMaterial.dispose();
//             t.renderMaterial.dispose();
//             t.plane.dispose();
//             t.textTexture.dispose();

//             window.removeEventListener("resize", t.handleResize);
//             t.renderer.domElement.removeEventListener("mousemove", t.handleMouseMove);

//             if (mountRef.current && t.renderer.domElement) {
//                 mountRef.current.removeChild(t.renderer.domElement);
//             }
//         };
//     }, []);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentIndex((prev) => {
//                 if (prev === words.length) {
//                     setIsResetting(true);
//                     return 0;
//                 }
//                 return prev + 1;
//             });
//         }, 2000);

//         return () => clearInterval(interval);
//     }, []);

//     useEffect(() => {
//         if (isResetting) {
//             const timeout = setTimeout(() => {
//                 setIsResetting(false);
//             }, 10);

//             return () => clearTimeout(timeout);
//         }
//     }, [isResetting]);


//     return (
//         <div className="relative w-full min-h-screen overflow-x-hidden">
//             <div ref={mountRef} className="absolute inset-0" />

//             {/* <div className="absolute top-10 left-10 text-white flex flex-col gap-1 z-10">
//                 <h2 className="text-2xl font-extrabold scale-x-125 origin-left"> Scalable Web Architectures </h2>
//                 <h2 className="text-2xl font-extrabold scale-x-125 origin-left"> Structured User Experiences </h2>
//                 <h2 className="text-2xl font-extrabold scale-x-125 origin-left"> Performance Driven Development </h2>
//             </div> */}

//             {/* <div className="absolute top-10 right-10 flex items-center gap-2 text-white z-10">
//                 <div className="w-12 h-12 animate-spin-slow drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
//                     <svg viewBox="0 0 100 100" className="w-full h-full">
//                         <circle cx="50" cy="50" r="48" stroke="white" strokeOpacity="0.7" strokeWidth="2.0" fill="none" />
//                         <ellipse cx="50" cy="50" rx="48" ry="30" stroke="white" strokeOpacity="0.5" strokeWidth="1.2" fill="none" />
//                         <ellipse cx="50" cy="50" rx="48" ry="20" stroke="white" strokeOpacity="0.5" strokeWidth="1.2" fill="none" />
//                         <ellipse cx="50" cy="50" rx="48" ry="10" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" fill="none" />
//                         <ellipse cx="50" cy="50" rx="30" ry="48" stroke="white" strokeOpacity="0.5" strokeWidth="1.2" fill="none" />
//                         <ellipse cx="50" cy="50" rx="20" ry="48" stroke="white" strokeOpacity="0.5" strokeWidth="1.2" fill="none" />
//                         <ellipse cx="50" cy="50" rx="10" ry="48" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" fill="none" />
//                     </svg>
//                 </div>

//                 <div className="w-12 h-12 rounded-full border border-white/70 flex items-center justify-center">
//                     <span className="text-xs font-semibold tracking-[0.2em]">DEV</span>
//                 </div>
//             </div> */}


//             {/* <div className="absolute right-10 top-[42%] z-10 flex flex-col items-end">
//                 <div className="text-white flex flex-col items-end w-65">
//                     <div className="relative h-12 overflow-hidden mb-2 w-full">
//                         <div
//                             className={`flex flex-col will-change-transform ${isResetting ? "" : "transition-transform duration-700 ease-in-out"
//                                 }`}
//                             style={{ transform: `translateY(-${currentIndex * 3}rem)` }}>
//                             {loopedWords.map((word, index) => (
//                                 <div key={index} className="flex justify-end items-center h-12 w-full">
//                                     <span className="text-lg font-semibold scale-x-110 origin-right text-white/80 whitespace-nowrap">
//                                         {word.text}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <h2 className="text-2xl font-extrabold scale-x-110 origin-right whitespace-nowrap">
//                         FULL ST<span className="text-red-500">A</span>CK DEVELOPER
//                     </h2>
//                 </div>
//             </div> */}

//             {/* <div className="relative w-full sm: z-10 mt-[65vh]">
//                 <AboutConsole />
//             </div> */}
//         </div>
//     );
// }


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

        const DPR = Math.min(window.devicePixelRatio, 2);
        renderer.setPixelRatio(DPR);

        // ✅ WHITE BACKGROUND
        renderer.setClearColor(0xffffff, 0);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const text = "AKHIL SHETTY";
        const fontSize = 64;

        ctx.font = `900 ${fontSize}px "Inter", "Helvetica Neue", Arial`;

        const textWidth = ctx.measureText(text).width;

        // ✅ tight bounds + 2px breathing
        const padding = 2;
        const width = Math.ceil(textWidth + padding * 2);
        const height = Math.ceil(fontSize + padding * 2);

        canvas.width = width;
        canvas.height = height;

        // 🔥 DRAW TEXT (pressed effect)
        function drawText() {
            // background white
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);

            ctx.save();

            ctx.translate(width / 2, height / 2);

            // slight squash → "pressed"
            ctx.scale(1.05, 0.92);

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.font = `900 ${fontSize}px "Inter", "Helvetica Neue", Arial`;

            // emboss shadow
            ctx.shadowColor = "rgba(0,0,0,0.15)";
            ctx.shadowBlur = 2;
            ctx.shadowOffsetY = 1;

            ctx.fillStyle = "#111111";
            ctx.fillText(text, 0, 0);

            ctx.restore();
        }

        drawText();

        const textTexture = new THREE.CanvasTexture(canvas);

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

    return (
        <div className="inline-block">
            <div ref={mountRef} />
        </div>
    );
}