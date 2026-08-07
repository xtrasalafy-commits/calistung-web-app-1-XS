import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { registrations } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { notifyNewRegistration } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
    }
    const rows = await db.select().from(registrations).orderBy(desc(registrations.createdAt));
    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error("[registrations GET]", err);
    return NextResponse.json({ error: "Gagal memuat data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, string> | null;
    if (!body) return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });

    const childName = (body.childName ?? "").trim();
    const parentName = (body.parentName ?? "").trim();
    const phone = (body.phone ?? "").trim();

    if (childName.length < 2) {
      return NextResponse.json({ error: "Nama ananda wajib diisi." }, { status: 400 });
    }
    if (parentName.length < 2) {
      return NextResponse.json({ error: "Nama orang tua wajib diisi." }, { status: 400 });
    }
    if (!/^[0-9+\-\s()]{8,20}$/.test(phone)) {
      return NextResponse.json({ error: "Nomor WhatsApp tidak valid." }, { status: 400 });
    }

    const [row] = await db
      .insert(registrations)
      .values({
        childName,
        nickname: body.nickname?.trim() || null,
        gender: body.gender || "Ikhwan",
        birthDate: body.birthDate ? body.birthDate : null,
        parentName,
        phone,
        email: body.email?.trim() || null,
        address: body.address?.trim() || null,
        program: body.program || "Calistung Dasar",
        schedule: body.schedule || "Senin & Rabu (15.30)",
        message: body.message?.trim() || null,
        documentUrl: body.documentUrl || null,
        documentPublicId: body.documentPublicId || null,
      })
      .returning();

    try {
      await notifyNewRegistration({
        childName,
        parentName,
        phone,
        program: body.program || "Calistung Dasar",
        schedule: body.schedule || "Senin & Rabu (15.30)",
      });
    } catch {
      // jangan gagalkan pendaftaran hanya karena notifikasi gagal
    }

    return NextResponse.json({ ok: true, data: row }, { status: 201 });
  } catch (err) {
    console.error("[registrations POST]", err);
    return NextResponse.json({ error: "Gagal menyimpan pendaftaran." }, { status: 500 });
  }
}
