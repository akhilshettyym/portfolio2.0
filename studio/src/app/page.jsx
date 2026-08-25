import InfoLayout from "@/components/layouts/InfoLayout";
import { getInfoPageContent } from "@/lib/payload/contentapi.server";

export const metadata = {
  title: "Info | Akhil Shetty",
  description: "Learn more about my background, skills, and approach to building performant web applications.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Info | Akhil Shetty",
    description: "Learn more about my background, skills, and approach to building performant web applications.",
    url: "/",
  },
};

const page = async () => {
  const content = await getInfoPageContent();
  return <InfoLayout content={content} />;
};

export default page;
