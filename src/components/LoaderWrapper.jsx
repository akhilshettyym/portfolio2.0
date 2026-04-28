"use client";

import { useState } from "react";
import Loader from "./Loader";

export default function LoaderWrapper({ children }) {
    const [loading, setLoading] = useState(true);

    return (
        <>
            {loading && <Loader onFinish={() => setLoading(false)} />}

            <div className={`transition-all duration-700 ${loading ? "opacity-0 scale-105 blur-sm" : "opacity-100 scale-100 blur-0"}`}>
                {children}
            </div>
        </>
    );
}