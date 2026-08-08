"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SCHOOL } from "@/lib/content";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    void fetch("/api/admin/session")
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (json.authenticated) router.replace("/admin");
      })
      .catch(() => {});
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      let json: { error?: string } = {};
      try {
        json = (await res.json()) as { error?: string };
      } catch {
        // ignore
      }
      if (!res.ok) throw new Error(json.error ?? "Gagal masuk.");
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="text-center">
        <span className="rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-700">
          Admin
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-emerald-950">
          Masuk Panel Admin
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Hanya untuk pengelola {SCHOOL.name}.
        </p>
      </div>

      <form onSubmit={submit} className="card-soft mt-8 rounded-[2rem] border border-emerald-100 bg-white p-7">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Kata sandi admin
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          placeholder="Masukkan kata sandi..."
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Memeriksa..." : "Masuk"}
        </button>
        {error ? (
          <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{error}</p>
        ) : null}
      </form>

      <p className="mt-6 text-center text-xs text-slate-400">
        <Link href="/" className="font-semibold text-emerald-700 underline">
          Kembali ke beranda
        </Link>
      </p>
    </div>
  );
}
