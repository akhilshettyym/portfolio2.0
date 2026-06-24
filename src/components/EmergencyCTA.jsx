"use client";

import Link from "next/link";
import Image from "next/image";
import "@/styles/emergency_cta.css";

const EmergencyCTA = () => {

    return (
        <div className="px-10">
            <div className="relative flex flex-row items-center overflow-hidden w-full">
                <div className="flex-1 rounded-lg text-sm p-4 flex items-center justify-start min-w-0">
                    <Image src="/footer/animated_qr_border.gif" alt="animated qr border" width={200} height={56} priority unoptimized style={{ width: 'auto' }} className="z-10 h-14 object-contain mix-blend-multiply" />
                </div>

                <div className="flex-1 rounded-lg text-sm p-4 overflow-hidden min-w-0 flex items-center">
                    <Link href="/work" className="group block w-full cursor-pointer">
                        <div className="animate-marquee flex whitespace-nowrap">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <span key={i} className="mx-8 text-xs md:text-sm uppercase tracking-[0.3em] font-medium text-black transition-colors duration-200 group-hover:text-indigo-600 group-hover:underline decoration-2 underline-offset-4 pointer-events-none">
                                    IN CASE OF EMERGENCY. PLEASE GO BACK AND VIEW ALL PROJECTS
                                </span>
                            ))}
                        </div>
                    </Link>
                </div>

                <div className="flex-1 rounded-lg text-sm p-4 flex items-center justify-end min-w-0">
                    <Image src="/footer/animated_qr_border.gif" alt="animated qr border" width={200} height={56} priority unoptimized style={{ width: 'auto' }} className="z-10 h-14 object-contain mix-blend-multiply" />
                </div>
            </div>
        </div>
    );
};

export default EmergencyCTA;
