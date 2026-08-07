import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { registrations, students } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { destroyFromCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
    }
    const { id } = await params;
    const body = (await req.json().catch(() => ({}))) as { status?: string };
    const status = body.status ?? "baru";

    const [row] = await db
      .update(registrations)
      .set({ status })
      .where(eq(registrations.id, Number(id)))
      .returning();

    if (!row) return NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });

    if (status === "diterima") {
      const existing = await db.select().from(students).where(eq(students.name, row.childName));
      if (existing.length === 0) {
        await db.insert(students).values({
          name: row.childName,
          nickname: row.nickname,
          gender: row.gender,
          parentName: row.parentName,
          phone: row.phone,
          program: row.program,
        });
      }
    }

    return NextResponse.json({ ok: true, data: row });
  } catch (err) {
    console.error("[registrations PATCH]", err);
    return NextResponse.json({ error: "Gagal memperbarui pendaftaran." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
    }
    const { id } = await params;
    const [row] = await db
      .delete(registrations)
      .where(eq(registrations.id, Number(id)))
      .returning();
    if (row?.documentPublicId) await destroyFromCloudinary(row.documentPublicId, "image");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[registrations DELETE]", err);
    return NextResponse.json({ error: "Gagal menghapus pendaftaran." }, { status: 500 });
  }
}
