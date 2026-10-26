import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/account", "/login", "/register"],
    },
    sitemap: "https://9ballshop.com/sitemap.xml",
    host: "https://9ballshop.com",
  };
}
