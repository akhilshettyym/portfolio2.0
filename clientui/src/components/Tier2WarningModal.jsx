"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

/**
 * Tier 2 Warning Modal with glitch effect
 * Shows information about performance optimization
 */
export default function Tier2WarningModal() {
    const { isTier2 } = usePerformanceTier();
    const [isOpen, setIsOpen] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (isTier2 && !dismissed) {
            // Show modal after a short delay on first load
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isTier2, dismissed]);

    const handleDismiss = () => {
        setIsOpen(false);
        setDismissed(true);
    };

    if (!isTier2 || !isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-linear-to-br from-black via-gray-900 to-black p-6 md:p-8"
                >
                    {/* Glitch effect lines */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <motion.div
                            animate={{
                                opacity: [0.3, 0, 0.3],
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatDelay: 2,
                            }}
                            className="absolute top-0 h-px w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent"
                        />
                        <motion.div
                            animate={{
                                opacity: [0, 0.3, 0],
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatDelay: 2.3,
                            }}
                            className="absolute bottom-1/3 h-px w-full bg-linear-to-r from-transparent via-purple-500 to-transparent"
                        />
                    </div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="mb-4">
                            <motion.div
                                animate={{
                                    textShadow: [
                                        "0px 0px 0px rgba(34, 211, 238, 0)",
                                        "2px 2px 8px rgba(34, 211, 238, 0.6)",
                                        "0px 0px 0px rgba(34, 211, 238, 0)",
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                className="text-lg font-bold uppercase tracking-widest text-white"
                            >
                                Performance Mode
                            </motion.div>
                            <div className="mt-1 h-0.5 w-16 bg-linear-to-r from-cyan-500 to-purple-500" />
                        </div>

                        {/* Content */}
                        <div className="mb-6 space-y-3">
                            <p className="text-sm leading-relaxed text-gray-300">
                                Your device has been optimized for efficient rendering. Some advanced features and animations have been disabled to ensure smooth performance.
                            </p>
                            <p className="text-xs leading-relaxed text-gray-400">
                                This includes reduced visual effects, simplified particle systems, and deferred content loading. The experience remains fully functional.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="mb-6 space-y-2 rounded-lg bg-white/5 p-4">
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                <span className="text-cyan-400">✓</span>
                                <span>Optimized rendering pipeline</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                <span className="text-cyan-400">✓</span>
                                <span>Smart viewport detection</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                <span className="text-cyan-400">✓</span>
                                <span>Deferred content loading</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                <span className="text-purple-400">→</span>
                                <span>All features available</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleDismiss}
                                className="flex-1 rounded-lg bg-linear-to-r from-cyan-500 to-purple-500 px-4 py-2.5 font-semibold text-black transition-all hover:shadow-lg hover:shadow-cyan-500/50"
                            >
                                Got it
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}