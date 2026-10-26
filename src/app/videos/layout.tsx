import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pool Videos, Drills & Podcasts",
  description:
    "Pool training videos, match breakdowns and podcasts from coach and player Marios Komninakis.",
  alternates: { canonical: "/videos" },
  openGraph: { url: "/videos", title: "Pool Videos, Drills & Podcasts", description: "Pool training videos, match breakdowns and podcasts from coach and player Marios Komninakis." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
