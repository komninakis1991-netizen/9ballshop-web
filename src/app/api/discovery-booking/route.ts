import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import {
  sendDiscoveryBookingEmail,
  sendDiscoveryBookingConfirmationEmail,
  sendTelegramNotification,
} from "@/lib/notifications";

export async function GET() {
  const prisma = await getPrisma();

  const bookings = await prisma.discoveryBooking.findMany({
    where: {
      status: { not: "cancelled" },
    },
    select: { date: true, time: true },
  });

  return NextResponse.json({
    bookedSlots: bookings.map((b) => ({ date: b.date, time: b.time })),
  });
}

export async function POST(request: NextRequest) {
  const { name, email, date, time, locale } = await request.json();

  if (!date || !time) {
    return NextResponse.json(
      { error: "Date and time are required" },
      { status: 400 },
    );
  }

  const prisma = await getPrisma();

  // Check for existing booking at the same date and time
  const existing = await prisma.discoveryBooking.findFirst({
    where: {
      date: String(date),
      time: String(time),
      status: { not: "cancelled" },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "This time slot is already booked" },
      { status: 409 },
    );
  }

  const sanitizedEmail = typeof email === "string" ? email.trim() : "";

  await prisma.discoveryBooking.create({
    data: {
      name: typeof name === "string" ? name.trim() : "",
      email: sanitizedEmail,
      date: String(date),
      time: String(time),
      locale: typeof locale === "string" ? locale : "en",
      status: "pending",
    },
  });

  const displayName = name?.trim() || "Anonymous";
  const telegramMessage =
    `🎱 <b>New Discovery Call Booking</b>\n\n` +
    `<b>Name:</b> ${displayName}\n` +
    `<b>Email:</b> ${sanitizedEmail || "Not provided"}\n` +
    `<b>Date:</b> ${date}\n` +
    `<b>Time:</b> ${time}`;

  const notifications: Promise<void>[] = [
    sendDiscoveryBookingEmail(displayName, String(date), String(time)),
    sendTelegramNotification(telegramMessage),
  ];

  if (sanitizedEmail) {
    notifications.push(
      sendDiscoveryBookingConfirmationEmail(
        sanitizedEmail,
        displayName,
        String(date),
        String(time),
        typeof locale === "string" ? locale : "en",
      ),
    );
  }

  Promise.allSettled(notifications);

  return NextResponse.json({ success: true });
}
