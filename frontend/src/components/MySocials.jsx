"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const imagesList = [
    "/bubbles/bubbles.docker.svg",
    "/bubbles/bubbles.github.svg",
    "/bubbles/bubbles.kubernetes.svg",
    "/bubbles/bubbles.salesforce.svg",
    "/bubbles/bubbles.vscode.svg",
    // "/socials/2.webp",
    // "/socials/3.webp",
    // "/socials/4.webp",
    // "/socials/5.webp",
];

const MySocials = () => {
    const [trail, setTrail] = useState([]);
    const lastPosition = useRef({ x: 0, y: 0 });
    const imageIndex = useRef(0);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const distance = Math.hypot(
            x - lastPosition.current.x,
            y - lastPosition.current.y,
        );

        if (distance > 100) {
            lastPosition.current = { x, y };

            const newTrailItem = {
                id: Date.now(),
                x,
                y,
                src: imagesList[imageIndex.current],
            };

            imageIndex.current = (imageIndex.current + 1) % imagesList.length;

            setTrail((prev) => [...prev, newTrailItem]);

            setTimeout(() => {
                setTrail((prev) => prev.filter((item) => item.id !== newTrailItem.id));
            }, 800);
        }
    };

    return (
        <div onMouseMove={handleMouseMove} className="relative w-full md:h-[60vh] lg:h-[100vh] snap-y snap-proximity overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center h-full z-[999] pointer-events-none">
                <div className="text-center max-w-[75%] mx-auto pointer-events-auto">
                    <span className="relative z-10 transition-colors duration-300 text-2xl font-extrabold group-hover:text-black px-1 md:px-2 py-2 flex items-center">
                        SOCIALS
                    </span>
                    <div className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                </div>
            </div>

            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20, top: "10.5%", height: "75%" }}>
                <AnimatePresence>
                    {trail.map((item) => (
                        <motion.img key={item.id} src={item.src} alt="trail"
                            initial={{ opacity: 0, scale: 0.2, x: item.x - 96, y: item.y - 96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.2 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute w-48 h-48 object-cover rounded-lg"
                            style={{ zIndex: Math.floor(Math.random() * 10) + 20 }} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default MySocials;