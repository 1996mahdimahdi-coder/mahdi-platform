import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/noCapital/adminHandlers";
import { csrfGuard } from "@/lib/csrf";
import { checkRateLimit, RATE_LIMITS, rateLimitExceededResponse } from "@/lib/rateLimit";
import { PRIVATE_NO_STORE_HEADERS } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Accented image types and maximum size accepted for a book cover.
const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_COVER_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Client-upload endpoint for NABDA library book covers (Vercel Blob).
 *
 * The browser never sees the read-write token. It first asks this route for a
 * short-lived client token (via `handleUpload`), then uploads the file directly
 * to Vercel Blob. Only the public blob URL is ever stored in the database's
 * `coverImage` column (a text field) — never the image bytes.
 *
 * Security contract mirrors the rest of the admin API:
 *   - admin session + role guard (requireAdmin)
 *   - CSRF guard
 *   - admin-write rate limit
 *   - content-type + size constraints enforced at token generation
 */
export async function POST(request: Request): Promise<NextResponse> {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const csrfErr = await csrfGuard(request);
  if (csrfErr) return csrfErr;

  const session = auth.session;
  if (session) {
    const writeLimit = RATE_LIMITS.adminWrite.user;
    const writeCheck = await checkRateLimit({
      key: `admin:write:user:${session.userId}`,
      limit: writeLimit.limit,
      windowSeconds: writeLimit.windowSeconds,
    });
    if (!writeCheck.allowed) return rateLimitExceededResponse(writeCheck);
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_COVER_BYTES,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24,
        };
      },
    });

    return NextResponse.json(jsonResponse, { headers: PRIVATE_NO_STORE_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
    );
  }
}