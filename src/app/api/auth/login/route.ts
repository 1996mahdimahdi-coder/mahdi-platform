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
    return NextResponse.json({ success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." }, { status: 500 });
  }
}
