import { NextResponse } from "next/server";
import { checkPassword, createSession, destroySession, isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ authenticated: await isAdmin() });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (!body.password || !checkPassword(body.password)) {
    return NextResponse.json({ error: "Kata sandi salah." }, { status: 401 });
  }
  await createSession();
  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ authenticated: false });
}
