import { NextResponse } from "next/server";
import { count, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  galleryItems,
  materials,
  messages,
  quizAttempts,
  registrations,
  students,
} from "@/db/schema";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const [reg] = await db.select({ v: count() }).from(registrations);
  const [regNew] = await db
    .select({ v: count() })
    .from(registrations)
    .where(eq(registrations.status, "baru"));
  const [stu] = await db.select({ v: count() }).from(students);
  const [mat] = await db.select({ v: count() }).from(materials);
  const [gal] = await db.select({ v: count() }).from(galleryItems);
  const [msg] = await db.select({ v: count() }).from(messages);
  const [att] = await db.select({ v: count() }).from(quizAttempts);
  const [storage] = await db
    .select({ v: sql<number>`coalesce(sum(${materials.bytes}), 0)` })
    .from(materials);

  return NextResponse.json({
    data: {
      registrations: reg?.v ?? 0,
      newRegistrations: regNew?.v ?? 0,
      students: stu?.v ?? 0,
      materials: mat?.v ?? 0,
      gallery: gal?.v ?? 0,
      messages: msg?.v ?? 0,
      attempts: att?.v ?? 0,
      storageBytes: Number(storage?.v ?? 0),
    },
  });
}
