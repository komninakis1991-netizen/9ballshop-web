/**
 * Course catalogue.
 *
 * To sell a course, give it a price (`priceEur`) and fill in every lesson's `videoId`.
 * Until both are done the course shows as "Coming soon" and cannot be bought.
 *
 * Videos: upload each lesson to YouTube as **Unlisted** and paste the video ID
 * (the part after `watch?v=`) into `videoId`. Video IDs are only ever sent to the
 * browser of someone who has bought the course.
 */

export type Text = { en: string; el: string };

export type CourseLesson = {
  title: Text;
  /** YouTube video ID of the unlisted video, e.g. "dQw4w9WgXcQ". Empty = not uploaded yet. */
  videoId: string;
};

export type Course = {
  slug: string;
  title: Text;
  tagline: Text;
  description: Text;
  /** Price in euros. null = not on sale yet ("Coming soon"). */
  priceEur: number | null;
  level: Text;
  /** Ball colour used as the course badge. */
  ball: "ball-1" | "ball-2" | "ball-3" | "gold" | "emerald";
  ballNumber: number;
  lessons: CourseLesson[];
};

const moduleLessons = (count: number): CourseLesson[] =>
  Array.from({ length: count }, (_, i) => ({
    title: { en: `Module ${i + 1}`, el: `Ενότητα ${i + 1}` },
    videoId: "",
  }));

export const COURSES: Course[] = [
  {
    slug: "beginner-course",
    title: { en: "Beginner Pool Course", el: "Μπιλιάρδο για Αρχάριους" },
    tagline: {
      en: "Build the fundamentals the right way, from day one.",
      el: "Χτίσε σωστά τις βάσεις από την πρώτη μέρα.",
    },
    description: {
      en: "An 8-module video course with drills for every module: grip, stance, bridge, stroke, aiming, cue ball control and how to practise on your own.",
      el: "Βιντεοσκοπημένο πρόγραμμα 8 ενοτήτων με ασκήσεις σε κάθε ενότητα: κράτημα, στάση, γέφυρα, χτύπημα, σημάδι, έλεγχος άσπρης και πώς να προπονείσαι μόνος σου.",
    },
    priceEur: 50,
    level: { en: "Beginner", el: "Αρχάριοι" },
    ball: "ball-1",
    ballNumber: 1,
    lessons: moduleLessons(8),
  },
  {
    slug: "mental-training",
    title: { en: "Mental Training for Pool", el: "Ψυχολογική Προετοιμασία στο Μπιλιάρδο" },
    tagline: {
      en: "Focus, routine and confidence when the match is on the line.",
      el: "Συγκέντρωση, ρουτίνα και αυτοπεποίθηση όταν κρίνεται ο αγώνας.",
    },
    description: {
      en: "Pre-shot routine, handling pressure, staying focused between racks and building real competitive confidence.",
      el: "Ρουτίνα πριν το χτύπημα, διαχείριση πίεσης, συγκέντρωση ανάμεσα στα racks και πραγματική αγωνιστική αυτοπεποίθηση.",
    },
    priceEur: null,
    level: { en: "All levels", el: "Όλα τα επίπεδα" },
    ball: "ball-3",
    ballNumber: 3,
    lessons: [],
  },
  {
    slug: "breaking",
    title: { en: "Breaking", el: "Το Σπάσιμο" },
    tagline: {
      en: "A consistent, powerful break you can trust.",
      el: "Σταθερό και δυνατό σπάσιμο που μπορείς να εμπιστευτείς.",
    },
    description: {
      en: "Break mechanics, cue ball control on the break and adjusting to different racks and conditions.",
      el: "Μηχανική του σπασίματος, έλεγχος άσπρης στο σπάσιμο και προσαρμογή σε διαφορετικά racks και συνθήκες.",
    },
    priceEur: null,
    level: { en: "Intermediate", el: "Μεσαίο επίπεδο" },
    ball: "ball-2",
    ballNumber: 2,
    lessons: [],
  },
  {
    slug: "safety-play",
    title: { en: "Safety Play", el: "Άμυνα" },
    tagline: {
      en: "Win the tactical battle, not just the shot.",
      el: "Κέρδισε την τακτική μάχη, όχι μόνο το χτύπημα.",
    },
    description: {
      en: "The safeties that win matches, when to play them and how to answer your opponent's.",
      el: "Οι άμυνες που κερδίζουν αγώνες, πότε να τις παίζεις και πώς να απαντάς στις άμυνες του αντιπάλου.",
    },
    priceEur: null,
    level: { en: "Intermediate", el: "Μεσαίο επίπεδο" },
    ball: "emerald",
    ballNumber: 6,
    lessons: [],
  },
  {
    slug: "stance-and-mechanics",
    title: { en: "Stance & Mechanics", el: "Στάση & Μηχανική" },
    tagline: {
      en: "Fix the foundation and everything else gets easier.",
      el: "Διόρθωσε τη βάση και όλα τα άλλα γίνονται πιο εύκολα.",
    },
    description: {
      en: "A deep dive into stance, alignment and a repeatable stroke, with drills to check yourself.",
      el: "Σε βάθος ανάλυση στάσης, ευθυγράμμισης και σταθερού χτυπήματος, με ασκήσεις για να ελέγχεις τον εαυτό σου.",
    },
    priceEur: null,
    level: { en: "All levels", el: "Όλα τα επίπεδα" },
    ball: "gold",
    ballNumber: 4,
    lessons: [],
  },
];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

/**
 * A course can be bought only when it has a price AND every lesson has its video,
 * so nobody pays for an empty course.
 */
export function isForSale(course: Course): course is Course & { priceEur: number } {
  return (
    typeof course.priceEur === "number" &&
    course.priceEur > 0 &&
    course.lessons.length > 0 &&
    course.lessons.every((l) => l.videoId.trim() !== "")
  );
}

/** A copy of the course that is safe to send to someone who has not bought it. */
export function publicCourse(course: Course): Course {
  return {
    ...course,
    // Shown as "Coming soon" until the course is complete.
    priceEur: isForSale(course) ? course.priceEur : null,
    lessons: course.lessons.map((l) => ({ title: l.title, videoId: "" })),
  };
}
