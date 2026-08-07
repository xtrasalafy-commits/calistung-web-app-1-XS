import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { teachers } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { destroyFromCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
    }
    const { id } = await params;
    const [row] = await db.delete(teachers).where(eq(teachers.id, Number(id))).returning();
    if (row?.photoPublicId) await destroyFromCloudinary(row.photoPublicId, "image");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[teachers DELETE]", err);
    return NextResponse.json({ error: "Gagal menghapus pengajar." }, { status: 500 });
  }
}
