"use client";

// NEW
import { useState } from "react";
import Navbar from "@/components/Navbar";
import NavbarWrapper from "@/components/NavbarWrapper";
import LoaderWrapper from "@/components/LoaderWrapper";
import { LenisProvider } from "@/context/LenisContext";
import PageReveal from "@/components/PageReveal";

export default function AppShell({ children }) {
    const [ready, setReady] = useState(false);

    return (
        <LenisProvider>
            <LoaderWrapper onComplete={() => setReady(true)}>
                <PageReveal active={ready}>
                    <NavbarWrapper>
                        <Navbar />
                    </NavbarWrapper>

                    <main className="pt-28">{children}</main>
                </PageReveal>
            </LoaderWrapper>
        </LenisProvider>
    );
}