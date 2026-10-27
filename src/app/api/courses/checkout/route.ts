import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getCourse, isForSale } from "@/lib/courses";
import { getStripe, hasPurchased } from "@/lib/coursePurchases";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let slug = "";
  let locale = "en";
  try {
    const body = await request.json();
    slug = String(body.slug || "");
    locale = body.locale === "el" ? "el" : "en";
  } catch {
    // fall through to validation
  }

  const course = getCourse(slug);
  if (!course || !isForSale(course)) {
    return NextResponse.json({ error: "Course not available" }, { status: 404 });
  }

  if (await hasPurchased(user.id, course.slug)) {
    return NextResponse.json({ alreadyOwned: true, url: `/courses/${course.slug}` });
  }

  const origin = request.headers.get("origin") || "https://9ballshop.com";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ...(user.stripeCustomerId
        ? { customer: user.stripeCustomerId }
        : { customer_email: user.email, customer_creation: "always" as const }),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(course.priceEur * 100),
            product_data: {
              name: course.title.en,
              description: course.tagline.en,
            },
          },
        },
      ],
      allow_promotion_codes: true,
      locale: locale === "el" ? "el" : "en",
      metadata: {
        type: "course",
        course_slug: course.slug,
        user_id: String(user.id),
      },
      payment_intent_data: {
        metadata: { type: "course", course_slug: course.slug, user_id: String(user.id) },
      },
      success_url: `${origin}/courses/${course.slug}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/courses/${course.slug}?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
