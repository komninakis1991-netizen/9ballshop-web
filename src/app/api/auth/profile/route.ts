import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPrisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      addressStreet?: string;
      addressCity?: string;
      addressPostalCode?: string;
      addressCountry?: string;
    };

    const prisma = await getPrisma();
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name ?? user.name,
        phone: body.phone ?? user.phone,
        addressStreet: body.addressStreet ?? user.addressStreet,
        addressCity: body.addressCity ?? user.addressCity,
        addressPostalCode: body.addressPostalCode ?? user.addressPostalCode,
        addressCountry: body.addressCountry ?? user.addressCountry,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        addressStreet: true,
        addressCity: true,
        addressPostalCode: true,
        addressCountry: true,
        stripeCustomerId: true,
        createdAt: true,
      },
    });

    // Sync changes to Stripe Customer
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (secretKey && updated.stripeCustomerId) {
      const stripe = new Stripe(secretKey);
      await stripe.customers.update(updated.stripeCustomerId, {
        name: updated.name || undefined,
        phone: updated.phone || undefined,
        address: {
          line1: updated.addressStreet || undefined,
          city: updated.addressCity || undefined,
          postal_code: updated.addressPostalCode || undefined,
          country: updated.addressCountry || undefined,
        },
      });
    }

    return NextResponse.json({ user: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
