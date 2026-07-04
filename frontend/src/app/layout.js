import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import GlobalCursor from "@/components/GlobalCursor";
import NavbarWrapper from "@/components/NavbarWrapper";
import { LenisProvider } from "@/context/LenisContext";
import { Montserrat, Geist_Mono } from "next/font/google";
import LoaderWrapper from "@/components/basic/LoaderWrapper";

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
  title: "AKHIL SHETTY",
  description: "Ofc it's me",
};

export default function RootLayout({ children }) {
  // const cores = navigator.hardwareConcurrency;
  // console.log(`Logical Cores: ${cores}`);

  // function getCPUSpeedScore() {
  //   const iterations = 100000000;
  //   const start = performance.now();

  //   for (let i = 0; i < iterations; i++) {
  //     Math.sqrt(i);
  //   }

  //   const duration = performance.now() - start;
  //   return iterations / duration;
  // }

  // console.log(`Relative CPU Score: ${getCPUSpeedScore().toFixed(2)} ops/ms`);

  return (
    <html lang="en" className={`${montserrat.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-white text-black">
        <GlobalCursor />

        <LenisProvider>
          <LoaderWrapper>

            <NavbarWrapper>
              <Navbar />
            </NavbarWrapper>

            <main className="relative pt-25">
              {children}
              <ToastContainer />
            </main>

          </LoaderWrapper>
        </LenisProvider>
      </body>
    </html>
  );
}