import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let posts = await db.select().from(blogPosts);
    if (posts.length === 0) {
      // Automatic database seeding is disabled in request handlers.
      posts = await db.select().from(blogPosts);
    }
    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
