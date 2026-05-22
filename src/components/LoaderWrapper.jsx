"use client";

import Loader from "./Loader";
import PageReveal from "./PageReveal";
import { createContext, useEffect, useState } from "react";

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

            {loading && (
                <Loader onFinish={() => setLoading(false)} />
            )}

            <PageReveal active={showReveal}>
                <div className={`transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}>
                    {children}
                </div>
            </PageReveal>

        </LoadingContext.Provider>
    );
}