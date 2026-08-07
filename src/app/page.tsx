import Image from "next/image";
import Link from "next/link";
import { desc, asc } from "drizzle-orm";
import { db } from "@/db";
import { galleryItems, teachers } from "@/db/schema";
import { cldThumb } from "@/lib/cloudinary";
import { FAQS, METHOD_STEPS, PROGRAMS, SCHOOL, STATS, TESTIMONIALS } from "@/lib/content";
import { SectionTitle } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";

export const dynamic = "force-dynamic";

const MARQUEE = [
  "Kelas kecil 1 guru : 5 anak",
  "Trial gratis + asesmen awal",
  "Rapor digital bulanan",
  "Guru sabar & bersertifikat",
  "Metode bermain, bukan menghafal",
  "Siap masuk SD favorit",
];

async function getData() {
  try {
    const [gallery, guru] = await Promise.all([
      db.select().from(galleryItems).orderBy(desc(galleryItems.createdAt)).limit(6),
      db.select().from(teachers).orderBy(asc(teachers.sortOrder)).limit(4),
    ]);
    return { gallery, guru };
  } catch {
    return { gallery: [], guru: [] };
  }
}

export default async function HomePage() {
  const { gallery, guru } = await getData();

  return (
    <div>
      {/* HERO */}
      <section className="dotted-grid relative overflow-hidden bg-gradient-to-b from-emerald-50 via-[var(--color-cream)] to-[var(--color-cream)]">
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-40 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">
              🕌 Bimbel Anak Islami · {SCHOOL.city}
            </span>
            <h1 className="font-display mt-5 text-4xl font-extrabold leading-[1.1] text-emerald-950 sm:text-5xl lg:text-[3.4rem]">
              Ananda Lancar{" "}
              <span className="relative whitespace-nowrap text-emerald-600">
                Baca, Tulis, Hitung
                <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" fill="none">
                  <path d="M2 7C40 2 90 2 198 6" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>{" "}
              dengan Ceria
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600">
              <strong className="text-emerald-800">{SCHOOL.name}</strong> mendampingi ananda usia 4–7 tahun
              di Palembang belajar calistung tanpa paksaan. Kelas kecil, guru penyayang, dan
              latihan interaktif online yang bisa diakses kapan saja dari rumah.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/daftar"
                className="bubble-shadow rounded-2xl bg-emerald-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                🚀 Daftar Trial Gratis
              </Link>
              <Link
                href="/belajar"
                className="rounded-2xl border-2 border-emerald-200 bg-white px-7 py-4 text-sm font-bold text-emerald-800 transition hover:border-emerald-400"
              >
                🎮 Coba Belajar Seru
              </Link>
            </div>

            <div className="mt-9 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-2xl border border-emerald-100 bg-white/90 px-3 py-3 text-center">
                  <div className="text-lg">{s.emoji}</div>
                  <div className="font-display text-xl font-extrabold text-emerald-700">{s.value}</div>
                  <div className="text-[11px] font-semibold leading-tight text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="animate-floaty absolute -left-3 top-6 z-10 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-emerald-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hari ini</p>
              <p className="font-display text-sm font-extrabold text-emerald-700">📖 Membaca Suku Kata</p>
            </div>
            <div className="animate-floaty absolute -right-2 bottom-8 z-10 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-amber-100" style={{ animationDelay: "1.4s" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Progres Kayla</p>
              <p className="font-display text-sm font-extrabold text-amber-600">⭐ 92% Membaca</p>
            </div>
            <div className="overflow-hidden rounded-[2.5rem] border-8 border-white bg-white shadow-2xl shadow-emerald-200/70">
              <Image
                src="/images/hero-calistung.jpg"
                alt="Anak-anak belajar calistung bersama ustadzah di Ya Bunayya Palembang"
                width={900}
                height={900}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-y border-emerald-100 bg-emerald-600/95 py-3">
          <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i} className="text-sm font-bold text-emerald-50">
                ✦ {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionTitle
          kicker="Program Belajar"
          title="Pilih Kelas Sesuai Usia Ananda"
          desc="Empat program utama yang disusun bertahap, dari belum kenal huruf sampai siap tes masuk SD."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.map((p) => (
            <div
              key={p.slug}
              className="card-soft group flex flex-col rounded-3xl border border-emerald-100 bg-white p-6 transition hover:-translate-y-1.5"
            >
              <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${p.color} text-2xl shadow-lg`}>
                {p.emoji}
              </div>
              <h3 className="font-display mt-4 text-xl font-extrabold text-emerald-900">{p.name}</h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-amber-600">{p.age}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{p.desc}</p>
              <p className="font-display mt-4 text-lg font-extrabold text-emerald-700">{p.price}</p>
              <p className="text-xs text-slate-500">{p.duration}</p>
              <Link
                href="/program"
                className="mt-4 rounded-xl bg-emerald-50 py-2.5 text-center text-sm font-bold text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white"
              >
                Lihat detail
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* METODE */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            kicker="Metode Kami"
            title="Belajar Terasa Seperti Bermain"
            desc="Empat tahap yang dilalui setiap ananda di Ya Bunayya, dari asesmen sampai laporan untuk orang tua."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {METHOD_STEPS.map((m) => (
              <div key={m.step} className="relative rounded-3xl bg-emerald-50/70 p-6">
                <span className="font-display absolute right-5 top-4 text-4xl font-extrabold text-emerald-200">
                  {m.step}
                </span>
                <div className="text-3xl">{m.emoji}</div>
                <h3 className="font-display mt-3 text-lg font-extrabold text-emerald-900">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BELAJAR INTERAKTIF */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionTitle
          kicker="Gratis untuk Semua"
          title="Latihan Interaktif Online"
          desc="Tiga arena bermain yang bisa dibuka kapan saja, lengkap dengan suara pengucapan bahasa Indonesia."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { href: "/belajar/baca", emoji: "📖", title: "Arena Membaca", desc: "Kartu huruf bersuara, hijaiyah, dan penyusun suku kata.", color: "from-rose-400 to-pink-500" },
            { href: "/belajar/tulis", emoji: "✏️", title: "Arena Menulis", desc: "Papan tulis digital untuk menebalkan huruf & angka.", color: "from-emerald-400 to-teal-500" },
            { href: "/belajar/hitung", emoji: "🔢", title: "Arena Berhitung", desc: "Kuis berhitung 3 level dengan skor & papan bintang.", color: "from-amber-400 to-orange-500" },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="card-soft group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-7 transition hover:-translate-y-1.5"
            >
              <div className={`grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br ${c.color} text-3xl shadow-lg`}>
                {c.emoji}
              </div>
              <h3 className="font-display mt-5 text-2xl font-extrabold text-emerald-900">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.desc}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-600">
                Mulai bermain <span className="transition group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* GALERI */}
      {gallery.length > 0 ? (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <SectionTitle
              kicker="Galeri Kegiatan"
              title="Keseruan di Kelas Ya Bunayya"
              desc="Semua foto dihosting aman di Cloudinary dan dioptimalkan otomatis."
            />
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
              {gallery.map((g) => (
                <figure key={g.id} className="group relative overflow-hidden rounded-3xl bg-emerald-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cldThumb(g.url, 700, 520)}
                    alt={g.title}
                    loading="lazy"
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-950/85 to-transparent p-4">
                    <p className="text-sm font-bold text-white">{g.title}</p>
                    <p className="text-[11px] text-emerald-100">{g.tag}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/galeri" className="rounded-2xl border-2 border-emerald-200 px-6 py-3 text-sm font-bold text-emerald-700 hover:border-emerald-400">
                Lihat semua foto →
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* GURU */}
      {guru.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <SectionTitle kicker="Tim Pengajar" title="Ustadz & Ustadzah Pendamping Ananda" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {guru.map((t) => (
              <div key={t.id} className="card-soft rounded-3xl border border-emerald-100 bg-white p-6 text-center">
                {t.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cldThumb(t.photoUrl, 240, 240)} alt={t.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
                ) : (
                  <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-emerald-100 text-3xl">
                    {t.name.toLowerCase().includes("ustadzah") ? "🧕" : "👳"}
                  </div>
                )}
                <h3 className="font-display mt-4 text-base font-extrabold text-emerald-900">{t.name}</h3>
                <p className="text-xs font-bold uppercase tracking-wide text-amber-600">{t.role}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{t.bio}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* TESTIMONI */}
      <section className="bg-emerald-50/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle kicker="Kata Orang Tua" title="Cerita dari Bunda & Ayah" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.name} className="card-soft rounded-3xl border border-emerald-100 bg-white p-6">
                <div className="text-amber-400">★★★★★</div>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">“{t.text}”</p>
                <footer className="mt-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald-100 text-xl">{t.avatar}</span>
                  <div>
                    <p className="text-sm font-bold text-emerald-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ + KONTAK */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2">
        <div>
          <SectionTitle center={false} kicker="FAQ" title="Pertanyaan yang Sering Ditanya" />
          <div className="mt-6 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-emerald-100 bg-white p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-bold text-emerald-900">
                  {f.q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div id="kontak">
          <SectionTitle center={false} kicker="Hubungi Kami" title="Masih Ragu? Tanya Dulu Saja" />
          <div className="card-soft mt-6 rounded-3xl border border-emerald-100 bg-white p-6">
            <ContactForm />
            <div className="mt-6 grid gap-2 border-t border-dashed border-emerald-200 pt-5 text-sm text-slate-600">
              <p>📍 {SCHOOL.address}</p>
              <p>📞 {SCHOOL.phone} · 🕘 {SCHOOL.hours}</p>
              <a
                href={`https://wa.me/${SCHOOL.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 rounded-2xl bg-emerald-100 px-4 py-3 text-center text-sm font-bold text-emerald-800 hover:bg-emerald-200"
              >
                💬 Chat WhatsApp Admin
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-teal-700 px-6 py-14 text-center text-white">
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-14 right-0 h-56 w-56 rounded-full bg-amber-300/20" />
          <h2 className="font-display relative text-3xl font-extrabold sm:text-4xl">
            Kuota Kelas Baru Terbatas 🎉
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-emerald-50">
            Setiap kelas hanya menerima 5 ananda. Daftarkan sekarang dan dapatkan 1x kelas
            percobaan gratis beserta asesmen awal.
          </p>
          <Link
            href="/daftar"
            className="relative mt-7 inline-block rounded-2xl bg-amber-400 px-8 py-4 text-sm font-extrabold text-emerald-950 shadow-xl transition hover:bg-amber-300"
          >
            Daftar Sekarang — Gratis Trial
          </Link>
        </div>
      </section>
    </div>
  );
}
