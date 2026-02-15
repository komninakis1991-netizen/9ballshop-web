"use client";

import { useState } from "react";
import Link from "next/link";

const content = {
  el: {
    subtitle: "Μαθήματα Μπιλιάρδου",
    title: "Μαθήματα",
    intro: "Το μπιλιάρδο χωρίζεται σε 3 κατηγορίες.",
    sections: [
      {
        icon: "🎯",
        title: "Τεχνική",
        summary:
          "Η τεχνική που έχει να κάνει με τον τρόπο που χτυπάμε την μπάλα, πως αντιδρούν οι μπάλες σε διάφορες στεκιές κλπ.",
        details:
          "Τον σωστό τρόπο που κρατάμε την στέκα, την σωστή στάση σώματος, τον τρόπο εκτέλεσης χτυπημάτων και τις διάφορες παραλλαγές, πως παίζονται οι στεκιές με κολλημένη άσπρη, τα overball, οι στεκιές με γέφυρα, συνδυασμοί, τα jump, preshot routine κ.α. Σπάσιμο σε όλα τα παιχνίδια.",
        points: [
          "Σωστή λαβή και στάση σώματος",
          "Εκτέλεση χτυπημάτων και παραλλαγές",
          "Κολλημένη άσπρη, overball, γέφυρα",
          "Jump shots και preshot routine",
          "Σπάσιμο σε όλα τα παιχνίδια",
        ],
      },
      {
        icon: "♟️",
        title: "Στρατηγική",
        summary:
          "Το πως σκεφτόμαστε και πως αποφασίζουμε την διαδρομή της άσπρης σε κάθε παιχνίδι, το πως βάζουμε προτεραιότητες στις εκάστοτε επιλογές κλπ.",
        details:
          "Πως επιλέγουμε την γωνία για κάθε μπάλα, πως αποφασίζουμε να παίξουμε άμυνα ή επίθεση, ποια safe υπάρχουν και πως τα βελτιώνουμε, πως παίζουμε resafe, τι αλλαγές μπορεί να κάνουμε στο ρυθμό μας ανάλογα τις συνθήκες κ.α.",
        points: [
          "Επιλογή γωνίας για κάθε μπάλα",
          "Άμυνα vs Επίθεση",
          "Safe play και resafe τεχνικές",
          "Προσαρμογή ρυθμού στις συνθήκες",
        ],
      },
      {
        icon: "🧠",
        title: "Ψυχολογία & Συγκέντρωση",
        summary:
          "Τεχνικές συγκέντρωσης, νοοτροπία αυτοβελτίωσης, και στρατηγική ανάπτυξης αγωνιστικής αυτοπεποίθησης.",
        details:
          "Χρήσιμα εργαλεία που μπορείς να εφαρμόσεις κατά τη διάρκεια του αγώνα, προετοιμασία της προηγούμενης ημέρας κ.α. Νοοτροπία αυτοβελτίωσης με έμφαση στην αυτοκριτική. Τεχνικές για διαχείριση των παλμών και του στρες. Στρατηγική ανάπτυξης της αγωνιστικής αυτοπεποίθησης.",
        points: [
          "Τεχνικές συγκέντρωσης κατά τον αγώνα",
          "Προετοιμασία πριν τον αγώνα",
          "Διαχείριση στρες και παλμών",
          "Ανάπτυξη αγωνιστικής αυτοπεποίθησης",
        ],
      },
    ],
    howTitle: "Πως λειτουργούν τα μαθήματα;",
    howSteps: [
      "Το μάθημα ξεκινάει με τον εκπαιδευόμενο να παίζει 15 μπάλες με όποια σειρά θέλει. Κατά τη διάρκεια κρατάω σημειώσεις για το τι κάνει σωστά και τι λάθος.",
      "Στη συνέχεια προχωράμε στις όποιες αλλαγές χρειαστούν προκειμένου να διορθώσουμε τεχνικά λάθη.",
      "Έπειτα μέσω ασκήσεων διαπιστώνουμε ακόμα περισσότερα αδύναμα στοιχεία τα οποία διορθώνουμε μέσω στοχευμένης προπόνησης και διόρθωση ή βελτίωση της τεχνικής.",
      "Εφόσον έχουμε θέσει τα θεμέλια και έχουμε φτάσει ένα ικανοποιητικό επίπεδο τεχνικά, μαθαίνουμε νέα εργαλεία για πιο εξειδικευμένες στεκιές.",
    ],
    howGoal:
      "Στο τέλος των μαθημάτων ο στόχος είναι ο εκπαιδευόμενος να έχει διορθώσει όλα τα τεχνικά του λάθη και να έχει μάθει καινούρια χτυπήματα τα οποία θα καλλιεργήσει μέσω της σωστής προπόνησης και θα έχει μία νέα γκάμα επιλογών και εργαλείων που θα τον βοηθήσουν να αναπτύξει το παιχνίδι του πολύ πιο γρήγορα.",
    cta: "Αν θες να φτάσεις το παιχνίδι σου στο επόμενο επίπεδο, στείλε μου μήνυμα.",
    ctaButton: "Επικοινωνία",
  },
  en: {
    subtitle: "Billiards Lessons",
    title: "Lessons",
    intro: "Billiards is divided into 3 categories.",
    sections: [
      {
        icon: "🎯",
        title: "Technique",
        summary:
          "Technique has to do with the way we strike the ball, how balls react to various shots, and more.",
        details:
          "The correct way to hold the cue, the correct body stance, the method of executing shots and their various variations, how to play shots with the cue ball frozen, overballs, bridge shots, combinations, jump shots, pre-shot routine, and more. Breaking in all game types.",
        points: [
          "Correct grip and body stance",
          "Shot execution and variations",
          "Frozen cue ball, overball, bridge shots",
          "Jump shots and pre-shot routine",
          "Breaking in all game types",
        ],
      },
      {
        icon: "♟️",
        title: "Strategy",
        summary:
          "How we think and decide the path of the cue ball in each game, how we prioritize the available choices, and more.",
        details:
          "How we select the angle for each ball, how we decide to play defense or offense, what safeties exist and how we improve them, how we play re-safes, what changes we can make to our rhythm depending on conditions, and more.",
        points: [
          "Selecting the angle for each ball",
          "Defense vs Offense decisions",
          "Safe play and re-safe techniques",
          "Adapting rhythm to conditions",
        ],
      },
      {
        icon: "🧠",
        title: "Psychology & Concentration",
        summary:
          "Concentration techniques, a self-improvement mindset, and a strategy for developing competitive self-confidence.",
        details:
          "Useful tools you can apply during a match, preparation the day before, and more. A self-improvement mindset with emphasis on self-criticism. Techniques for managing heart rate and stress. A strategy for developing competitive self-confidence.",
        points: [
          "Concentration techniques during matches",
          "Pre-match preparation",
          "Managing stress and heart rate",
          "Developing competitive self-confidence",
        ],
      },
    ],
    howTitle: "How do the lessons work?",
    howSteps: [
      "The lesson begins with the student playing 15 balls in any order they choose. During this time, I take notes on what they are doing correctly and what they are doing wrong.",
      "Then we proceed to whatever changes are needed in order to correct technical errors.",
      "Next, through exercises we identify even more weak points, which we correct through targeted training and correction or improvement of technique.",
      "Once we have laid the foundations and reached a satisfactory level technically, we learn new tools for more specialized shots.",
    ],
    howGoal:
      "At the end of the lessons, the goal is for the student to have corrected all their technical errors and to have learned new shots that they will cultivate through proper training, with a new range of choices and tools that will help them develop their game much faster.",
    cta: "If you want to take your game to the next level, send me a message.",
    ctaButton: "Get in Touch",
  },
};

export default function LessonsPage() {
  const [lang, setLang] = useState<"el" | "en">("en");
  const t = content[lang];

  return (
    <div className="bg-navy min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(135,10,10,0.06)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">
            {t.subtitle}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream mb-6">
            {t.title}
          </h1>
          <p className="text-cream/50 text-lg mb-8">{t.intro}</p>

          {/* Language Toggle */}
          <div className="inline-flex rounded-lg border border-gold/20 overflow-hidden">
            <button
              onClick={() => setLang("en")}
              className={`px-5 py-2 text-sm uppercase tracking-wider transition-colors ${
                lang === "en"
                  ? "bg-gold text-navy font-semibold"
                  : "text-cream/60 hover:text-cream"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang("el")}
              className={`px-5 py-2 text-sm uppercase tracking-wider transition-colors ${
                lang === "el"
                  ? "bg-gold text-navy font-semibold"
                  : "text-cream/60 hover:text-cream"
              }`}
            >
              Ελληνικά
            </button>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.sections.map((section, i) => (
            <div
              key={i}
              className="bg-navy-light border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors"
            >
              <div className="text-4xl mb-4">{section.icon}</div>
              <h2 className="font-heading text-2xl text-cream mb-4">
                {section.title}
              </h2>
              <p className="text-cream/60 mb-6 leading-relaxed">
                {section.summary}
              </p>
              <p className="text-cream/50 text-sm mb-6 leading-relaxed">
                {section.details}
              </p>
              <ul className="space-y-2">
                {section.points.map((point, j) => (
                  <li
                    key={j}
                    className="text-cream/70 text-sm flex items-start gap-2"
                  >
                    <span className="text-gold mt-1 flex-shrink-0">&#9656;</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How Lessons Work */}
      <section className="bg-navy-light py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-heading text-3xl text-cream mb-10 text-center">
            {t.howTitle}
          </h2>
          <div className="space-y-6">
            {t.howSteps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <span className="text-gold font-heading text-sm">
                    {i + 1}
                  </span>
                </div>
                <p className="text-cream/70 leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 p-6 border border-gold/10 rounded-lg">
            <p className="text-cream/60 leading-relaxed">{t.howGoal}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-cream/60 text-lg mb-8">{t.cta}</p>
          <Link
            href="https://instagram.com/komninakis.m"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
          >
            {t.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  );
}
