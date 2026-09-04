"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { getNotFoundStyles } from "@/utils/themeSwatch";
import { FaArrowLeft, FaRegFolderOpen } from "react-icons/fa6";

export default function NotFound() {
  const { theme } = useTheme();
  const themeStyles = getNotFoundStyles;

  const normalizedTheme = String(theme || "light").toLowerCase();

  const currentTheme = themeStyles[normalizedTheme] || themeStyles.light;

  return (
    <main
      className={`relative min-h-screen w-full overflow-hidden transition-colors duration-500 ${currentTheme.page}`}>
      <div
        className={`pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 ${currentTheme.glow}`}
      />

      <div className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-size-[48px_48px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-xl text-center">
          <div className="mb-8 flex justify-center">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full border transition-all duration-500 ${currentTheme.border} ${currentTheme.card}`}>
              <FaRegFolderOpen size={34} className={`transition-colors duration-500 ${currentTheme.icon}`} />
            </div>
          </div>

          <p
            className={`mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] transition-colors duration-500 ${currentTheme.subtle}`}>
            404 · Route unavailable
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Page not found.</h1>

          <p
            className={`mx-auto mt-4 max-w-md text-sm leading-7 transition-colors duration-500 sm:text-base ${currentTheme.muted}`}>
            The page you&apos;re looking for doesn&apos;t exist, may have been moved, or the address may be incorrect.
          </p>

          <div
            className={`mx-auto mt-7 max-w-md overflow-hidden rounded-xl border text-left transition-colors duration-500 ${currentTheme.border} ${currentTheme.card}`}>
            <div
              className={`border-b px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${currentTheme.border} ${currentTheme.subtle}`}>
              Requested Route
            </div>

            <div className="px-4 py-4">
              <p className={`font-mono text-xs leading-6 transition-colors duration-500 ${currentTheme.muted}`}>
                This route could not be resolved.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${currentTheme.button}`}>
              <FaArrowLeft size={13} />
              Return Home
            </Link>

            <Link
              href="/"
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${currentTheme.secondary}`}>
              <FaRegFolderOpen size={13} />
              Explore Site
            </Link>
          </div>

          <div className={`mx-auto mt-10 h-px w-16 transition-colors duration-500 ${currentTheme.accent}`} />

          <p
            className={`mt-5 text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 ${currentTheme.subtle}`}>
            Akhil Shetty M
          </p>
        </div>
      </div>
    </main>
  );
}