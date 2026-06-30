"use client";

import { useState } from "react";
import { apiFetch } from "../../utils/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(false);

        try {
            await apiFetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(formData),
            });
            router.push("/dashboard");

        } catch (err) {
            setError(err.message || "Invalid credentials");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4 bg-white">
            <div className="w-full max-w-sm border border-black p-6 bg-white">
                <h2 className="font-mono font-bold uppercase tracking-normal text-center mb-6 text-lg"> Admin Login </h2>

                {error && (
                    <div className="border border-black bg-black text-white text-xs p-2 mb-4 font-mono text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-mono text-xs uppercase mb-1"> Email Address </label>
                        <input type="email" required className="w-full border border-black p-2 text-sm rounded-none focus:outline-none focus:bg-gray-50" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase mb-1">Password</label>
                        <input type="password" required className="w-full border border-black p-2 text-sm rounded-none focus:outline-none focus:bg-gray-50" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </div>

                    <button type="submit" disabled={loading} className="w-full border border-black bg-black text-white p-3 text-xs uppercase font-mono tracking-wider hover:bg-white hover:text-black transition-colors duration-150 disabled:opacity-50">
                        {loading ? "Verifying..." : "Enter Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
}