import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { materials } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { destroyFromCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    await db
      .update(materials)
      .set({ downloads: sql`${materials.downloads} + 1` })
      .where(eq(materials.id, Number(id)));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[materials POST]", err);
    return NextResponse.json({ error: "Gagal memperbarui unduhan." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
    }
    const { id } = await params;
    const [row] = await db.delete(materials).where(eq(materials.id, Number(id))).returning();
    if (row?.publicId) {
      await destroyFromCloudinary(row.publicId, row.kind === "video" ? "video" : row.kind === "pdf" ? "image" : "image");
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[materials DELETE]", err);
    return NextResponse.json({ error: "Gagal menghapus materi." }, { status: 500 });
  }
}
