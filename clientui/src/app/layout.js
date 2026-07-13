import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import NavbarWrapper from "@/components/NavbarWrapper";
import { LenisProvider } from "@/context/LenisContext";
import { Montserrat, Geist_Mono } from "next/font/google";
import LoaderWrapper from "@/components/basic/LoaderWrapper";
import PerformanceBootstrap from "@/components/PerformanceBootstrap";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Akhil Shetty",
  description: "Ofc it's me",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" className={`${montserrat.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-white text-black">
        <PerformanceBootstrap>

          <LenisProvider>
            <LoaderWrapper>

              <NavbarWrapper>
                <Navbar />
              </NavbarWrapper>

              <main className="relative pt-25">
                <ToastContainer />
                {children}
              </main>

            </LoaderWrapper>
          </LenisProvider>
        </PerformanceBootstrap>
      </body>
    </html>
  );
}