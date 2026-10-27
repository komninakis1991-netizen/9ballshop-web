// Gallery photos. Put image files in /public/gallery and list them here.
// Order here = order on the page.
export interface GalleryImage {
  src: string; // e.g. "/gallery/argos-open-2025.jpg"
  width: number;
  height: number;
  alt: string; // English description (also used for SEO)
  altEl?: string; // Greek description (optional)
  caption?: string;
  captionEl?: string;
}

export const GALLERY_IMAGES: GalleryImage[] = [
  { src: "/gallery/aiming-closeup.webp", width: 860, height: 860, alt: "Marios Komninakis lining up a shot", altEl: "Ο Μάριος Κομνηνάκης σημαδεύει", caption: "Down on the shot", captionEl: "Στη βολή" },
  { src: "/gallery/italian-open-1.webp", width: 1280, height: 1600, alt: "Marios Komninakis at the Predator Euro Tour Longoni Italian Open", altEl: "Ο Μάριος Κομνηνάκης στο Predator Euro Tour, Longoni Italian Open", caption: "Euro Tour – Italian Open", captionEl: "Euro Tour – Italian Open" },
  { src: "/gallery/italian-open-2.webp", width: 1280, height: 1600, alt: "Marios Komninakis chalking up at the Euro Tour Italian Open", altEl: "Ο Μάριος Κομνηνάκης στο Euro Tour Italian Open", caption: "Euro Tour – Italian Open", captionEl: "Euro Tour – Italian Open" },
  { src: "/gallery/european-open-last-64.webp", width: 1280, height: 720, alt: "European Open Championship last 64 match card, Komninakis vs Kaci", altEl: "Κάρτα αγώνα European Open, τελευταίοι 64, Κομνηνάκης – Kaci", caption: "European Open – Last 64", captionEl: "European Open – Τελευταίοι 64" },
  { src: "/gallery/open-trophy.webp", width: 1200, height: 1600, alt: "Marios Komninakis holding a first-place trophy", altEl: "Ο Μάριος Κομνηνάκης με το τρόπαιο της 1ης θέσης", caption: "1st place", captionEl: "1η θέση" },
  { src: "/gallery/award-handshake.webp", width: 1065, height: 1600, alt: "Marios Komninakis receiving an award", altEl: "Ο Μάριος Κομνηνάκης στην απονομή", caption: "Award ceremony", captionEl: "Απονομή" },
  { src: "/gallery/cuetube-interview.webp", width: 1080, height: 1440, alt: "Marios Komninakis at a CueTube / Cueniversity interview", altEl: "Ο Μάριος Κομνηνάκης σε συνέντευξη CueTube / Cueniversity", caption: "Post-match interview", captionEl: "Συνέντευξη μετά τον αγώνα" },
  { src: "/gallery/bucharest-match.webp", width: 1080, height: 1152, alt: "Marios Komninakis playing a tournament match in Bucharest", altEl: "Ο Μάριος Κομνηνάκης σε αγώνα τουρνουά στο Βουκουρέστι", caption: "Bucharest", captionEl: "Βουκουρέστι" },
  { src: "/gallery/match-breakdown.webp", width: 607, height: 818, alt: "Shot breakdown from Komninakis vs Filler", altEl: "Ανάλυση βολής από τον αγώνα Κομνηνάκης – Filler", caption: "Match breakdown vs Filler", captionEl: "Ανάλυση αγώνα vs Filler" },
  { src: "/gallery/think-like-a-pro.webp", width: 1280, height: 720, alt: "Learn to think like a pro – In Marios' mind", altEl: "Μάθε να σκέφτεσαι σαν επαγγελματίας – Στο μυαλό του Μάριου", caption: "In Marios' mind", captionEl: "Στο μυαλό του Μάριου" },
  { src: "/gallery/lesson-stance.webp", width: 607, height: 1080, alt: "Lesson: setting up the stance", altEl: "Μάθημα: πώς στήνουμε τη στάση", caption: "Lesson – stance", captionEl: "Μάθημα – στάση" },
  { src: "/gallery/lesson-pre-shot.webp", width: 607, height: 1080, alt: "Lesson: the pre-shot routine during practice strokes", altEl: "Μάθημα: τι ελέγχουμε στα λιμάζ", caption: "Lesson – pre-shot routine", captionEl: "Μάθημα – λιμάζ" },
  { src: "/gallery/lesson-9ball-rules.webp", width: 606, height: 1080, alt: "Lesson: the rules of 9-ball", altEl: "Μάθημα: οι κανόνες στο 9μπαλο", caption: "Lesson – 9-ball rules", captionEl: "Μάθημα – κανόνες 9μπαλου" },
  { src: "/gallery/lesson-position-play.webp", width: 607, height: 700, alt: "Lesson: how to choose your position play", altEl: "Μάθημα: πώς επιλέγεις τα πλασαρίσματα", caption: "Lesson – position play", captionEl: "Μάθημα – πλασαρίσματα" },
  { src: "/gallery/bucharest-2023.webp", width: 1080, height: 1068, alt: "Marios Komninakis in Bucharest, 2023", altEl: "Ο Μάριος Κομνηνάκης στο Βουκουρέστι, 2023", caption: "Bucharest, 2023", captionEl: "Βουκουρέστι, 2023" },
  { src: "/gallery/bucharest-2014.webp", width: 1080, height: 1068, alt: "Marios Komninakis in 2014", altEl: "Ο Μάριος Κομνηνάκης το 2014", caption: "2014", captionEl: "2014" },
  { src: "/gallery/sparta-podium.webp", width: 1080, height: 1337, alt: "Young Marios Komninakis on the top step of the podium in Sparta", altEl: "Ο νεαρός Μάριος Κομνηνάκης στο ψηλότερο σκαλί του βάθρου στη Σπάρτη", caption: "Sparta – first place", captionEl: "Σπάρτη – 1η θέση" },
  { src: "/gallery/masters-2013.webp", width: 720, height: 518, alt: "Marios Komninakis with a trophy at Master's, June 2013", altEl: "Ο Μάριος Κομνηνάκης με τρόπαιο στο Master's, Ιούνιος 2013", caption: "Master's, 2013", captionEl: "Master's, 2013" },
  { src: "/gallery/early-days.webp", width: 531, height: 531, alt: "Teenage Marios Komninakis playing pool", altEl: "Ο Μάριος Κομνηνάκης έφηβος στο μπιλιάρδο", caption: "Where it started", captionEl: "Εκεί που ξεκίνησαν όλα" },
];
