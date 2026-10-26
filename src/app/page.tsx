import { getPrisma } from "@/lib/prisma";
import HomeContent from "./HomeContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://9ballshop.com/#website",
      url: "https://9ballshop.com",
      name: "9BallShop",
      inLanguage: ["en", "el"],
      publisher: { "@id": "https://9ballshop.com/#marios" },
    },
    {
      "@type": "Person",
      "@id": "https://9ballshop.com/#marios",
      name: "Marios Komninakis",
      alternateName: "Μάριος Κομνηνάκης",
      jobTitle: "Pool coach and player",
      url: "https://9ballshop.com/about",
      homeLocation: { "@type": "Place", name: "Athens, Greece" },
      award: "Greek National Youth Pool Champion (2x)",
      knowsLanguage: ["el", "en"],
      sameAs: [
        "https://youtube.com/@komninakis",
        "https://instagram.com/komninakis.m",
        "https://tiktok.com/@marioskomninakis",
        "https://facebook.com/komni91",
        "https://medium.com/@marioskomninakis",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://9ballshop.com/#lessons",
      name: "Pool lessons with Marios Komninakis",
      url: "https://9ballshop.com/lessons",
      areaServed: ["Athens, Greece", "Online"],
      provider: { "@id": "https://9ballshop.com/#marios" },
    },
  ],
};

export default async function Home() {
  const prisma = await getPrisma();

  const latestPosts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent latestPosts={latestPosts} />
    </>
  );
}
