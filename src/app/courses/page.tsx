import type { Metadata } from "next";
import { COURSES, publicCourse } from "@/lib/courses";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { purchasedSlugs } from "@/lib/coursePurchases";
import CoursesContent from "./CoursesContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Online Pool Courses",
  description:
    "Online pool and 9-ball video courses by coach Marios Komninakis: beginner fundamentals, mental training, breaking, safety play and more.",
  alternates: { canonical: "/courses" },
  openGraph: { url: "/courses", title: "Online Pool Courses" },
};

export default async function CoursesPage() {
  const user = await getCurrentUser();
  let owned: string[] = [];
  if (user) {
    try {
      owned = await purchasedSlugs(user.id);
    } catch {
      owned = [];
    }
  }
  return <CoursesContent courses={COURSES.map(publicCourse)} owned={owned} />;
}
