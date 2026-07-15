"use client";

import { useEffect, useState } from "react";
import { LIMP_BANNER } from "@/utils/storage";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "@/components/basic/CustomButton";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

export default function LimpModal() {
    const { isTier2 } = usePerformanceTier();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isTier2) return;

        const hasShown = localStorage.getItem(LIMP_BANNER);
        if (hasShown === "true") return;

        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1200);

        return () => clearTimeout(timer);
    }, [isTier2]);

    const handleDismiss = () => {
        setIsOpen(false);
        localStorage.setItem(LIMP_BANNER, "true");
    };

    if (!isTier2 || localStorage.getItem(LIMP_BANNER) === "true") {
        return null;
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="absolute inset-0" onClick={handleDismiss} />

                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative mx-5 w-full max-w-md overflow-hidden border border-white/20 bg-white p-6 md:p-6 z-10">

                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <motion.div animate={{ opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 5, repeat: Infinity, repeatDelay: 2 }}
                                className="absolute top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

                            <motion.div animate={{ opacity: [0, 0.3, 0] }}
                                transition={{ duration: 5, repeat: Infinity, repeatDelay: 2.3 }}
                                className="absolute bottom-1/3 h-px w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                        </div>

                        <div className="relative z-10">
                            <div className="mb-2">
                                <div className="text-lg font-extrabold uppercase tracking-wide text-black">
                                    Limp Mode
                                </div>
                            </div>

                            <div className="mb-5 space-y-3 text-justify">
                                <p className="text-sm text-gray-400">
                                    Performance optimization is active to ensure an ultra-smooth frame rate. To maintain a fast, stable interface, selected animations and advanced visual effects have been streamlined.
                                </p>
                            </div>

                            <div className="w-full sm:w-auto flex justify-end">
                                <CustomButton title="Got it" onClick={handleDismiss} width={180} height={40} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};