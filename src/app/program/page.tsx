import Link from "next/link";
import type { Metadata } from "next";
import { FAQS, PROGRAMS, SCHEDULES, SCHOOL } from "@/lib/content";
import { SectionTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "Program & Biaya",
  description: "Daftar program calistung, jadwal kelas, dan biaya belajar di Ya Bunayya Palembang.",
};

const FASILITAS = [
  { emoji: "📕", t: "Modul & Buku Kerja", d: "Setiap ananda mendapat buku kerja cetak dan akses materi digital." },
  { emoji: "🎨", t: "Alat Peraga Lengkap", d: "Kartu huruf, papan pasir, sempoa mini, dan puzzle angka." },
  { emoji: "🍎", t: "Snack Sehat", d: "Camilan bergizi di sela kelas sore agar ananda tetap fokus." },
  { emoji: "📱", t: "Rapor Digital", d: "Laporan perkembangan bulanan lengkap dengan foto kegiatan." },
  { emoji: "🧑‍🤝‍🧑", t: "Kelas Kecil", d: "Maksimal 5 ananda per guru untuk pendampingan personal." },
  { emoji: "🎁", t: "Reward Bintang", d: "Sistem bintang & sertifikat kelulusan untuk memotivasi anak." },
];

export default function ProgramPage() {
  return (
    <div>
      <section className="dotted-grid bg-gradient-to-b from-emerald-50 to-[var(--color-cream)] py-14">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">
            Program & Biaya
          </span>
          <h1 className="font-display mt-4 text-4xl font-extrabold text-emerald-950 sm:text-5xl">
            Kelas yang Tumbuh Bersama Ananda
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Semua program sudah termasuk modul, alat peraga, dan rapor digital. Tidak ada uang
            gedung — hanya biaya pendaftaran Rp 100.000 satu kali di awal.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 py-14">
        {PROGRAMS.map((p, i) => (
          <div
            key={p.slug}
            className="card-soft grid gap-6 rounded-[2rem] border border-emerald-100 bg-white p-7 md:grid-cols-[auto_1fr_auto] md:items-center"
          >
            <div className={`grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br ${p.color} text-4xl shadow-lg`}>
              {p.emoji}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-extrabold text-emerald-900">{p.name}</h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  {p.age}
                </span>
                {i === 1 ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    ⭐ Paling diminati
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.desc}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {p.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 text-emerald-500">✔</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-left md:text-right">
              <p className="font-display text-2xl font-extrabold text-emerald-700">{p.price}</p>
              <p className="text-xs text-slate-500">{p.duration}</p>
              <Link
                href={`/daftar?program=${encodeURIComponent(p.name)}`}
                className="mt-4 inline-block rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Ambil kelas ini
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle kicker="Fasilitas" title="Yang Ananda Dapatkan" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FASILITAS.map((f) => (
              <div key={f.t} className="rounded-3xl bg-emerald-50/70 p-6">
                <div className="text-3xl">{f.emoji}</div>
                <h3 className="font-display mt-3 text-lg font-extrabold text-emerald-900">{f.t}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card-soft rounded-3xl border border-emerald-100 bg-white p-7">
            <h2 className="font-display text-2xl font-extrabold text-emerald-900">🗓️ Pilihan Jadwal</h2>
            <p className="mt-1 text-sm text-slate-600">Pilih jadwal yang paling pas dengan aktivitas ananda.</p>
            <ul className="mt-5 space-y-2">
              {SCHEDULES.map((s) => (
                <li key={s} className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                  {s}
                  <span className="text-xs font-bold text-emerald-500">tersedia</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-soft rounded-3xl border border-emerald-100 bg-white p-7">
            <h2 className="font-display text-2xl font-extrabold text-emerald-900">❓ Sering Ditanya</h2>
            <div className="mt-5 space-y-3">
              {FAQS.map((f) => (
                <details key={f.q} className="group rounded-2xl bg-emerald-50/60 p-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="cursor-pointer text-sm font-bold text-emerald-900">{f.q}</summary>
                  <p className="mt-2 text-sm text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
            <a
              href={`https://wa.me/${SCHOOL.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 block rounded-2xl bg-emerald-600 px-5 py-3 text-center text-sm font-bold text-white"
            >
              💬 Tanya admin via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
