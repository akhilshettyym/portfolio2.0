import "./globals.css";
import AdminClient from "./AdminClient";

export const metadata = {
  title: "Akhil Shetty - Admin Dashboard",
  description:
    "Admin dashboard for managing portfolio inquiries and communications.",
  keywords: ["admin", "dashboard", "portfolio", "inquiries", "Akhil Shetty"],
  authors: [{ name: "Akhil Shetty" }],
  creator: "Akhil Shetty",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Akhil Shetty - Admin Dashboard",
    description:
      "Admin dashboard for managing portfolio inquiries and communications.",
    type: "website",
    siteName: "Akhil Shetty Portfolio",
  },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-black antialiased">
        <AdminClient>{children}</AdminClient>
      </body>
    </html>
  );
}