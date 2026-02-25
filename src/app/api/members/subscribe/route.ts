import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

function resolvePromoCoupon(code: string): string | null {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;

  const promoFree = (process.env.PROMO_CODE_FREE || "").toUpperCase();
  const promo50 = (process.env.PROMO_CODE_50 || "").toUpperCase();
  const promo25 = (process.env.PROMO_CODE_25 || "").toUpperCase();

  if (promoFree && normalized === promoFree) return process.env.PROMO_COUPON_FREE || null;
  if (promo50 && normalized === promo50) return process.env.PROMO_COUPON_50 || null;
  if (promo25 && normalized === promo25) return process.env.PROMO_COUPON_25 || null;

  return null;
}

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 },
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }

  if (user.membershipStatus === "active") {
    return NextResponse.json(
      { error: "Already an active member" },
      { status: 400 },
    );
  }

  let promoCode = "";
  try {
    const body = await request.json();
    promoCode = body.promoCode || "";
  } catch {
    // no body — that's fine
  }

  // Fall back to user's stored promo code
  if (!promoCode && user.promoCode) {
    promoCode = user.promoCode;
  }

  // Check for forever-free promo code — activate directly, no Stripe
  const foreverCode = (process.env.PROMO_CODE_FOREVER || "").toUpperCase();
  if (foreverCode && promoCode.trim().toUpperCase() === foreverCode) {
    const { getPrisma } = await import("@/lib/prisma");
    const prisma = await getPrisma();
    await prisma.user.update({
      where: { id: user.id },
      data: { membershipStatus: "active", promoCode: promoCode.trim() },
    });
    const origin = request.headers.get("origin") || "http://localhost:3000";
    return NextResponse.json({ url: `${origin}/members/forum?subscribed=true` });
  }

  const couponId = promoCode ? resolvePromoCoupon(promoCode) : null;

  const stripe = new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });
  const origin = request.headers.get("origin") || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      ...(user.stripeCustomerId
        ? { customer: user.stripeCustomerId }
        : { customer_email: user.email }),
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "9BallShop Members Forum — Monthly",
            },
            unit_amount: 1197,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      ...(couponId ? { discounts: [{ coupon: couponId }] } : {}),
      metadata: {
        user_id: user.id.toString(),
        type: "membership",
      },
      success_url: `${origin}/members/forum?subscribed=true`,
      cancel_url: `${origin}/members`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
