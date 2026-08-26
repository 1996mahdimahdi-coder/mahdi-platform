import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { registerDeviceToken, unregisterDeviceToken } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "بيانات غير صالحة" }, { status: 400 });
  }

  const { token, platform } = (body ?? {}) as { token?: string; platform?: string };
  if (!token || typeof token !== "string") {
    return NextResponse.json({ success: false, error: "token مطلوب" }, { status: 400 });
  }

  const result = await registerDeviceToken(session.userId, token, platform ?? "android");
  return NextResponse.json({ success: result.success });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "بيانات غير صالحة" }, { status: 400 });
  }

  const { token } = (body ?? {}) as { token?: string };
  if (!token || typeof token !== "string") {
    return NextResponse.json({ success: false, error: "token مطلوب" }, { status: 400 });
  }

  const result = await unregisterDeviceToken(token);
  return NextResponse.json({ success: result.success });
}
