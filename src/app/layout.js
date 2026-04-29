import { Montserrat, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LoaderWrapper from "@/components/LoaderWrapper";
import NavbarWrapper from "@/components/NavbarWrapper";
import { LenisProvider } from "@/context/LenisContext";

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
  return (
    <html lang="en" className={`${montserrat.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-white text-black">
        <LenisProvider>
          <LoaderWrapper>

            <NavbarWrapper>
              <Navbar />
            </NavbarWrapper>

            <main className="pt-20">{children}</main>

          </LoaderWrapper>
        </LenisProvider>
      </body>
    </html>
  );
}
