import { NextResponse } from "next/server";
import { seedDatabase } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await seedDatabase();
    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Seed error" }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
