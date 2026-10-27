import Stripe from "stripe";
import { getPrisma } from "@/lib/prisma";
import { getCourse } from "@/lib/courses";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { httpClient: Stripe.createFetchHttpClient() });
}

export async function hasPurchased(userId: number, courseSlug: string): Promise<boolean> {
  const prisma = await getPrisma();
  const row = await prisma.coursePurchase.findUnique({
    where: { userId_courseSlug: { userId, courseSlug } },
    select: { id: true },
  });
  return !!row;
}

export async function purchasedSlugs(userId: number): Promise<string[]> {
  const prisma = await getPrisma();
  const rows = await prisma.coursePurchase.findMany({
    where: { userId },
    select: { courseSlug: true },
  });
  return rows.map((r: { courseSlug: string }) => r.courseSlug);
}

/**
 * Records a paid course checkout. Safe to call more than once for the same
 * session (from the webhook and from the success redirect).
 */
export async function grantFromCheckoutSession(session: Stripe.Checkout.Session): Promise<boolean> {
  const meta = session.metadata || {};
  if (meta.type !== "course") return false;
  if (session.payment_status !== "paid") return false;

  const userId = Number(meta.user_id);
  const courseSlug = meta.course_slug || "";
  if (!Number.isInteger(userId) || userId <= 0 || !getCourse(courseSlug)) return false;

  const prisma = await getPrisma();
  const already = await prisma.coursePurchase.findFirst({
    where: { OR: [{ stripeSessionId: session.id }, { userId, courseSlug }] },
    select: { id: true },
  });
  if (already) return true;

  try {
    await prisma.coursePurchase.create({
      data: {
        userId,
        courseSlug,
        stripeSessionId: session.id,
        amount: (session.amount_total ?? 0) / 100,
        currency: (session.currency || "eur").toUpperCase(),
        customerEmail: session.customer_details?.email || "",
      },
    });
  } catch {
    // A parallel call (webhook vs. redirect) may have inserted it first.
  }
  return true;
}
