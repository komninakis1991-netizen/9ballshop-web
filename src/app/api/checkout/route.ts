import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

interface CartItem {
  name: string;
  price: number;
  currency: string;
  quantity: number;
}

interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

function calculateShipping(postalCode: string): number {
  const trimmed = postalCode.trim();
  if (trimmed.length === 5 && trimmed.startsWith("1")) {
    return 4; // Athens/Attica
  }
  return 12; // Rest of Greece
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
    const { items, shippingAddress, shippingCost } = (await request.json()) as {
      items: CartItem[];
      shippingAddress?: ShippingAddress;
      shippingCost?: number;
    };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 },
      );
    }

    if (!shippingAddress || !shippingAddress.postalCode) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 },
      );
    }

    // Validate shipping cost server-side to prevent tampering
    const validatedShippingCost = calculateShipping(shippingAddress.postalCode);
    if (shippingCost !== undefined && shippingCost !== validatedShippingCost) {
      return NextResponse.json(
        { error: "Invalid shipping cost" },
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

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item) => ({
        price_data: {
          currency: (item.currency || "EUR").toLowerCase(),
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }),
    );

    // Add shipping as a line item
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Shipping",
        },
        unit_amount: validatedShippingCost * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ...customerParams,
      line_items: lineItems,
      metadata: {
        user_id: user?.id?.toString() || "",
        customer_email: user?.email || "",
        shipping_name: shippingAddress.name,
        shipping_phone: shippingAddress.phone,
        shipping_street: shippingAddress.street,
        shipping_city: shippingAddress.city,
        shipping_postal_code: shippingAddress.postalCode,
        shipping_country: shippingAddress.country,
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
