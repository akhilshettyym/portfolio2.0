import "./globals.css";
import ServerWarmer from "@/lib/ServerWarmer";
import { ToastContainer } from "react-toastify";
import { LenisProvider } from "@/context/LenisContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Montserrat, Geist_Mono } from "next/font/google";

import EmergencyCTA from "@/components/basic/EmergencyCTA";
import HireWrapper from "@/components/wrappers/HireWrapper";
import NavbarLayout from "@/components/layouts/NavbarLayout";
import FooterLayout from "@/components/layouts/FooterLayout";
import ThemeWrapper from "@/components/wrappers/ThemeWrapper";
import LoaderWrapper from "@/components/wrappers/LoaderWrapper";
import NavbarWrapper from "@/components/wrappers/NavbarWrapper";
import PersistentHeroLayer from "@/components/wrappers/HeroWrapper";
import RouteTransition from "@/components/animations/RouteTransition";
import PerformanceBootstrap from "@/components/core/PerformanceBootstrap";
import { GoogleTagManager } from "@next/third-parties/google";
import CookieBanner from "@/components/core/CookieBanner";
import { CookieProvider } from "@/context/CookieContext";

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
};

export const metadata = {
  metadataBase: new URL("https://akhilshettym.com"),
  title: {
    default: "Akhil Shetty | Full Stack Developer",
    template: "%s | Akhil Shetty",
  },
  description:
    "Portfolio of Akhil Shetty, a full stack developer focused on performant interfaces, scalable systems, and polished product experiences.",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Akhil Shetty | Full Stack Developer",
    description: "Full stack developer focused on fast, stable, production-grade web experiences.",
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
    apple: "/apple-touch-icon.png",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Akhil Shetty",
  url: "https://akhilshettym.com",
  jobTitle: "Full Stack Developer",
  sameAs: ["https://github.com/akhilshetty"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${geistMono.variable} antialiased`}>
      <head>
        <script
          id="google-consent-default"
          dangerouslySetInnerHTML={{
            __html: `
             window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             
             gtag('consent', 'default', {
               'analytics_storage': 'denied',
               'ad_storage': 'denied',
               'ad_user_data': 'denied',
               'ad_personalization': 'denied',
               'wait_for_update': 500
             });
           `,
          }}
        />
      </head>

      <body className="bg-white text-black">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />

        <PerformanceBootstrap>
          <CookieProvider>
            <ServerWarmer />
            <CookieBanner />

            <LenisProvider>
              <ThemeProvider>
                <LoaderWrapper>
                  <NavbarWrapper>
                    <NavbarLayout />
                  </NavbarWrapper>

                  <ThemeWrapper>
                    <ToastContainer />
                    <HireWrapper />
                    <PersistentHeroLayer />

                    <div className="relative z-30 grow">
                      <RouteTransition>{children}</RouteTransition>
                    </div>
                  </ThemeWrapper>

                  <EmergencyCTA />
                  <FooterLayout />
                </LoaderWrapper>
              </ThemeProvider>
            </LenisProvider>
          </CookieProvider>
        </PerformanceBootstrap>
      </body>

      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
    </html>
  );
}
