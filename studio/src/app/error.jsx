"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaArrowLeft, FaArrowRotateRight, FaRegFolderOpen } from "react-icons/fa6";

export default function Error({ error, reset }) {
  const { theme } = useTheme();

  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  const themeStyles = {
    light: {
      page: "bg-white text-black",
      muted: "text-black/55",
      subtle: "text-black/40",
      icon: "text-black/35",
      border: "border-black/10",
      card: "bg-black/[0.025]",
      button: "bg-black text-white hover:bg-black/80",
      secondary: "bg-black/5 text-black hover:bg-black/10",
      accent: "bg-black",
    },
    dark: {
      page: "bg-black text-white",
      muted: "text-white/60",
      subtle: "text-white/40",
      icon: "text-white/35",
      border: "border-white/10",
      card: "bg-white/[0.04]",
      button: "bg-white text-black hover:bg-white/85",
      secondary: "bg-white/10 text-white hover:bg-white/15",
      accent: "bg-white",
    },
    metal: {
      page: "bg-black text-red-500",
      muted: "text-red-500/65",
      subtle: "text-red-500/40",
      icon: "text-red-500/40",
      border: "border-red-500/15",
      card: "bg-red-500/[0.035]",
      button: "bg-red-500 text-black hover:bg-red-400",
      secondary: "bg-red-500/10 text-red-500 hover:bg-red-500/15",
      accent: "bg-red-500",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  return (
    <main
      className={`relative min-h-screen w-full overflow-hidden transition-colors duration-500 ${currentTheme.page}`}>
      <div
        className={`pointer-events-none absolute inset-0 opacity-60 ${theme === "metal" ? "bg-[radial-gradient(circle_at_50%_35%,rgba(239,68,68,0.08),transparent_45%)]" : theme === "dark" ? "bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.06),transparent_45%)]" : "bg-[radial-gradient(circle_at_50%_35%,rgba(0,0,0,0.04),transparent_45%)]"}`}
      />

      <div className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-size-[48px_48px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-xl text-center">
          <div className="mb-8 flex justify-center">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full border transition-colors duration-500 ${currentTheme.border} ${currentTheme.card}`}>
              <FaRegFolderOpen size={34} className={`transition-colors duration-500 ${currentTheme.icon}`} />
            </div>
          </div>

          <p
            className={`mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] transition-colors duration-500 ${currentTheme.subtle}`}>
            Unexpected interruption
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Something went wrong.</h1>

          <p
            className={`mx-auto mt-4 max-w-md text-sm leading-7 transition-colors duration-500 sm:text-base ${currentTheme.muted}`}>
            This page ran into an unexpected problem. Nothing is lost — try loading it again or return to the homepage.
          </p>

          {process.env.NODE_ENV !== "production" && (
            <div
              className={`mt-7 overflow-hidden rounded-xl border text-left transition-colors duration-500 ${currentTheme.border} ${currentTheme.card}`}>
              <div
                className={`border-b px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${currentTheme.border} ${currentTheme.subtle}`}>
                Development Error
              </div>

              <div className="max-h-40 overflow-auto px-4 py-4">
                <p
                  className={`wrap-break-word font-mono text-xs leading-6 transition-colors duration-500 ${currentTheme.muted}`}>
                  {error?.message || "An unexpected error occurred."}
                </p>

                {error?.digest && (
                  <p className={`mt-3 font-mono text-[10px] transition-colors duration-500 ${currentTheme.subtle}`}>
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${currentTheme.button}`}>
              <FaArrowRotateRight size={13} />
              Try Again
            </button>

            <Link
              href="/"
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${currentTheme.secondary}`}>
              <FaArrowLeft size={13} />
              Go Home
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
