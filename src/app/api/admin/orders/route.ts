import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { sendOrderShippedEmail } from "@/lib/email";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    return null;
  }
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const prisma = await getPrisma();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true, name: true } } },
  });

  return NextResponse.json({
    orders: orders.map((order) => ({
      id: order.id,
      status: order.status,
      items: JSON.parse(order.items),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      customerEmail: order.customerEmail,
      shippingName: order.shippingName,
      shippingPhone: order.shippingPhone,
      shippingStreet: order.shippingStreet,
      shippingCity: order.shippingCity,
      shippingPostalCode: order.shippingPostalCode,
      shippingCountry: order.shippingCountry,
      userName: order.user?.name || "",
      userEmail: order.user?.email || "",
      createdAt: order.createdAt,
    })),
  });
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { orderId, status } = (await request.json()) as {
    orderId: number;
    status: string;
  };

  const validStatuses = ["paid", "processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const prisma = await getPrisma();
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  // Send shipped notification email
  if (status === "shipped" && order.customerEmail) {
    await sendOrderShippedEmail(
      order.customerEmail,
      order.shippingName,
      order.id,
    );
  }

  return NextResponse.json({ success: true });
}
