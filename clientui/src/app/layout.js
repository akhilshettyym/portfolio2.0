import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import NavbarWrapper from "@/components/NavbarWrapper";
import { LenisProvider } from "@/context/LenisContext";
import { Montserrat, Geist_Mono } from "next/font/google";
import EmergencyCTA from "@/components/basic/EmergencyCTA";
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
  metadataBase: new URL("https://akhilshettym.com"),
  title: {
    default: "Akhil Shetty | Full Stack Developer",
    template: "%s | Akhil Shetty",
  },
  description:
    "Portfolio of Akhil Shetty, a full stack developer focused on performant interfaces, scalable systems, and polished product experiences.",
  keywords: [
    "Akhil Shetty",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Portfolio",
  ],
  authors: [{ name: "Akhil Shetty" }],
  creator: "Akhil Shetty",
  openGraph: {
    title: "Akhil Shetty | Full Stack Developer",
    description:
      "Performance-minded portfolio, selected work, experience, and ways to start a project with Akhil Shetty.",
    type: "website",
    locale: "en_US",
    siteName: "Akhil Shetty",
    images: [
      { url: "/my-image.png", width: 1200, height: 630, alt: "Akhil Shetty" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akhil Shetty | Full Stack Developer",
    description:
      "Full stack developer focused on fast, stable, production-grade web experiences.",
    images: ["/my-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-white text-black">
        <PerformanceBootstrap>
          <LenisProvider>
            {/* <LoaderWrapper> */}
              {/* <NavbarWrapper>
                <Navbar />
              </NavbarWrapper> */}

              <main id="main-content" className="relative pt-25 flex flex-col min-h-screen bg-white">
                <ToastContainer />

                <div className="grow">{children}</div>
              </main>

              {/* <EmergencyCTA /> */}
              {/* <Footer /> */}
            {/* </LoaderWrapper> */}
          </LenisProvider>
        </PerformanceBootstrap>
      </body>
    </html>
  );
}
