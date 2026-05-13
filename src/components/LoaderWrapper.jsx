// "use client";

// import { createContext, useState } from "react";
// import Loader from "./Loader";

// export const LoadingContext = createContext();

// export default function LoaderWrapper({ children }) {
//     const [loading, setLoading] = useState(true);

//     return (
//         <LoadingContext.Provider value={{ isLoading: loading }}>
//             {loading && <Loader onFinish={() => setLoading(false)} />}

//             <div className={`transition-all duration-700 ${loading ? "opacity-0 scale-105 blur-sm" : "opacity-100 scale-100 blur-0"}`}>
//                 {children}
//             </div>
//         </LoadingContext.Provider>
//     );
// }



"use client";

import { createContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "./Loader";

export const LoadingContext = createContext();

export default function LoaderWrapper({ children, onComplete }) {
    const [loading, setLoading] = useState(true);

    return (
        <LoadingContext.Provider value={{ isLoading: loading }}>
            <AnimatePresence mode="wait">
                {loading && (
                    <motion.div
                        key="loader"
                        className="fixed inset-0 z-[9999] bg-black"
                        exit={{
                            opacity: 0,
                            transition: {
                                duration: 0.45,
                                ease: [0.76, 0, 0.24, 1],
                            },
                        }}
                    >
                        <Loader
                            onFinish={() => {
                                setLoading(false);
                                onComplete?.();
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={false}
                animate={
                    loading
                        ? {
                            clipPath:
                                "inset(50% 50% 50% 50% round 30px)",
                            scale: 1.08,
                            opacity: 0,
                        }
                        : {
                            clipPath: [
                                "inset(46% 46% 46% 46% round 28px)",
                                "inset(24% 24% 24% 24% round 20px)",
                                "inset(0% 0% 0% 0% round 0px)",
                            ],
                            scale: [1.08, 1.02, 1],
                            opacity: 1,
                        }
                }
                transition={{
                    duration: 1.8,
                    ease: [0.22, 1, 0.36, 1],
                    times: [0, 0.45, 1],
                }}
                className="relative min-h-screen overflow-hidden bg-black"
                style={{
                    transformOrigin: "center center",
                    willChange: "clip-path, transform",
                }}
            >
                {children}
            </motion.div>
        </LoadingContext.Provider>
    );
}