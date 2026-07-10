"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "@/context/LenisContext";

export default function HashScrollListener() {
    const pathname = usePathname();
    const lenisRef = useLenis();

    useEffect(() => {
        const handleHashScroll = () => {
            const hash = window.location.hash;
            if (!hash) return;

            const elementId = hash.replace("#", "");

            const executeScroll = () => {
                const element = document.getElementById(elementId);
                if (!element) return false;

                const lenis = lenisRef?.current || window.lenis;

                if (lenis && typeof lenis.scrollTo === "function") {
                    lenis.scrollTo(element, {
                        offset: -100,
                        duration: 1.2,
                        immediate: false
                    });
                    return true;
                }

                const topPos = element.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: topPos, behavior: "smooth" });
                return true;
            };

            if (!executeScroll()) {
                const observer = new MutationObserver(() => {
                    if (executeScroll()) {
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                });

                setTimeout(() => observer.disconnect(), 4000);
            }
        };

        const initialTimeout = setTimeout(handleHashScroll, 400);

        window.addEventListener("hashchange", handleHashScroll);
        return () => {
            clearTimeout(initialTimeout);
            window.removeEventListener("hashchange", handleHashScroll);
        };
    }, [pathname, lenisRef]);

    return null;
}