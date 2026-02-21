import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

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
            unit_amount: 2000,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
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
