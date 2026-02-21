import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { requireMember } from "@/lib/auth/requireMember";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireMember();
  if (!user) {
    return NextResponse.json(
      { error: "Membership required" },
      { status: 403 },
    );
  }

  const { id } = await params;
  const postId = parseInt(id, 10);
  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  const { content } = await request.json();

  if (!content || !content.trim()) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 },
    );
  }

  const prisma = await getPrisma();

  // Verify the post exists
  const post = await prisma.forumPost.findUnique({
    where: { id: postId },
  });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const comment = await prisma.forumComment.create({
    data: {
      postId,
      userId: user.id,
      content: content.trim(),
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
