import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { csrfGuard } from "@/lib/csrf";
import { registerDeviceToken, unregisterDeviceToken } from "@/lib/push";
import {
  checkRateLimit,
  clientIpKey,
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

async function enforceRateLimits(request: Request, userId: number) {
  const user = await checkRateLimit({
    key: `push:user:${userId}`,
    limit: RATE_LIMITS.pushRegister.user.limit,
    windowSeconds: RATE_LIMITS.pushRegister.user.windowSeconds,
  });
  if (!user.allowed) return rateLimitExceededResponse(user);

  const ip = await checkRateLimit({
    key: clientIpKey(request, "pushRegister"),
    limit: RATE_LIMITS.pushRegister.ip.limit,
    windowSeconds: RATE_LIMITS.pushRegister.ip.windowSeconds,
  });
  if (!ip.allowed) return rateLimitExceededResponse(ip);

  return null;
}

export async function POST(request: Request) {
  const csrfErr = await csrfGuard(request);
  if (csrfErr) return csrfErr;

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  const rateLimitResponse = await enforceRateLimits(request, session.userId);
  if (rateLimitResponse) return rateLimitResponse;

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
  const csrfErr = await csrfGuard(request);
  if (csrfErr) return csrfErr;

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  const rateLimitResponse = await enforceRateLimits(request, session.userId);
  if (rateLimitResponse) return rateLimitResponse;

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

  const result = await unregisterDeviceToken(session.userId, token);
  return NextResponse.json({ success: result.success });
}
