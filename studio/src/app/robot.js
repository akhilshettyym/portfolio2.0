export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://shetty-portfolio-studio.vercel.app/sitemap.xml",
  };
}
