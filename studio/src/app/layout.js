import "./globals.css";
import { ToastContainer } from "react-toastify";
import { LenisProvider } from "@/context/LenisContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Montserrat, Geist_Mono } from "next/font/google";
import EmergencyCTA from "@/components/basic/EmergencyCTA";
import NavbarLayout from "@/components/layouts/NavbarLayout";
import FooterLayout from "@/components/layouts/FooterLayout";
import LoaderWrapper from "@/components/wrappers/LoaderWrapper";
import NavbarWrapper from "@/components/wrappers/NavbarWrapper";
import RouteTransition from "@/components/animations/RouteTransition";
import PerformanceBootstrap from "@/components/core/PerformanceBootstrap";
import ThemeLayoutWrapper from "@/components/wrappers/ThemeLayoutWrapper";
import PersistentHeroLayer from "@/components/wrappers/PersistentHeroLayer";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

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
    "Creative Developer",
    "Portfolio",
  ],
  authors: [{ name: "Akhil Shetty", url: "https://akhilshettym.com" }],
  creator: "Akhil Shetty",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Akhil Shetty | Full Stack Developer",
    description:
      "Performance-minded portfolio, selected work, experience, and ways to start a project with Akhil Shetty.",
    url: "/",
    siteName: "Akhil Shetty",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/my-image.png",
        width: 1200,
        height: 630,
        alt: "Akhil Shetty - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akhil Shetty | Full Stack Developer",
    description: "Full stack developer focused on fast, stable, production-grade web experiences.",
    images: ["/my-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-white text-black">
        <PerformanceBootstrap>
          <LenisProvider>
            <ThemeProvider>
              <LoaderWrapper>
                <NavbarWrapper>
                  <NavbarLayout />
                </NavbarWrapper>

                <ThemeLayoutWrapper>
                  <ToastContainer />
                  <PersistentHeroLayer />
                  <div className="relative z-30 grow">
                    <RouteTransition>{children}</RouteTransition>
                  </div>
                </ThemeLayoutWrapper>

                <EmergencyCTA />
                <FooterLayout />
              </LoaderWrapper>
            </ThemeProvider>
          </LenisProvider>
        </PerformanceBootstrap>
      </body>
    </html>
  );
}
