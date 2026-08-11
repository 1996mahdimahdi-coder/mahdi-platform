import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { seedDatabase } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let posts = await db.select().from(blogPosts);
    if (posts.length === 0) {
      await seedDatabase();
      posts = await db.select().from(blogPosts);
    }
    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
