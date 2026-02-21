import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { requireMember } from "@/lib/auth/requireMember";

export async function GET(
  _request: Request,
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

  const prisma = await getPrisma();

  const post = await prisma.forumPost.findUnique({
    where: { id: postId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      comments: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}
