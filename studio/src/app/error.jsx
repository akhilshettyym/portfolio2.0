"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FaRegFolderOpen } from "react-icons/fa6";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white text-black px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <FaRegFolderOpen size={64} className="text-gray-400" />
        </div>

        <h1 className="text-4xl font-bold mb-2">Something interrupted this page</h1>
        <p className="text-xl text-gray-600 mb-2">Something went wrong</p>

        {process.env.NODE_ENV !== "production" && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left max-h-48 overflow-auto">
            <p className="text-sm font-mono text-gray-700 wrap-break-word">
              {error?.message || "An unexpected error occurred"}
            </p>
          </div>
        )}

        <p className="text-gray-500 text-sm mb-6">
          We&apos;ve logged this error and will look into it. Try refreshing the page or
          come back later.
        </p>

        <button
          onClick={() => reset()}
          className="w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors mb-3"
        >
          Try Again
        </button>

        <Link
          href="/"
          className="block w-full bg-gray-100 text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
