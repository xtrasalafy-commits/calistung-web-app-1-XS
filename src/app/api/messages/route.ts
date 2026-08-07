import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
    }
    const rows = await db.select().from(messages).orderBy(desc(messages.createdAt));
    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error("[messages GET]", err);
    return NextResponse.json({ error: "Gagal memuat data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, string>;
    const name = (body.name ?? "").trim();
    const text = (body.body ?? "").trim();
    if (name.length < 2 || text.length < 5) {
      return NextResponse.json({ error: "Nama dan pesan wajib diisi." }, { status: 400 });
    }
    const [row] = await db
      .insert(messages)
      .values({ name, phone: body.phone?.trim() || null, body: text })
      .returning();
    return NextResponse.json({ ok: true, data: row }, { status: 201 });
  } catch (err) {
    console.error("[messages POST]", err);
    return NextResponse.json({ error: "Gagal menyimpan pesan." }, { status: 500 });
  }
}
