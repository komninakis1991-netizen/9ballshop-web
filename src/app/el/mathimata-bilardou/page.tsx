import type { Metadata } from "next";
import Link from "next/link";
import el from "@/lib/i18n/el";

const TITLE = "Μαθήματα Μπιλιάρδου στην Αθήνα & Online";
const DESCRIPTION =
  "Ιδιαίτερα μαθήματα μπιλιάρδου (pool, 9-ball) με τον Μάριο Κομνηνάκη, 2 φορές πρωταθλητή Ελλάδας νέων. Στην Αθήνα ή online. Κλείσε δωρεάν γνωριμία 15 λεπτών.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Μάριος Κομνηνάκης` },
  description: DESCRIPTION,
  alternates: {
    canonical: "/el/mathimata-bilardou",
    languages: { en: "/lessons", el: "/el/mathimata-bilardou" },
  },
  openGraph: {
    url: "/el/mathimata-bilardou",
    locale: "el_GR",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const L = el.lessons;
const F = el.lessonsFaq;
const faq = [
  [F.q1, F.a1], [F.q2, F.a2], [F.q3, F.a3], [F.q4, F.a4],
  [F.q5, F.a5], [F.q6, F.a6], [F.q7, F.a7], [F.q8, F.a8],
];
const sections = [
  { title: L.techniqueTitle, summary: L.techniqueSummary, points: L.techniquePoints },
  { title: L.strategyTitle, summary: L.strategySummary, points: L.strategyPoints },
  { title: L.psychologyTitle, summary: L.psychologySummary, points: L.psychologyPoints },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: "el",
  mainEntity: faq.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function GreekLessonsPage() {
  return (
    <div lang="el" className="bg-navy min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">Μάριος Κομνηνάκης</p>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-cream mb-6">
          Μαθήματα Μπιλιάρδου με τον Μάριο Κομνηνάκη
        </h1>
        <p className="text-cream/70 leading-relaxed mb-8">
          Μάθε μπιλιάρδο με έναν προπονητή που έχει δουλέψει με πάνω από 100 παίκτες, από αρχάριους
          μέχρι αγωνιστικούς. Τα μαθήματα γίνονται δια ζώσης στην Αθήνα ή online, και καλύπτουν
          τεχνική, στρατηγική και άμυνα, καθώς και τη συγκέντρωση και την ψυχολογία στον αγώνα.
          Ξεκινάμε με ένα δωρεάν βιντεοτηλεφώνημα 15 λεπτών, για να δούμε πού βρίσκεται το παιχνίδι σου.
        </p>
        <Link
          href="/lessons"
          className="inline-block bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
        >
          Κλείσε δωρεάν γνωριμία
        </Link>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 grid gap-6 md:grid-cols-3">
        {sections.map((s) => (
          <div key={s.title} className="bg-navy-light border border-gold/10 rounded-lg p-6">
            <h2 className="font-heading text-2xl text-cream mb-3">{s.title}</h2>
            <p className="text-cream/60 text-sm mb-4">{s.summary}</p>
            <ul className="space-y-1 text-cream/70 text-sm list-disc pl-5">
              {s.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        ))}
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="font-heading text-2xl sm:text-3xl text-cream mb-6 text-center">Συχνές ερωτήσεις</h2>
        <div className="space-y-4">
          {faq.map(([q, a]) => (
            <div key={q} className="border-b border-gold/10 pb-4">
              <h3 className="text-cream font-semibold mb-1">{q}</h3>
              <p className="text-cream/60 text-sm">{a}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-10 text-sm">
          <Link href="/lessons" className="text-gold hover:text-gold-light">Read in English &rarr;</Link>
        </p>
      </section>
    </div>
  );
}
