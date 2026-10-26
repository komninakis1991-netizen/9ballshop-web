import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members Area",
  description:
    "Members-only pool drills, lessons and training content from coach Marios Komninakis.",
  alternates: { canonical: "/members" },
  openGraph: { url: "/members", title: "Members Area", description: "Members-only pool drills, lessons and training content from coach Marios Komninakis." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
