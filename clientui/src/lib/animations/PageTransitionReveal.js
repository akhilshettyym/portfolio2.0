"use client";

import { motion } from "framer-motion";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

export default function PageTransitionReveal({ children, delayChildren = 0 }) {
    const { tier, isTier2 } = usePerformanceTier();

    const containerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: isTier2 ? 0.05 : 0.08,
                delayChildren,
            },
        },
    };

    const itemVariants = {
        initial: { opacity: 0, y: isTier2 ? 0 : 10 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: isTier2 ? 0.3 : 0.5,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <motion.div variants={containerVariants} initial="initial" animate="animate">
            {Array.isArray(children) ? (
                children.map((child, idx) => (
                    <motion.div key={idx} variants={itemVariants}>
                        {child}
                    </motion.div>
                ))
            ) : (
                <motion.div variants={itemVariants}>{children}</motion.div>
            )}
        </motion.div>
    );
}