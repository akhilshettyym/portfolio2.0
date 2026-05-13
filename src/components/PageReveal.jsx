"use client";
import { motion, AnimatePresence } from "framer-motion";

// NEW
export default function PageReveal({ active, children }) {
    return (
        <AnimatePresence mode="wait">
            {active && (
                <motion.div
                    className="relative min-h-screen w-full overflow-hidden bg-black"
                    initial={{
                        clipPath: "inset(47% 47% 47% 47% round 28px)",
                        scale: 1.06,
                        opacity: 1,
                    }}
                    animate={{
                        clipPath: [
                            "inset(47% 47% 47% 47% round 28px)",
                            "inset(28% 28% 28% 28% round 18px)",
                            "inset(0% 0% 0% 0% round 0px)",
                        ],
                        scale: [1.06, 1.015, 1],
                        opacity: 1,
                    }}
                    transition={{
                        duration: 1.55,
                        ease: [0.22, 1, 0.36, 1],
                        times: [0, 0.38, 1],
                    }}
                    style={{
                        transformOrigin: "center center",
                        willChange: "clip-path, transform",
                    }}
                >
                    {children}
                    <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-[999] mix-blend-screen"
                        initial={{ opacity: 0.9 }}
                        animate={{ opacity: [0.9, 0.45, 0] }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.08)_18%,rgba(255,255,255,0)_52%)]" />

                        <motion.div
                            className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.14)_48%,transparent_100%)]"
                            animate={{ y: ["-10%", "10%", "-10%"], opacity: [0, 1, 0] }}
                            transition={{ duration: 0.8, repeat: 1, ease: "easeInOut" }}
                        />

                        {Array.from({ length: 6 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute left-0 right-0 h-px bg-white/20"
                                style={{ top: `${18 + i * 11}%` }}
                                animate={{ x: [0, i % 2 ? 12 : -12, 0] }}
                                transition={{ duration: 0.55, delay: i * 0.05, ease: "easeOut" }}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}