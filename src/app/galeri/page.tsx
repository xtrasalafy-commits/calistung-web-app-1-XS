import Link from "next/link";
import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { cldThumb } from "@/lib/cloudinary";
import { EmptyState, SectionTitle, formatDate } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galeri Kegiatan",
  description: "Dokumentasi kegiatan belajar dan karya siswa Calistung Ya Bunayya Palembang.",
};

type Props = { searchParams: Promise<{ tag?: string }> };

export default async function GaleriPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tag = sp.tag ?? "semua";

  let rows: (typeof galleryItems.$inferSelect)[] = [];
  try {
    rows = tag === "semua"
      ? await db.select().from(galleryItems).orderBy(desc(galleryItems.createdAt))
      : await db.select().from(galleryItems).where(eq(galleryItems.tag, tag)).orderBy(desc(galleryItems.createdAt));
  } catch {
    rows = [];
  }

  let tags: string[] = [];
  try {
    const all = await db.select({ tag: galleryItems.tag }).from(galleryItems);
    tags = [...new Set(all.map((a) => a.tag))];
  } catch {
    tags = [];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionTitle
        kicker="Dokumentasi"
        title="Galeri Ya Bunayya"
        desc="Momen belajar, karya ananda, dan fasilitas kelas kami. Semua gambar dihosting di Cloudinary."
      />

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Link
          href="/galeri"
          className={`rounded-full px-4 py-2 text-sm font-bold ${tag === "semua" ? "bg-emerald-600 text-white" : "bg-white text-slate-600"}`}
        >
          Semua
        </Link>
        {tags.map((t) => (
          <Link
            key={t}
            href={`/galeri?tag=${encodeURIComponent(t)}`}
            className={`rounded-full px-4 py-2 text-sm font-bold ${tag === t ? "bg-emerald-600 text-white" : "bg-white text-slate-600"}`}
          >
            {t}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="mt-10">
          <EmptyState emoji="📷" title="Galeri masih kosong" desc="Foto kegiatan akan segera ditambahkan admin." />
        </div>
      ) : (
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {rows.map((g) => (
            <figure key={g.id} className="card-soft group break-inside-avoid overflow-hidden rounded-3xl border border-emerald-100 bg-white">
              <a href={g.url} target="_blank" rel="noreferrer" className="block overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cldThumb(g.url, 800)}
                  alt={g.title}
                  loading="lazy"
                  className="w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </a>
              <figcaption className="p-5">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">{g.tag}</span>
                  <span className="text-[11px] text-slate-400">{formatDate(g.createdAt)}</span>
                </div>
                <h3 className="font-display mt-2 text-lg font-extrabold text-emerald-900">{g.title}</h3>
                {g.caption ? <p className="mt-1 text-sm text-slate-600">{g.caption}</p> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-[2rem] border border-amber-200 bg-amber-50 p-7 text-center">
        <p className="font-display text-xl font-extrabold text-amber-900">✏️ Ingin karyamu tampil di sini?</p>
        <p className="mt-1 text-sm text-amber-800/80">
          Gambar di Arena Menulis lalu kirim karyamu — otomatis muncul di galeri ini.
        </p>
        <Link href="/belajar/tulis" className="mt-4 inline-block rounded-2xl bg-amber-500 px-6 py-3 text-sm font-bold text-white">
          Buka Arena Menulis
        </Link>
      </div>
    </div>
  );
}
