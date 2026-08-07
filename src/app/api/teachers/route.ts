import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { teachers } from "@/db/schema";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select().from(teachers).orderBy(asc(teachers.sortOrder));
    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error("[teachers GET]", err);
    return NextResponse.json({ error: "Gagal memuat data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
    }
    const body = (await req.json().catch(() => ({}))) as Record<string, string | number>;
    const name = String(body.name ?? "").trim();
    if (!name) return NextResponse.json({ error: "Nama pengajar wajib diisi." }, { status: 400 });

    const [row] = await db
      .insert(teachers)
      .values({
        name,
        role: (body.role as string) || "Guru Calistung",
        bio: (body.bio as string) || null,
        photoUrl: (body.photoUrl as string) || null,
        photoPublicId: (body.photoPublicId as string) || null,
        sortOrder: Number(body.sortOrder ?? 99),
      })
      .returning();
    return NextResponse.json({ ok: true, data: row }, { status: 201 });
  } catch (err) {
    console.error("[teachers POST]", err);
    return NextResponse.json({ error: "Gagal menyimpan pengajar." }, { status: 500 });
  }
}
