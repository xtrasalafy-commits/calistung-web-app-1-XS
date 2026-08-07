import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { students } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { destroyFromCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, string | number>;

  const patch: Record<string, unknown> = {};
  for (const key of ["name", "nickname", "gender", "parentName", "phone", "program", "level", "status", "notes", "photoUrl", "photoPublicId"]) {
    if (body[key] !== undefined) patch[key] = body[key];
  }
  for (const key of ["age", "progressBaca", "progressTulis", "progressHitung"]) {
    if (body[key] !== undefined) patch[key] = Number(body[key]);
  }

  const [row] = await db.update(students).set(patch).where(eq(students.id, Number(id))).returning();
  if (!row) return NextResponse.json({ error: "Siswa tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ ok: true, data: row });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }
  const { id } = await params;
  const [row] = await db.delete(students).where(eq(students.id, Number(id))).returning();
  if (row?.photoPublicId) await destroyFromCloudinary(row.photoPublicId, "image");
  return NextResponse.json({ ok: true });
}
