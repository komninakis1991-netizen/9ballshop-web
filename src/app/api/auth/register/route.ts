import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPrisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { setSessionCookie } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone, promoCode } = (await request.json()) as {
      email?: string;
      password?: string;
      name?: string;
      phone?: string;
      promoCode?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const prisma = await getPrisma();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    // Create Stripe Customer
    let stripeCustomerId = "";
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (secretKey) {
      const stripe = new Stripe(secretKey, {
        httpClient: Stripe.createFetchHttpClient(),
      });
      const customer = await stripe.customers.create({
        email,
        name: name || undefined,
        phone: phone || undefined,
        metadata: { source: "9ballshop-web" },
      });
      stripeCustomerId = customer.id;
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || "",
        phone: phone || "",
        stripeCustomerId,
        promoCode: promoCode || "",
      },
    });

    const token = await createSession(user.id);
    await setSessionCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
