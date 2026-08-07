import Link from "next/link";
import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { quizAttempts } from "@/db/schema";
import { EmptyState, SectionTitle, formatDate } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Papan Bintang",
  description: "Peringkat skor latihan interaktif membaca dan berhitung siswa Ya Bunayya.",
};

const MODULES = [
  { id: "semua", label: "Semua", emoji: "🌟" },
  { id: "baca", label: "Membaca", emoji: "📖" },
  { id: "hitung", label: "Berhitung", emoji: "🔢" },
];

const MEDALS = ["🥇", "🥈", "🥉"];

type Props = { searchParams: Promise<{ modul?: string }> };

export default async function PeringkatPage({ searchParams }: Props) {
  const sp = await searchParams;
  const modul = sp.modul ?? "semua";

  let rows: (typeof quizAttempts.$inferSelect)[] = [];
  try {
    rows = modul === "semua"
      ? await db.select().from(quizAttempts).orderBy(desc(quizAttempts.score), desc(quizAttempts.createdAt)).limit(25)
      : await db
          .select()
          .from(quizAttempts)
          .where(eq(quizAttempts.module, modul))
          .orderBy(desc(quizAttempts.score), desc(quizAttempts.createdAt))
          .limit(25);
  } catch {
    rows = [];
  }

  const podium = rows.slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionTitle
        kicker="Hall of Fame"
        title="🏆 Papan Bintang Ya Bunayya"
        desc="Skor tertinggi dari arena latihan interaktif. Ayo kumpulkan bintang sebanyak-banyaknya!"
      />

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {MODULES.map((m) => (
          <Link
            key={m.id}
            href={m.id === "semua" ? "/peringkat" : `/peringkat?modul=${m.id}`}
            className={`rounded-full px-5 py-2.5 text-sm font-bold ${modul === m.id ? "bg-emerald-600 text-white" : "bg-white text-slate-600"}`}
          >
            {m.emoji} {m.label}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="mt-10">
          <EmptyState emoji="⭐" title="Belum ada bintang" desc="Jadilah yang pertama! Mainkan kuis di Arena Belajar." />
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {podium.map((p, i) => (
              <div
                key={p.id}
                className={`card-soft rounded-3xl border-2 p-6 text-center ${
                  i === 0 ? "border-amber-300 bg-amber-50 sm:-translate-y-3" : "border-emerald-100 bg-white"
                }`}
              >
                <div className="text-4xl">{MEDALS[i]}</div>
                <p className="font-display mt-2 text-xl font-extrabold text-emerald-900">{p.playerName}</p>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {p.module === "baca" ? "📖 Membaca" : "🔢 Berhitung"} · {p.level}
                </p>
                <p className="font-display mt-3 text-3xl font-extrabold text-amber-600">
                  {p.score}
                  <span className="text-base text-slate-400">/{p.total}</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">⏱️ {p.durationSec} detik</p>
              </div>
            ))}
          </div>

          <div className="card-soft mt-8 overflow-hidden rounded-3xl border border-emerald-100 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-emerald-50 text-xs uppercase tracking-wider text-emerald-700">
                <tr>
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-5 py-3">Modul</th>
                  <th className="px-5 py-3">Level</th>
                  <th className="px-5 py-3">Skor</th>
                  <th className="hidden px-5 py-3 sm:table-cell">Waktu</th>
                  <th className="hidden px-5 py-3 md:table-cell">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {rows.map((r, i) => (
                  <tr key={r.id} className="hover:bg-emerald-50/50">
                    <td className="px-5 py-3 font-bold text-slate-400">{i + 1}</td>
                    <td className="px-5 py-3 font-bold text-emerald-900">{r.playerName}</td>
                    <td className="px-5 py-3">{r.module === "baca" ? "📖 Baca" : "🔢 Hitung"}</td>
                    <td className="px-5 py-3 text-slate-500">{r.level}</td>
                    <td className="px-5 py-3 font-extrabold text-amber-600">{r.score}/{r.total}</td>
                    <td className="hidden px-5 py-3 text-slate-500 sm:table-cell">{r.durationSec}s</td>
                    <td className="hidden px-5 py-3 text-slate-400 md:table-cell">{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/belajar/baca" className="rounded-2xl bg-rose-500 px-6 py-3 text-sm font-bold text-white">
          📖 Main Kuis Membaca
        </Link>
        <Link href="/belajar/hitung" className="rounded-2xl bg-amber-500 px-6 py-3 text-sm font-bold text-white">
          🔢 Main Kuis Berhitung
        </Link>
      </div>
    </div>
  );
}
