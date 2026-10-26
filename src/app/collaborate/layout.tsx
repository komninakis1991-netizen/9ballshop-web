import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsorships & Collaborations",
  description:
    "Sponsorships and brand partnerships with pool player and creator Marios Komninakis. See how to become a sponsor.",
  alternates: { canonical: "/collaborate" },
  openGraph: { url: "/collaborate", title: "Sponsorships & Collaborations", description: "Sponsorships and brand partnerships with pool player and creator Marios Komninakis. See how to become a sponsor." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
