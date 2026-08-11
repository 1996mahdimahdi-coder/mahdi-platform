import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

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
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
