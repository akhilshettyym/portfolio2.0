"use client";

import { createContext, useState } from "react";
import Loader from "./Loader";

export const LoadingContext = createContext();

export default function LoaderWrapper({ children }) {
    const [loading, setLoading] = useState(true);

    return (
        <LoadingContext.Provider value={{ isLoading: loading }}>
            {loading && <Loader onFinish={() => setLoading(false)} />}

            <div className={`transition-all duration-700 ${loading ? "opacity-0 scale-105 blur-sm" : "opacity-100 scale-100 blur-0"}`}>
                {children}
            </div>
        </LoadingContext.Provider>
    );
}