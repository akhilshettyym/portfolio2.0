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

import { createContext, useEffect, useState } from "react";

import Loader from "./Loader";
import PageReveal from "./PageReveal";

export const LoadingContext = createContext();

export default function LoaderWrapper({ children }) {

    const [loading, setLoading] = useState(true);

    const [showReveal, setShowReveal] = useState(false);

    useEffect(() => {

        if (!loading) {

            setShowReveal(true);

            const timeout = setTimeout(() => {
                setShowReveal(false);
            }, 1800);

            return () => clearTimeout(timeout);
        }

    }, [loading]);

    return (

        <LoadingContext.Provider value={{ isLoading: loading }}>

            {/* LOADER */}

            {loading && (
                <Loader onFinish={() => setLoading(false)} />
            )}

            {/* APP */}

            <PageReveal active={showReveal}>

                <div
                    className={`
                        transition-opacity
                        duration-500
                        ${loading ? "opacity-0" : "opacity-100"}
                    `}
                >
                    {children}
                </div>

            </PageReveal>

        </LoadingContext.Provider>
    );
}