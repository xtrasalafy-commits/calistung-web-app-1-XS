import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { materials } from "@/db/schema";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category");
    const level = req.nextUrl.searchParams.get("level");

    const filters = [eq(materials.isPublished, true)];
    if (category && category !== "semua") filters.push(eq(materials.category, category));
    if (level && level !== "semua") filters.push(eq(materials.level, level));

    const rows = await db
      .select()
      .from(materials)
      .where(and(...filters))
      .orderBy(desc(materials.createdAt));

    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error("[materials GET]", err);
    return NextResponse.json({ error: "Gagal memuat data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
    }
    const body = (await req.json().catch(() => ({}))) as Record<string, string | number>;
    const title = String(body.title ?? "").trim();
    const url = String(body.url ?? "").trim();
    if (!title || !url) {
      return NextResponse.json({ error: "Judul dan berkas wajib diisi." }, { status: 400 });
    }
    const [row] = await db
      .insert(materials)
      .values({
        title,
        description: (body.description as string) || null,
        category: (body.category as string) || "baca",
        level: (body.level as string) || "Level 1",
        kind: (body.kind as string) || "image",
        url,
        publicId: (body.publicId as string) || null,
        format: (body.format as string) || null,
        bytes: body.bytes ? Number(body.bytes) : null,
      })
      .returning();
    return NextResponse.json({ ok: true, data: row }, { status: 201 });
  } catch (err) {
    console.error("[materials POST]", err);
    return NextResponse.json({ error: "Gagal menyimpan materi." }, { status: 500 });
  }
}
