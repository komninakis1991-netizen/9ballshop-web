import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pool Tournaments & Live Scores",
  description:
    "Upcoming pool and 9-ball tournaments in Greece, Europe and the US, with links to live scores and event calendars.",
  alternates: { canonical: "/tournaments" },
  openGraph: { url: "/tournaments", title: "Pool Tournaments & Live Scores", description: "Upcoming pool and 9-ball tournaments in Greece, Europe and the US, with links to live scores and event calendars." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
