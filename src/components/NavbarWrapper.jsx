"use client";

import { useContext } from "react";
import { LoadingContext } from "./LoaderWrapper";

export default function NavbarWrapper({ children }) {
    const context = useContext(LoadingContext);
    const isLoading = context?.isLoading ?? true;

    if (isLoading) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full z-50 animate-navbar-enter">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md backdrop-saturate-50 border-b border-black/10" />
            <div className="relative">
                {children}
            </div>
        </div>
    );
}