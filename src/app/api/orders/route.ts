import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id is required" },
      { status: 400 },
    );
  }

  const prisma = await getPrisma();
  const order = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
  });

  if (!order) {
    return NextResponse.json({ order: null });
  }

  return NextResponse.json({
    order: {
      id: order.id,
      status: order.status,
      items: JSON.parse(order.items),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      shippingName: order.shippingName,
      shippingStreet: order.shippingStreet,
      shippingCity: order.shippingCity,
      shippingPostalCode: order.shippingPostalCode,
      shippingCountry: order.shippingCountry,
      customerEmail: order.customerEmail,
      createdAt: order.createdAt,
    },
  });
}
