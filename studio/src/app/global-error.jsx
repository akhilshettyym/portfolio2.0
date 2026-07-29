"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen w-full flex items-center justify-center bg-white text-black px-4">
          <div className="max-w-md w-full text-center">
            <h1 className="text-4xl font-bold mb-2">Critical Error</h1>
            <p className="text-xl text-gray-600 mb-6">A critical error occurred. Please try refreshing the page.</p>

            {process.env.NODE_ENV !== "production" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left max-h-48 overflow-auto">
                <p className="text-sm font-mono text-red-700 wrap-break-word">
                  {error?.message || "An unexpected error occurred"}
                </p>
              </div>
            )}

            <button
              onClick={() => reset()}
              className="w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Reload Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
