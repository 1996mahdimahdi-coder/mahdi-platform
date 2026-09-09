import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { consentRecords, consentVersions } from "@/db/schema";
import { isMissingTableError } from "@/lib/noCapital/fallback";
import { loadActiveConsent } from "@/lib/noCapital/publicData";
import { checkRateLimit, clientIpKey, RATE_LIMITS, rateLimitExceededResponse } from "@/lib/rateLimit";
import { csrfGuard } from "@/lib/csrf";

export const dynamic = "force-dynamic";

const VALID_PURPOSES = ["assessment", "no-capital", "plan"] as const;

export async function GET() {
  try {
    const { consent, source } = await loadActiveConsent();
    return NextResponse.json({ success: true, source, consent });
  } catch (error) {
    console.error("consent GET error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." }, { status: 500 });
  }
}

async function resolveVersionId(version: string): Promise<number | null> {
  try {
    const [row] = await db
      .select({ id: consentVersions.id })
      .from(consentVersions)
      .where(eq(consentVersions.version, version))
      .limit(1);
    return row?.id ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const csrfErr = await csrfGuard(request);
  if (csrfErr) return csrfErr;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "بيانات الموافقة غير صالحة." }, { status: 400 });
  }

  const record = (body ?? {}) as Record<string, unknown>;
  // F10-12 — sessionId is an opaque token persisted into consent_records.
  // Bound to a printable token charset (1–64 of [A-Za-z0-9_-]) so control
  // chars / oversized blobs cannot be smuggled into the DB.
  const rawSessionId = typeof record.sessionId === "string" && record.sessionId ? record.sessionId : null;
  const sessionId = rawSessionId && /^[a-zA-Z0-9_-]{1,64}$/.test(rawSessionId) ? rawSessionId : "anonymous";
  if (rawSessionId && !/^[a-zA-Z0-9_-]{1,64}$/.test(rawSessionId)) {
    return NextResponse.json({ success: false, error: "معرّف الجلسة غير صالح." }, { status: 400 });
  }
  const purposeRaw = typeof record.purpose === "string" ? record.purpose : "assessment";
  const purpose = (VALID_PURPOSES as readonly string[]).includes(purposeRaw) ? purposeRaw : "assessment";
  const version = typeof record.version === "string" ? record.version : "";

  const ipCheck = await checkRateLimit({
    key: clientIpKey(request, "consent"),
    limit: RATE_LIMITS.assess.anonymous.limit,
    windowSeconds: RATE_LIMITS.assess.anonymous.windowSeconds,
  });

  if (!ipCheck.allowed) {
    return rateLimitExceededResponse(ipCheck);
  }

  try {
    const { consent } = await loadActiveConsent();

    if (version && version !== consent.version) {
      return NextResponse.json(
        { success: false, error: "النسخة المقدمة غير مطابقة للشروط النشطة." },
        { status: 403 }
      );
    }

    const versionId = version ? await resolveVersionId(version) : null;
    let persisted = false;

    try {
      await db
        .insert(consentRecords)
        .values({ sessionId, purpose, consentVersionId: versionId });
      persisted = true;
    } catch (error) {
      if (!isMissingTableError(error)) {
        console.error("consent record save error:", error);
        return NextResponse.json({ success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      persisted,
      purpose,
      version: version || consent.version,
      signedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("consent POST error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." }, { status: 500 });
  }
}
