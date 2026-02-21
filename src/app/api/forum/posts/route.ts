import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { requireMember } from "@/lib/auth/requireMember";
import { isValidCategory } from "@/lib/forumCategories";

export async function GET(request: NextRequest) {
  const user = await requireMember();
  if (!user) {
    return NextResponse.json(
      { error: "Membership required" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 20;
  const skip = (page - 1) * limit;

  const prisma = await getPrisma();

  const where = category ? { categorySlug: category } : {};

  const [posts, total] = await Promise.all([
    prisma.forumPost.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.forumPost.count({ where }),
  ]);

  return NextResponse.json({
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  const user = await requireMember();
  if (!user) {
    return NextResponse.json(
      { error: "Membership required" },
      { status: 403 },
    );
  }

  const { categorySlug, title, content, videoUrl } = await request.json();

  if (!categorySlug || !isValidCategory(categorySlug)) {
    return NextResponse.json(
      { error: "Invalid category" },
      { status: 400 },
    );
  }

  if (!title || !title.trim()) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 },
    );
  }

  if (!content || !content.trim()) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 },
    );
  }

  const prisma = await getPrisma();

  const post = await prisma.forumPost.create({
    data: {
      userId: user.id,
      categorySlug,
      title: title.trim(),
      content: content.trim(),
      videoUrl: typeof videoUrl === "string" ? videoUrl.trim() : "",
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
