"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const RouteReveal = () => {
    const pathname = usePathname();
    const previousPath = useRef(pathname);
    const [activeKey, setActiveKey] = useState(null);
    const { isTier2 } = usePerformanceTier();

    useEffect(() => {
        if (previousPath.current === pathname) return undefined;

        previousPath.current = pathname;
        const key = `${pathname}-${Date.now()}`;
        setActiveKey(key);

        const timeout = window.setTimeout(() => {
            setActiveKey(null);
        }, isTier2 ? 720 : 1180);

        return () => window.clearTimeout(timeout);
    }, [isTier2, pathname]);

    return (
        <AnimatePresence>
            {activeKey && (
                <motion.div
                    key={activeKey}
                    className="fixed inset-0 z-9999 pointer-events-none overflow-hidden bg-transparent"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: [0, 1, 1, 0] }}
                        transition={{
                            duration: isTier2 ? 0.72 : 1.08,
                            times: [0, 0.38, 0.62, 1],
                            ease: [0.77, 0, 0.175, 1],
                        }}
                        className="absolute inset-0 origin-left bg-black"
                    />
                    {!isTier2 && (
                        <>
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: ["-100%", "0%", "100%"] }}
                                transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
                                className="absolute top-0 h-full w-1/3 bg-white/12 blur-xl"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.94 }}
                                animate={{ opacity: [0, 0.32, 0], scale: [0.94, 1, 1.08] }}
                                transition={{ duration: 1.08, ease: "easeOut" }}
                                className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25"
                            />
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RouteReveal;