import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourse, publicCourse } from "@/lib/courses";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getStripe, grantFromCheckoutSession, hasPurchased } from "@/lib/coursePurchases";
import CourseContent from "./CourseContent";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string; canceled?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return {
    title: course.title.en,
    description: course.description.en,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: { url: `/courses/${course.slug}`, title: course.title.en, description: course.tagline.en },
  };
}

export default async function CoursePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { session_id, canceled } = await searchParams;
  const course = getCourse(slug);
  if (!course) notFound();

  const user = await getCurrentUser();
  let owned = false;
  let notice: "thanks" | "pending" | "canceled" | null = canceled ? "canceled" : null;

  if (user) {
    // Coming back from Stripe: confirm the payment right away instead of waiting for the webhook.
    if (session_id && session_id.startsWith("cs_")) {
      const stripe = getStripe();
      if (stripe) {
        try {
          const session = await stripe.checkout.sessions.retrieve(session_id);
          const belongsToUser =
            session.metadata?.user_id === String(user.id) && session.metadata?.course_slug === course.slug;
          if (belongsToUser) {
            const granted = await grantFromCheckoutSession(session);
            notice = granted ? "thanks" : "pending";
          }
        } catch {
          notice = "pending";
        }
      }
    }
    try {
      owned = user.isAdmin || (await hasPurchased(user.id, course.slug));
    } catch {
      owned = false;
    }
    if (owned && notice === "pending") notice = "thanks";
  }

  // Video IDs only leave the server for people who own the course.
  return <CourseContent course={owned ? course : publicCourse(course)} owned={owned} notice={notice} />;
}
