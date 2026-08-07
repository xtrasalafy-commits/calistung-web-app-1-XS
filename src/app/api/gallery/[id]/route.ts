import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { destroyFromCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }
  const { id } = await params;
  const [row] = await db.delete(galleryItems).where(eq(galleryItems.id, Number(id))).returning();
  if (row?.publicId) await destroyFromCloudinary(row.publicId, "image");
  return NextResponse.json({ ok: true });
}
