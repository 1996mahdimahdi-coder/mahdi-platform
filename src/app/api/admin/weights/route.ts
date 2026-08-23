import { NextResponse } from "next/server";
import { db } from "@/db";
import { scoringWeights } from "@/db/schema";
import { DEFAULT_WEIGHTS } from "@/lib/scoringEngine";
import { eq } from "drizzle-orm";
import {
  forbiddenResponse,
  getSession,
  PRIVATE_NO_STORE_HEADERS,
  unauthorizedResponse,
} from "@/lib/auth";
import {
  checkRateLimit,
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";
import { csrfGuard } from "@/lib/csrf";

export const dynamic = "force-dynamic";

function internalError(error: unknown) {
  console.error("Admin weights error:", error);

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

async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    return {
      session: null,
      response: unauthorizedResponse(),
    };
  }

  if (session.role !== "admin") {
    return {
      session: null,
      response: forbiddenResponse(),
    };
  }

  return {
    session,
    response: null,
  };
}

function parseWeight(value: unknown):
  number | null {
  const numberValue = Number(value);

  if (
    !Number.isInteger(numberValue) ||
    numberValue < 0 ||
    numberValue > 100
  ) {
    return null;
  }

  return numberValue;
}

export async function GET() {
  const auth = await requireAdmin();

  if (auth.response) {
    return auth.response;
  }

  try {
    const rows = await db
      .select()
      .from(scoringWeights)
      .limit(1);

    return NextResponse.json(
      {
        success: true,
        weights:
          rows[0] || DEFAULT_WEIGHTS,
        persisted: rows.length > 0,
      },
      {
        headers: PRIVATE_NO_STORE_HEADERS,
      }
    );
  } catch (error) {
    return internalError(error);
  }
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();

  if (auth.response) {
    return auth.response;
  }

  const csrfErr = await csrfGuard(request);
  if (csrfErr) return csrfErr;

  const writeLimit = RATE_LIMITS.adminWrite.user;

  const writeCheck = await checkRateLimit({
    key: `admin:write:user:${auth.session.userId}`,
    limit: writeLimit.limit,
    windowSeconds: writeLimit.windowSeconds,
  });

  if (!writeCheck.allowed) {
    return rateLimitExceededResponse(writeCheck);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error:
          "\u0642\u064a\u0645 \u0627\u0644\u0623\u0648\u0632\u0627\u0646 \u063a\u064a\u0631 \u0635\u0627\u0644\u062d\u0629.",
      },
      {
        status: 400,
        headers: PRIVATE_NO_STORE_HEADERS,
      }
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "\u0642\u064a\u0645 \u0627\u0644\u0623\u0648\u0632\u0627\u0646 \u063a\u064a\u0631 \u0635\u0627\u0644\u062d\u0629.",
      },
      {
        status: 400,
        headers: PRIVATE_NO_STORE_HEADERS,
      }
    );
  }

  const input = body as Record<string, unknown>;

  const values = {
    financialWeight:
      parseWeight(input.financialWeight),
    personalWeight:
      parseWeight(input.personalWeight),
    workspaceWeight:
      parseWeight(input.workspaceWeight),
    locationWeight:
      parseWeight(input.locationWeight),
    riskWeight:
      parseWeight(input.riskWeight),
    startabilityWeight:
      parseWeight(input.startabilityWeight),
    scalabilityWeight:
      parseWeight(input.scalabilityWeight),
    timeWeight:
      parseWeight(input.timeWeight),
  };

  if (
    Object.values(values).some(
      (value) => value === null
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "\u0642\u064a\u0645 \u0627\u0644\u0623\u0648\u0632\u0627\u0646 \u063a\u064a\u0631 \u0635\u0627\u0644\u062d\u0629.",
      },
      {
        status: 400,
        headers: PRIVATE_NO_STORE_HEADERS,
      }
    );
  }

  const safeValues = {
    financialWeight:
      values.financialWeight as number,
    personalWeight:
      values.personalWeight as number,
    workspaceWeight:
      values.workspaceWeight as number,
    locationWeight:
      values.locationWeight as number,
    riskWeight:
      values.riskWeight as number,
    startabilityWeight:
      values.startabilityWeight as number,
    scalabilityWeight:
      values.scalabilityWeight as number,
    timeWeight:
      values.timeWeight as number,
  };

  const total = Object.values(
    safeValues
  ).reduce(
    (sum, value) => sum + value,
    0
  );

  if (total !== 100) {
    return NextResponse.json(
      {
        success: false,
        error:
          "\u064a\u062c\u0628 \u0623\u0646 \u064a\u0643\u0648\u0646 \u0645\u062c\u0645\u0648\u0639 \u0627\u0644\u0623\u0648\u0632\u0627\u0646 100.",
      },
      {
        status: 400,
        headers: PRIVATE_NO_STORE_HEADERS,
      }
    );
  }

  try {
    const rows = await db
      .select()
      .from(scoringWeights)
      .limit(1);

    let saved;

    if (rows.length === 0) {
      [saved] = await db
        .insert(scoringWeights)
        .values(safeValues)
        .returning();
    } else {
      [saved] = await db
        .update(scoringWeights)
        .set({
          ...safeValues,
          updatedAt: new Date(),
        })
        .where(
          eq(
            scoringWeights.id,
            rows[0].id
          )
        )
        .returning();
    }

    return NextResponse.json(
      {
        success: true,
        weights: saved,
      },
      {
        headers: PRIVATE_NO_STORE_HEADERS,
      }
    );
  } catch (error) {
    return internalError(error);
  }
}
