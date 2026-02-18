import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Marios Komninakis | Pool Player, Coach & Billiards Entrepreneur | 9BallShop",
  description:
    "Meet Marios Komninakis — Greek national youth pool champion, European Championship competitor, billiards coach with 100+ students, and founder of 9BallShop. Discover his journey through pool tournaments across 20+ countries.",
  keywords: [
    "Marios Komninakis",
    "pool player",
    "billiards",
    "9ball",
    "9 ball",
    "pool tournaments",
    "billiards coach",
    "Greek pool champion",
    "European Championship pool",
    "Euro Tour billiards",
    "pool coaching",
    "cue sports",
    "billiards equipment",
    "pool hall",
    "8 ball",
    "straight pool",
    "9BallShop",
  ],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
