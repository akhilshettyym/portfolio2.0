"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target, start, duration = 1200) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!start) return;

        let current = 0;
        const stepTime = 16;
        const increment = target / (duration / stepTime);

        const interval = setInterval(() => {
            current += increment;

            if (current >= target) {
                current = target;
                clearInterval(interval);
            }

            setValue(current);
        }, stepTime);

        return () => clearInterval(interval);
    }, [target, start, duration]);

    return value;
}

const educationData = [
    {
        id: "01-01",
        level: "SSLC",
        score: 87.84,
        years: "2009 - 2019",
        institution: "Canara High School",
        type: "percent",
    },
    {
        id: "01-02",
        level: "PUC (PCMB)",
        score: 95.17,
        years: "2019 - 2021",
        institution: "Boscoss PU College",
        type: "percent",
    },
    {
        id: "01-03",
        level: "BE (CSE)",
        score: 8.76,
        years: "2021 - 2025",
        institution: "St. Joseph Engineering College",
        type: "cgpa",
    },
];

function EducationRow({ e, start, index }) {
    const animated = useCountUp(e.score * 10, start);

    const display = e.type === "cgpa" ? `${(animated / 10).toFixed(2)} CGPA` : `${Math.min(animated / 10, 100).toFixed(2)}%`;

    return (
        <div className={`w-full flex items-center justify-between px-3 py-2 transition-all duration-500 hover:translate-x-1 ${start ? "animate-row" : ""}`} style={{ animationDelay: `${index * 120}ms` }}>
            <span className="text-gray-500 w-28"> DOC.[{e.id}] </span>

            <span className="w-40 text-white/90"> {e.level} </span>

            <span className="flex-1 text-center">
                <span className="text-lg font-semibold text-white"> {display} </span>
                <span className="text-xs text-gray-400 ml-2"> | {e.years} </span>
            </span>

            <span className="w-96 text-right text-white/70"> {e.institution} </span>
        </div>
    );
}

export default function EducationLog() {
    const ref = useRef(null);
    const [start, setStart] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStart(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.2,
            }
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="pt-10 pr-10 pl-10">
            <div ref={ref} className="w-full font-mono text-sm">
            <div className="mb-6 relative">
                <div className="border-t border-white/10" />
                <div className="absolute -top-3 left-0 w-full flex justify-between text-white/60">
                    <span> + </span><span> + </span><span> + </span><span> + </span>
                </div>
            </div>

            <div className="mb-5 text-[12px] tracking-[0.25em] text-white/40"> / EDUCATION LOG </div>

            <div className="mb-6 border-t border-white/20" />

            <div className="space-y-1">
                {educationData.map((e, i) => (
                    <EducationRow key={e.id} e={e} start={start} index={i} />
                ))}
            </div>
        </div>
        </div>
    );
}