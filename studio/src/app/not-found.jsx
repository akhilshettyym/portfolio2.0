import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center transition-colors duration-300 theme-404">
      <span className="text-xs font-mono uppercase tracking-widest opacity-50">404</span>

      <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">Page not found</h1>

      <p className="mt-3 max-w-xs text-sm opacity-70">The path you entered doesn&apos;t exist or has been moved.</p>

      <Link
        href="/"
        className="mt-8 rounded-full border border-current px-6 py-2 text-xs font-medium tracking-wide transition-all hover:opacity-70 active:scale-95">
        Return Home
      </Link>
    </main>
  );
}
