import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "About Marios Komninakis | Pool Player & Coach" },
  description:
    "Greek national youth pool champion at 14, European Championship player and coach of 100+ students. The story of Marios Komninakis, from Athens to tournaments in 20+ countries.",
  alternates: { canonical: "/about" },
  openGraph: { type: "profile", url: "/about", title: "About Marios Komninakis | Pool Player & Coach" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
