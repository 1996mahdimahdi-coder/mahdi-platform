import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  getSession,
  PRIVATE_NO_STORE_HEADERS,
  unauthorizedResponse,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        phone: users.phone,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return unauthorizedResponse();
    }

    return NextResponse.json(
      { success: true, user },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("Session user error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627.",
      },
      {
        status: 500,
        headers: PRIVATE_NO_STORE_HEADERS,
      }
    );
  }
}
