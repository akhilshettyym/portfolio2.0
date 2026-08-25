import PrivacyLayout from "@/components/layouts/PrivacyLayout";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Understand how your personal data, browser storage, and visual preferences are handled on Akhil Shetty's portfolio.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | Akhil Shetty",
    description:
      "Understand how your personal data, browser storage, and visual preferences are handled on Akhil Shetty's portfolio.",
    url: "/privacy",
    type: "website",
  },
  robots: {
    index: false,
    follow: true,
  },
};

const page = () => <PrivacyLayout />;

export default page;
