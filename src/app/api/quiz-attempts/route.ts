import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { quizAttempts } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const moduleName = req.nextUrl.searchParams.get("module");
    const limit = Number(req.nextUrl.searchParams.get("limit") ?? 20);

    const base = db.select().from(quizAttempts);
    const rows = moduleName && moduleName !== "semua"
      ? await base.where(eq(quizAttempts.module, moduleName)).orderBy(desc(quizAttempts.score), desc(quizAttempts.createdAt)).limit(limit)
      : await base.orderBy(desc(quizAttempts.score), desc(quizAttempts.createdAt)).limit(limit);

    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error("[quiz-attempts GET]", err);
    return NextResponse.json({ error: "Gagal memuat data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, string | number>;
    const playerName = String(body.playerName ?? "").trim().slice(0, 60);
    if (playerName.length < 2) {
      return NextResponse.json({ error: "Nama minimal 2 huruf." }, { status: 400 });
    }
    const [row] = await db
      .insert(quizAttempts)
      .values({
        playerName,
        module: String(body.module ?? "hitung"),
        level: String(body.level ?? "Level 1"),
        score: Number(body.score ?? 0),
        total: Number(body.total ?? 10),
        durationSec: Number(body.durationSec ?? 0),
      })
      .returning();
    return NextResponse.json({ ok: true, data: row }, { status: 201 });
  } catch (err) {
    console.error("[quiz-attempts POST]", err);
    return NextResponse.json({ error: "Gagal menyimpan percobaan." }, { status: 500 });
  }
}
