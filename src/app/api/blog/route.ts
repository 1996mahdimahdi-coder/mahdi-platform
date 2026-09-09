import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // F12-4 — minimal projection: the list consumers (RSC blog index) render
    // only these fields; full `content`/`sources`/`financialData` blobs no
    // longer travel on the list endpoint. No pagination added (list semantics
    // unchanged).
    const projection = {
      id: blogPosts.id,
      slug: blogPosts.slug,
      title: blogPosts.title,
      summary: blogPosts.summary,
      category: blogPosts.category,
      image: blogPosts.image,
    };

    let posts = await db.select(projection).from(blogPosts);
    if (posts.length === 0) {
      // Automatic database seeding is disabled in request handlers.
      posts = await db.select(projection).from(blogPosts);
    }
    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." }, { status: 500 });
  }
}
