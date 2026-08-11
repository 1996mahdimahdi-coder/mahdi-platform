import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const postRows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);

    if (postRows.length === 0) {
      return NextResponse.json({ success: false, error: "المقال غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: postRows[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
