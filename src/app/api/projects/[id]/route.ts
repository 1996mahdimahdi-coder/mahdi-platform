import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { forbiddenResponse, getSession, unauthorizedResponse } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    return unauthorizedResponse();
  }

  if (session.role !== "admin") {
    return forbiddenResponse();
  }

  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isNumeric = !isNaN(Number(id));

    let project = null;
    if (isNumeric) {
      const res = await db.select().from(projects).where(eq(projects.id, Number(id))).limit(1);
      project = res[0];
    }

    if (!project) {
      const res = await db.select().from(projects).where(eq(projects.projectId, id)).limit(1);
      project = res[0];
    }

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();

  if (authError) {
    return authError;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const isNumeric = !isNaN(Number(id));

    let updated = null;
    if (isNumeric) {
      const [res] = await db
        .update(projects)
        .set({ ...body, lastUpdated: new Date() })
        .where(eq(projects.id, Number(id)))
        .returning();
      updated = res;
    } else {
      const [res] = await db
        .update(projects)
        .set({ ...body, lastUpdated: new Date() })
        .where(eq(projects.projectId, id))
        .returning();
      updated = res;
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();

  if (authError) {
    return authError;
  }

  try {
    const { id } = await params;
    const isNumeric = !isNaN(Number(id));

    if (isNumeric) {
      await db.delete(projects).where(eq(projects.id, Number(id)));
    } else {
      await db.delete(projects).where(eq(projects.projectId, id));
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." }, { status: 500 });
  }
}
