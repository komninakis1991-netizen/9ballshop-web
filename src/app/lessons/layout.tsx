import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pool Lessons in Athens & Online",
  description:
    "Private and group pool lessons, in person in Athens or online: technique, strategy, defense and match psychology. Book a free 15-minute discovery call.",
  alternates: { canonical: "/lessons" },
  openGraph: { url: "/lessons", title: "Pool Lessons in Athens & Online", description: "Private and group pool lessons, in person in Athens or online: technique, strategy, defense and match psychology. Book a free 15-minute discovery call." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
