import { NextResponse } from "next/server";
import { isIP } from "node:net";
import { pool } from "@/db";

// ============================================================
// H1 — Rate limiting (PostgreSQL fixed-window counters).
//
// DESIGN DECISIONS (documented):
// - Store: a single `rate_limits` table in the existing PostgreSQL
//   database. No Redis / Upstash / external service is required.
// - Concurrency: every request increments the counter with ONE atomic
//   statement (`INSERT ... ON CONFLICT (key) DO UPDATE`). We never
//   read-then-write, so concurrent requests cannot lose increments or
//   race on the window reset.
// - Window: derived from the current time
//   (`floor(now / windowSeconds) * windowSeconds`). When the stored
//   window differs from the current one, the counter restarts at 1.
// - Fail-open: if the database is unavailable the request is allowed
//   through. An outage of the limiter must never take the service down;
//   we prefer availability over enforcement. Errors are logged safely
//   (no SQL, no credentials, no PII) and never surfaced to the caller.
// - Client IP: `x-forwarded-for` is only trusted as the real client IP
//   on Vercel (which rewrites it). On other deployments we prefer
//   `x-real-ip` (overwritten by common reverse proxies) and otherwise
//   fall back to the first `x-forwarded-for` entry. When no IP is
//   available the bucket degrades to a shared "unknown" key. For strict
//   self-hosted production a reverse proxy MUST overwrite these headers;
//   the per-account (email/userId) limits remain the hard protection.
// ============================================================

export const RATE_LIMITS = {
  login: {
    ip: { limit: 10, windowSeconds: 15 * 60 },
    email: { limit: 5, windowSeconds: 15 * 60 },
  },
  register: {
    ip: { limit: 3, windowSeconds: 60 * 60 },
  },
  assess: {
    user: { limit: 10, windowSeconds: 15 * 60 },
    anonymous: { limit: 5, windowSeconds: 15 * 60 },
  },
  ideaTest: {
    ip: { limit: 15, windowSeconds: 15 * 60 },
  },
  visitor: {
    ip: { limit: 5, windowSeconds: 60 * 60 },
  },
  adminWrite: {
    user: { limit: 30, windowSeconds: 15 * 60 },
  },
  adminStats: {
    user: { limit: 60, windowSeconds: 15 * 60 },
  },
  calculator: {
    ip: { limit: 60, windowSeconds: 60 },
  },
  dashboard: {
    user: { limit: 120, windowSeconds: 15 * 60 },
  },
  me: {
    user: { limit: 120, windowSeconds: 15 * 60 },
  },
} as const;

export type RateLimitInput = {
  key: string;
  limit: number;
  windowSeconds: number;
};

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | {
      allowed: false;
      limit: number;
      windowSeconds: number;
      retryAfterSeconds: number;
    };

export async function checkRateLimit({
  key,
  limit,
  windowSeconds,
}: RateLimitInput): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart =
    Math.floor(now / windowSeconds) * windowSeconds;

  try {
    const result = await pool.query<{ count: number }>(
      `INSERT INTO rate_limits (key, count, window_start, updated_at)
       VALUES ($1, 1, $2, now())
       ON CONFLICT (key) DO UPDATE SET
         count = CASE
           WHEN rate_limits.window_start = $2
             THEN rate_limits.count + 1
           ELSE 1
         END,
         window_start = $2,
         updated_at = now()
       RETURNING count`,
      [key, windowStart]
    );

    const count = Number(
      result.rows[0]?.count ?? 1
    );

    if (count > limit) {
      const windowEnd = windowStart + windowSeconds;

      return {
        allowed: false,
        limit,
        windowSeconds,
        retryAfterSeconds: Math.max(
          1,
          windowEnd - now
        ),
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, limit - count),
    };
  } catch (error) {
    // Fail-open: never block the request because the limiter itself
    // failed. Log safely (no SQL, no credentials, no PII).
    console.error(
      "Rate limiter error (fail-open):",
      error instanceof Error
        ? error.message
        : "unknown error"
    );

    return { allowed: true, remaining: limit };
  }
}

export function rateLimitExceededResponse(
  result: Extract<
    RateLimitResult,
    { allowed: false }
  >
): NextResponse {
  const minutes = Math.max(
    1,
    Math.ceil(result.retryAfterSeconds / 60)
  );

  return NextResponse.json(
    {
      success: false,
      error: `لقد تجاوزت عدد المحاولات المسموح بها. أعد المحاولة بعد ${minutes} دقيقة.`,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(
          result.retryAfterSeconds
        ),
        "Cache-Control": "private, no-store",
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(
          Math.floor(Date.now() / 1000) +
            result.retryAfterSeconds
        ),
      },
    }
  );
}

export function normalizeEmail(
  email: string
): string {
  return email.trim().toLowerCase();
}

export function getClientIp(
  request: Request
): string | null {
  const forwarded = request.headers.get(
    "x-forwarded-for"
  );

  const candidates: string[] = [];

  if (forwarded) {
    for (const part of forwarded.split(",")) {
      const value = part.trim();
      if (value && isIP(value) !== 0) {
        candidates.push(value);
      }
    }
  }

  // On Vercel the first entry is the real client IP because Vercel
  // overwrites this header. It is safe to trust it there.
  if (process.env.VERCEL === "1") {
    return candidates[0] ?? null;
  }

  // Non-Vercel: prefer x-real-ip (overwritten by Nginx & co. with the
  // true peer address) over the client-controlled x-forwarded-for.
  const realIp = request.headers.get("x-real-ip");

  if (realIp && isIP(realIp.trim()) !== 0) {
    return realIp.trim();
  }

  return candidates[0] ?? null;
}

export function clientIpKey(
  request: Request,
  scope: string
): string {
  const ip = getClientIp(request) ?? "unknown";

  return `${scope}:ip:${ip}`;
}

export function normalizeIpKey(
  ip: string
): string {
  const kind = isIP(ip);

  if (kind === 4) {
    // IPv4: /32 — the full address is the identity.
    return ip;
  }

  if (kind === 6) {
    const lower = ip.toLowerCase();
    const zoneIdx = lower.indexOf("%");
    const clean =
      zoneIdx !== -1
        ? lower.slice(0, zoneIdx)
        : lower;

    // IPv4-mapped (::ffff:192.0.2.1) -> enforce IPv4 /32 semantics so
    // every IPv4 client does not collapse into one shared bucket.
    const v4Mapped = clean.match(
      /(\d{1,3}(?:\.\d{1,3}){3})$/
    );

    if (v4Mapped && isIP(v4Mapped[1]) === 4) {
      return v4Mapped[1];
    }

    const expanded = expandIpv6(clean);

    if (expanded) {
      const groups = expanded.split(":");

      if (groups.length === 8) {
        // /64 aggregation: households behind a shared prefix (NAT64,
        // DHCP-PD, CGNAT) stay unpunished while a single host still
        // has a bounded request budget.
        return `${groups.slice(0, 4).join(":")}::/64`;
      }
    }

    return clean;
  }

  return ip;
}

// Expand a canonical IPv6 address into exactly 8 hextets, or null if
// it cannot be interpreted safely. Handles "::" compression and
// IPv4-embedded trailing addresses. Never used to over-aggregate: on
// any ambiguity the caller falls back to the raw address (/128).
function expandIpv6(addr: string): string | null {
  let a = addr.toLowerCase();
  const zoneIdx = a.indexOf("%");
  if (zoneIdx !== -1) {
    a = a.slice(0, zoneIdx);
  }

  const lastColon = a.lastIndexOf(":");
  const tail =
    lastColon !== -1 ? a.slice(lastColon + 1) : a;

  if (tail.includes(".")) {
    const quads = tail.split(".").map(Number);

    if (
      quads.length !== 4 ||
      quads.some(
        (q) =>
          q < 0 ||
          q > 255 ||
          !Number.isInteger(q)
      )
    ) {
      return null;
    }

    const hi = (quads[0] << 8) | quads[1];
    const lo = (quads[2] << 8) | quads[3];

    a =
      (lastColon !== -1
        ? a.slice(0, lastColon + 1)
        : "") +
      hi.toString(16) +
      ":" +
      lo.toString(16);
  }

  const halves = a.split("::");

  if (halves.length > 2) {
    return null;
  }

  const left = halves[0] ? halves[0].split(":") : [];
  const right =
    halves.length === 2 && halves[1]
      ? halves[1].split(":")
      : [];

  const allParts = [...left, ...right];

  if (
    !allParts.every((h) =>
      /^[0-9a-f]{1,4}$/.test(h)
    ) ||
    allParts.length > 8
  ) {
    return null;
  }

  if (halves.length === 1) {
    if (allParts.length !== 8) {
      return null;
    }

    return allParts.join(":");
  }

  const missing = 8 - allParts.length;

  if (missing < 1) {
    return null;
  }

  const zeros = Array(missing).fill("0");

  return [...left, ...zeros, ...right].join(":");
}
