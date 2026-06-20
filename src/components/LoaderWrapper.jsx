"use client";

import Loader from "./Loader";
import PageReveal from "./PageReveal";
import { createContext, useEffect, useState } from "react";

export const LoadingContext = createContext();

const LoaderWrapper = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [navReady, setNavReady] = useState(false);

    useEffect(() => {
        if (loading) return;

        const timeout = setTimeout(() => {
            setNavReady(true);
        }, 1800);

        return () => clearTimeout(timeout);
    }, [loading]);

    const showReveal = !loading && !navReady;

    return (
        <LoadingContext.Provider value={{ isLoading: loading, navReady }}>

            {loading && (
                <Loader
                    onFinish={() => {
                        setLoading(false);
                    }} />
            )}

            <PageReveal active={showReveal}>
                <div className={`relative transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}>
                    {children}
                </div>
            </PageReveal>
        </LoadingContext.Provider>
    );
};

export default LoaderWrapper;