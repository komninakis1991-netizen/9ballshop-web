import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

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
  const bookings = await prisma.discoveryBooking.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookings });
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { bookingId, status } = (await request.json()) as {
    bookingId: number;
    status: string;
  };

  const validStatuses = ["pending", "confirmed", "completed", "no-show", "cancelled"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const prisma = await getPrisma();
  await prisma.discoveryBooking.update({
    where: { id: bookingId },
    data: { status },
  });

  return NextResponse.json({ success: true });
}
