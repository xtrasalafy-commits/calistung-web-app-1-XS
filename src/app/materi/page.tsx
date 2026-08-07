import Link from "next/link";
import type { Metadata } from "next";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { materials } from "@/db/schema";
import { cldThumb } from "@/lib/cloudinary";
import { LEVELS, MATERIAL_CATEGORIES } from "@/lib/content";
import { EmptyState, SectionTitle, formatBytes, formatDate } from "@/components/ui";
import { DownloadButton } from "@/components/download-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Materi & Lembar Kerja",
  description: "Unduh gratis lembar kerja calistung: kartu huruf, latihan menulis, dan soal berhitung.",
};

type Props = { searchParams: Promise<{ kategori?: string; level?: string }> };

export default async function MateriPage({ searchParams }: Props) {
  const sp = await searchParams;
  const kategori = sp.kategori ?? "semua";
  const level = sp.level ?? "semua";

  let rows: (typeof materials.$inferSelect)[] = [];
  try {
    const filters = [eq(materials.isPublished, true)];
    if (kategori !== "semua") filters.push(eq(materials.category, kategori));
    if (level !== "semua") filters.push(eq(materials.level, level));
    rows = await db.select().from(materials).where(and(...filters)).orderBy(desc(materials.createdAt));
  } catch {
    rows = [];
  }

  const qs = (k: string, v: string) => {
    const p = new URLSearchParams();
    if (k === "kategori" ? v !== "semua" : kategori !== "semua") p.set("kategori", k === "kategori" ? v : kategori);
    if (k === "level" ? v !== "semua" : level !== "semua") p.set("level", k === "level" ? v : level);
    const s = p.toString();
    return s ? `/materi?${s}` : "/materi";
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionTitle
        kicker="Perpustakaan Digital"
        title="Materi & Lembar Kerja Gratis"
        desc="Semua berkas disimpan di Cloudinary sehingga cepat diakses dan aman diunduh kapan saja."
      />

      <div className="mt-8 space-y-3">
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href={qs("kategori", "semua")}
            className={`rounded-full px-4 py-2 text-sm font-bold ${kategori === "semua" ? "bg-emerald-600 text-white" : "bg-white text-slate-600"}`}
          >
            🌟 Semua
          </Link>
          {MATERIAL_CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={qs("kategori", c.value)}
              className={`rounded-full px-4 py-2 text-sm font-bold ${kategori === c.value ? "bg-emerald-600 text-white" : "bg-white text-slate-600"}`}
            >
              {c.emoji} {c.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href={qs("level", "semua")}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold ${level === "semua" ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-500"}`}
          >
            Semua level
          </Link>
          {LEVELS.map((l) => (
            <Link
              key={l}
              href={qs("level", l)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-bold ${level === l ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-500"}`}
            >
              {l}
            </Link>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            emoji="📭"
            title="Belum ada materi pada filter ini"
            desc="Coba pilih kategori lain, atau hubungi admin untuk permintaan materi baru."
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((m) => {
            const cat = MATERIAL_CATEGORIES.find((c) => c.value === m.category);
            const isImage = m.kind === "image";
            return (
              <article key={m.id} className="card-soft flex flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white">
                <div className="relative h-40 bg-emerald-50">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cldThumb(m.url, 640, 360)} alt={m.title} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-5xl">
                      {m.kind === "video" ? "🎬" : m.kind === "audio" ? "🎵" : "📄"}
                    </div>
                  )}
                  <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold ${cat?.color ?? "bg-white text-slate-600"}`}>
                    {cat?.emoji} {cat?.label ?? m.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-extrabold leading-snug text-emerald-900">{m.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm text-slate-600">{m.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">{m.level}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">{(m.format ?? "file").toUpperCase()}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">{formatBytes(m.bytes)}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">⬇ {m.downloads}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <DownloadButton id={m.id} url={m.url} />
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">Diunggah {formatDate(m.createdAt)}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
