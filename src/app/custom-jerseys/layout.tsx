import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Pool Jerseys",
  description:
    "Custom jerseys for pool players and teams, designed with your name and logo.",
  alternates: { canonical: "/custom-jerseys" },
  openGraph: { url: "/custom-jerseys", title: "Custom Pool Jerseys", description: "Custom jerseys for pool players and teams, designed with your name and logo." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
