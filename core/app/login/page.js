"use client";

import { showToast } from "@/utils/toast";
import { apiFetch } from "../../utils/api";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (searchParams.get("error") === "session_expired") {
      showToast.warning("Session expired. Please log in again.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.token) {
        localStorage.setItem("authToken", res.token);
        document.cookie = `adminSession=1; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`;
      }

      showToast.success("Login Successful");
      router.push("/dashboard");
    } catch (err) {
      showToast.error(err.message || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="font-mono text-sm uppercase tracking-widest text-black px-6 py-3">
            Verifying...
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4 bg-white">
        <div className="w-full max-w-sm border border-black p-6 bg-white">
          <h2 className="font-mono font-bold uppercase tracking-normal text-center mb-6 text-lg">
            Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full border border-black p-2 text-sm rounded-none focus:outline-none focus:bg-gray-50"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full border border-black p-2 text-sm rounded-none focus:outline-none focus:bg-gray-50"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full border border-black bg-black text-white p-3 text-xs uppercase font-mono tracking-wider hover:bg-white hover:text-black transition-colors duration-150 disabled:opacity-50"
            >
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
