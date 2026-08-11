import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "البريد الإلكتروني وكلمة المرور مطلوبان" }, { status: 400 });
    }

    const userRows = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
    if (userRows.length === 0) {
      return NextResponse.json({ success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    const user = userRows[0];
    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      return NextResponse.json({ success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
