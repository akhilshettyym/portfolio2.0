"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full px-6 py-4 flex items-center justify-between bg-black text-white">

            <div className="text-xl font-semibold tracking-wide">
                AKHIL SHETTY
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wider">
                <Link href="#home" className="hover:text-gray-400 transition"> Home </Link>
                <Link href="#about" className="hover:text-gray-400 transition"> About </Link>
                <Link href="#projects" className="hover:text-gray-400 transition"> Projects </Link>
                <Link href="#experience" className="hover:text-gray-400 transition"> Experience </Link>
                <Link href="#achievements" className="hover:text-gray-400 transition"> Achievements </Link>
                <Link href="#contact" className="hover:text-gray-400 transition"> Contact </Link>
            </div>

            <div>
                <button className="border border-gray-600 px-3 py-1 text-sm rounded hover:bg-white hover:text-black transition">
                    [console]
                </button>
            </div>

        </nav>
    );
}