import type { Metadata } from "next";
import Link from "next/link";
import en from "@/lib/i18n/en";

const TITLE = "Pool Lessons in Athens & Online";
const DESCRIPTION =
  "Private and group pool lessons, in person in Athens or online: technique, strategy, defense and match psychology. Book a free 15-minute discovery call.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/lessons",
    languages: { en: "/lessons", el: "/el/mathimata-bilardou" },
  },
  openGraph: { url: "/lessons", title: TITLE, description: DESCRIPTION },
};

const F = en.lessonsFaq;
const faq = [
  [F.q1, F.a1], [F.q2, F.a2], [F.q3, F.a3], [F.q4, F.a4],
  [F.q5, F.a5], [F.q6, F.a6], [F.q7, F.a7], [F.q8, F.a8],
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
      <p className="bg-navy text-center pb-10 text-sm">
        <Link href="/el/mathimata-bilardou" lang="el" className="text-gold hover:text-gold-light">
          Μαθήματα μπιλιάρδου στα Ελληνικά &rarr;
        </Link>
      </p>
    </>
  );
}
