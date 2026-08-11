import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "الاسم والبريد الإلكتروني وكلمة المرور مطلوبة" }, { status: 400 });
    }

    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "البريد الإلكتروني مسجل بالفعل" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [created] = await db
      .insert(users)
      .values({
        name,
        email: email.toLowerCase().trim(),
        passwordHash: hashedPassword,
        role: "user",
        phone: phone || null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      user: {
        id: created.id,
        name: created.name,
        email: created.email,
        role: created.role,
        phone: created.phone,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
