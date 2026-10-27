import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Photos from tournaments, lessons and life on the pool table with coach and player Marios Komninakis.",
  alternates: { canonical: "/gallery" },
  openGraph: { url: "/gallery", title: "Photo Gallery", description: "Photos from tournaments, lessons and life on the pool table with coach and player Marios Komninakis." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
