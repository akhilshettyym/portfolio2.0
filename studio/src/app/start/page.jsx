import StartLayout from "@/components/layouts/StartLayout";

export const metadata = {
  title: "Start a Project",
  description: "Get in touch with Akhil Shetty to start a new project or discuss collaboration opportunities.",
  alternates: { canonical: "/start" },
  openGraph: {
    title: "Start a Project | Akhil Shetty",
    description: "Get in touch with Akhil Shetty to start a new project or discuss collaboration opportunities.",
    url: "/start",
  },
};

const page = () => <StartLayout />;

export default page;
