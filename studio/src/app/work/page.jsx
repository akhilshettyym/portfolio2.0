import WorkLayout from "@/components/layouts/WorkLayout";
import { getWorkPageContent } from "@/lib/payload/contentapi.server";

export const metadata = {
  title: "Work",
  description: "Selected projects, professional experience, and GitHub activity from Akhil Shetty.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work | Akhil Shetty",
    description: "Selected projects, professional experience, and GitHub activity from Akhil Shetty.",
    url: "/work",
  },
};

const page = async () => {
  const content = await getWorkPageContent();
  return <WorkLayout content={content} />;
};

export default page;
