import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select().from(galleryItems).orderBy(desc(galleryItems.createdAt));
    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error("[gallery GET]", err);
    return NextResponse.json({ error: "Gagal memuat data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, string | number>;
    const url = String(body.url ?? "").trim();
    const title = String(body.title ?? "").trim() || "Karya Siswa";
    const tag = String(body.tag ?? "Kegiatan");

    if (tag !== "Karya Siswa" && !(await isAdmin())) {
      return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
    }
    if (!url) return NextResponse.json({ error: "Berkas wajib diunggah." }, { status: 400 });

    const [row] = await db
      .insert(galleryItems)
      .values({
        title,
        caption: (body.caption as string) || null,
        tag,
        url,
        publicId: (body.publicId as string) || null,
        width: body.width ? Number(body.width) : null,
        height: body.height ? Number(body.height) : null,
      })
      .returning();

    return NextResponse.json({ ok: true, data: row }, { status: 201 });
  } catch (err) {
    console.error("[gallery POST]", err);
    return NextResponse.json({ error: "Gagal menyimpan galeri." }, { status: 500 });
  }
}
