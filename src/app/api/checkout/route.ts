import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

interface CartItem {
  name: string;
  price: number;
  currency: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 },
    );
  }

  const stripe = new Stripe(secretKey);

  try {
    const { items } = (await request.json()) as { items: CartItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 },
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Link checkout to Stripe Customer if user is logged in
    const user = await getCurrentUser();
    const customerParams: { customer?: string; customer_creation?: "always" } =
      user?.stripeCustomerId
        ? { customer: user.stripeCustomerId }
        : { customer_creation: "always" };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ...customerParams,
      line_items: items.map((item) => ({
        price_data: {
          currency: (item.currency || "EUR").toLowerCase(),
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
