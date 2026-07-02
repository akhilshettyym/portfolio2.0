"use client";

import "@/styles/intro_entrance.css";
import Loader from "@/components/basic/Loader";
import { INTRO_KEY } from "@/utils/localstorage";
import PageReveal from "@/components/basic/PageReveal";
import CinematicIntro from "@/components/CinematicIntro";
import { createContext, useEffect, useRef, useState } from "react";

export const LoadingContext = createContext();

const LoaderWrapper = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [hasSeenIntro, setHasSeenIntro] = useState(null);
    const [showIntro, setShowIntro] = useState(false);
    const [revealActive, setRevealActive] = useState(false);
    const [navReady, setNavReady] = useState(false);
    const [introComplete, setIntroComplete] = useState(false);
    const [shouldMountChildren, setShouldMountChildren] = useState(false);

    const revealTimerRef = useRef(null);

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            const seen = window.localStorage.getItem(INTRO_KEY) === "true";
            setHasSeenIntro(seen);
        });

        return () => window.cancelAnimationFrame(frame);
    }, []);

    const startReveal = () => {
        setRevealActive(true);

        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = window.setTimeout(() => {
            setNavReady(true);
        }, 1800);
    };

    useEffect(() => {
        if (loading || hasSeenIntro === null) return;

        const frame = window.requestAnimationFrame(() => {
            if (hasSeenIntro) {
                startReveal();
            } else {
                setShowIntro(true);
            }
        });

        return () => window.cancelAnimationFrame(frame);
    }, [loading, hasSeenIntro]);

    useEffect(() => {
        return () => window.clearTimeout(revealTimerRef.current);
    }, []);

    const handleIntroComplete = () => {
        window.localStorage.setItem(INTRO_KEY, "true");
        setHasSeenIntro(true);
        setShowIntro(false);
        setIntroComplete(true);
        window.requestAnimationFrame(() => {
            setShouldMountChildren(true);
            startReveal();
        });
    };

    return (
        <LoadingContext.Provider value={{ isLoading: loading, navReady }}>
            {loading && <Loader onFinish={() => setLoading(false)} />}

            {!loading && showIntro && (
                <CinematicIntro onComplete={handleIntroComplete} />
            )}

            <PageReveal active={revealActive}>
                <div className={`relative transition-opacity duration-500 ${revealActive ? "opacity-100" : "opacity-0"}`}>
                    {(shouldMountChildren || hasSeenIntro) && children}
                </div>
            </PageReveal>
        </LoadingContext.Provider>
    );
};

export default LoaderWrapper;
