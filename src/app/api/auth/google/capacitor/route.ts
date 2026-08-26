import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { verifyGoogleIdToken } from "@/lib/google-verify";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { idToken?: string } = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { idToken } = body;

  if (!idToken || typeof idToken !== "string") {
    return NextResponse.json(
      { success: false, error: "Missing idToken." },
      { status: 400 }
    );
  }

  const audience = process.env.GOOGLE_CLIENT_ID;

  if (!audience) {
    return NextResponse.json(
      { success: false, error: "Google login is not configured." },
      { status: 503 }
    );
  }

  const payload = await verifyGoogleIdToken(idToken, audience);

  if (!payload || !payload.email || payload.email_verified === false) {
    return NextResponse.json(
      { success: false, error: "Invalid Google token." },
      { status: 401 }
    );
  }

  const email = payload.email.toLowerCase();
  const name = (payload.name || email.split("@")[0]).slice(0, 80);

  try {
    const existing = await db
      .select({
        id: users.id,
        role: users.role,
        tokenVersion: users.tokenVersion,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let userId: number;
    let role: string;
    let tokenVersion: number;

    if (existing.length > 0) {
      userId = existing[0].id;
      role = existing[0].role;
      tokenVersion = existing[0].tokenVersion;
    } else {
      const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
      role = adminEmail && email === adminEmail ? "admin" : "user";

      const placeholderHash = "google-oauth:" + crypto.randomUUID();

      const [created] = await db
        .insert(users)
        .values({
          name,
          email,
          passwordHash: placeholderHash,
          role,
          phone: null,
        })
        .returning();

      userId = created.id;
      tokenVersion = created.tokenVersion;
    }

    const token = createSessionToken({ id: userId, role, tokenVersion });

    const response = NextResponse.json({ success: true });
    response.cookies.set(
      SESSION_COOKIE_NAME,
      token,
      getSessionCookieOptions()
    );
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error during login." },
      { status: 500 }
    );
  }
}
