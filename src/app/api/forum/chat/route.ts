import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { requireMember } from "@/lib/auth/requireMember";

export async function GET(request: NextRequest) {
  const user = await requireMember();
  if (!user) {
    return NextResponse.json(
      { error: "Membership required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(request.url);
  const after = searchParams.get("after");
  const prisma = await getPrisma();

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const timeFilter = user.isAdmin ? {} : { createdAt: { gte: oneHourAgo } };

  if (after) {
    const afterId = parseInt(after, 10);
    if (isNaN(afterId)) {
      return NextResponse.json({ error: "Invalid after param" }, { status: 400 });
    }
    const messages = await prisma.chatMessage.findMany({
      where: { id: { gt: afterId }, ...timeFilter },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ messages });
  }

  const messages = await prisma.chatMessage.findMany({
    where: timeFilter,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { id: "desc" },
    take: 50,
  });

  return NextResponse.json({ messages: messages.reverse() });
}

export async function POST(request: NextRequest) {
  const user = await requireMember();
  if (!user) {
    return NextResponse.json(
      { error: "Membership required" },
      { status: 403 },
    );
  }

  const { content } = await request.json();

  if (!content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 },
    );
  }

  if (content.length > 500) {
    return NextResponse.json(
      { error: "Message too long (max 500 characters)" },
      { status: 400 },
    );
  }

  const prisma = await getPrisma();

  const message = await prisma.chatMessage.create({
    data: {
      userId: user.id,
      content: content.trim(),
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
