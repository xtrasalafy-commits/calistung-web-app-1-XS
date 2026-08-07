import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { students } from "@/db/schema";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }
  const rows = await db.select().from(students).orderBy(desc(students.createdAt));
  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, string | number>;
  const name = String(body.name ?? "").trim();
  if (name.length < 2) {
    return NextResponse.json({ error: "Nama siswa wajib diisi." }, { status: 400 });
  }
  const [row] = await db
    .insert(students)
    .values({
      name,
      nickname: (body.nickname as string) || null,
      gender: (body.gender as string) || "Ikhwan",
      age: body.age ? Number(body.age) : null,
      parentName: (body.parentName as string) || null,
      phone: (body.phone as string) || null,
      program: (body.program as string) || "Calistung Dasar",
      level: (body.level as string) || "Level 1",
      photoUrl: (body.photoUrl as string) || null,
      photoPublicId: (body.photoPublicId as string) || null,
      progressBaca: Number(body.progressBaca ?? 0),
      progressTulis: Number(body.progressTulis ?? 0),
      progressHitung: Number(body.progressHitung ?? 0),
      notes: (body.notes as string) || null,
    })
    .returning();
  return NextResponse.json({ ok: true, data: row }, { status: 201 });
}
