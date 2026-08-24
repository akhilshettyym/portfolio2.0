import PrivacyLayout from "@/components/layouts/PrivacyLayout";

export const metadata = {
  title: "Privacy Policy | Akhil Shetty",
  description:
    "Read the Privacy Policy to understand how your personal data, browser storage, and visual preferences are handled on Akhil Shetty's portfolio.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Akhil Shetty",
    description:
      "Read the Privacy Policy to understand how your personal data, browser storage, and visual preferences are handled on Akhil Shetty's portfolio.",
    url: "/privacy",
    type: "website",
  },
};

const PrivacyPage = () => <PrivacyLayout />;

export default PrivacyPage;
