import InfoLayout from "@/components/layouts/InfoLayout";
import { getInfoPageContent } from "@/lib/payload/contentapi.server";

export const metadata = {
  title: "Info",
  alternates: { canonical: "/" },
};

const page = async () => {
  const content = await getInfoPageContent();
  return <InfoLayout content={content} />;
};

export default page;
