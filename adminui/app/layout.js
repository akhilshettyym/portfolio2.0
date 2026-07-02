"use client";

import "./globals.css";
import { apiFetch } from "../utils/api";
import { showToast } from "@/utils/toast";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({ children }) {

  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
      router.push("/login");

      showToast.success("Logged out Successfully");

    } catch (error) {
      showToast.error("Logout failed: " + error.message);
    }
  };

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-black antialiased">

        {!isLoginPage && (
          <nav className="w-full border-b border-black py-5 px-6 flex justify-between items-center bg-white">

            <span className="font-mono font-extrabold tracking-normal uppercase text-md">
              AKHIL SHETTY // ADMIN
            </span>

            <button onClick={handleLogout} className="border-2 border-black px-4 py-2 text-sm uppercase font-mono tracking-normal hover:bg-black hover:text-white transition-colors duration-150">
              Logout
            </button>

          </nav>
        )}

        <main className="flex-1 flex flex-col">
          {children}
          <ToastContainer />
        </main>

      </body>
    </html>
  );
}