"use client";

import { apiFetch } from "../utils/api";
import { showToast } from "@/utils/toast";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";

export default function AdminClient({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  const [loggingOut, setLoggingOut] = useState(false);

  // Reset loggingOut state directly during render if we have successfully arrived at the login page
  if (isLoginPage && loggingOut) {
    setLoggingOut(false);
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
      showToast.success("Logged out Successfully");
    } catch (error) {
      showToast.error("Logout failed: " + error.message);
      setLoggingOut(false);
    } finally {
      localStorage.removeItem("authToken");
      document.cookie = "adminSession=; path=/; max-age=0; SameSite=Lax";
      router.replace("/login");
    }
  };

  return (
    <>
      {loggingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="font-mono text-sm uppercase tracking-widest text-black px-6 py-3">Logging out...</div>
        </div>
      )}

      {!isLoginPage && (
        <nav className="w-full border-b border-black py-5 px-6 flex justify-between items-center bg-white">
          <span className="font-mono font-extrabold tracking-normal uppercase text-md">AKHIL SHETTY // ADMIN</span>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="border-2 border-black px-4 py-2 text-sm uppercase font-mono tracking-normal hover:bg-black hover:text-white transition-colors duration-150 disabled:opacity-50">
            {loggingOut ? "Exiting..." : "Logout"}
          </button>
        </nav>
      )}

      <main className="flex-1 flex flex-col">
        {children}
        <ToastContainer />
      </main>
    </>
  );
}
