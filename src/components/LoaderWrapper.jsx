"use client";

import Loader from "./Loader";
import PageReveal from "./PageReveal";
import CinematicIntro from "./CinematicIntro";
import { createContext, useEffect, useRef, useState } from "react";

export const LoadingContext = createContext();

const INTRO_KEY = "portfolio_intro_seen_v1";

const LoaderWrapper = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [hasSeenIntro, setHasSeenIntro] = useState(false);
    const [showIntro, setShowIntro] = useState(false);
    const [revealActive, setRevealActive] = useState(false);
    const [navReady, setNavReady] = useState(false);

    const revealTimerRef = useRef(null);

    useEffect(() => {
        const seen = window.localStorage.getItem(INTRO_KEY) === "true";
        setHasSeenIntro(seen);
    }, []);

    const startReveal = () => {
        setRevealActive(true);

        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = window.setTimeout(() => {
            setNavReady(true);
        }, 1800);
    };

    useEffect(() => {
        if (loading) return;

        if (hasSeenIntro) {
            startReveal();
        } else {
            setShowIntro(true);
        }
    }, [loading, hasSeenIntro]);

    useEffect(() => {
        return () => window.clearTimeout(revealTimerRef.current);
    }, []);

    const handleIntroComplete = () => {
        window.localStorage.setItem(INTRO_KEY, "true");
        setHasSeenIntro(true);
        setShowIntro(false);
        startReveal();
    };

    return (
        <LoadingContext.Provider value={{ isLoading: loading, navReady }}>
            {loading && <Loader onFinish={() => setLoading(false)} />}

            {!loading && showIntro && (
                <CinematicIntro onComplete={handleIntroComplete} />
            )}

            <PageReveal active={revealActive}>
                <div className={`relative transition-opacity duration-500 ${revealActive ? "opacity-100" : "opacity-0"}`}>
                    {children}
                </div>
            </PageReveal>
        </LoadingContext.Provider>
    );
};

export default LoaderWrapper;