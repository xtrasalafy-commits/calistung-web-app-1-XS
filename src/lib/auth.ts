import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "yb_admin";

function secret() {
  return process.env.ADMIN_PASSWORD ?? "yabunayya2026";
}

function token() {
  return createHmac("sha256", secret()).update("ya-bunayya-admin").digest("hex");
}

export function checkPassword(input: string) {
  const a = Buffer.from(input ?? "");
  const b = Buffer.from(secret());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function createSession() {
  const jar = await cookies();
  jar.set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAdmin() {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === token();
}
