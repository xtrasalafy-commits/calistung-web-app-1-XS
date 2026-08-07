import Link from "next/link";
import type { Metadata } from "next";
import { SectionTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "Belajar Seru",
  description: "Arena latihan interaktif membaca, menulis, dan berhitung untuk anak — gratis.",
};

const ARENA = [
  {
    href: "/belajar/baca",
    emoji: "📖",
    title: "Arena Membaca",
    color: "from-rose-400 to-pink-500",
    items: ["Kartu huruf A-Z bersuara", "29 huruf hijaiyah", "Penyusun suku kata", "Kuis tebak huruf"],
  },
  {
    href: "/belajar/tulis",
    emoji: "✏️",
    title: "Arena Menulis",
    color: "from-emerald-400 to-teal-500",
    items: ["Papan tulis digital", "Panduan menebalkan huruf & angka", "Pilih warna & ketebalan", "Kirim karya ke galeri"],
  },
  {
    href: "/belajar/hitung",
    emoji: "🔢",
    title: "Arena Berhitung",
    color: "from-amber-400 to-orange-500",
    items: ["Penjumlahan & pengurangan", "3 tingkat kesulitan", "Skor otomatis", "Masuk Papan Bintang"],
  },
];

export default function BelajarPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <SectionTitle
        kicker="Gratis · Tanpa Login"
        title="Pilih Arena Belajarmu! 🎈"
        desc="Semua permainan bisa dimainkan langsung di HP, tablet, maupun komputer. Dampingi ananda ya, Bunda!"
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {ARENA.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="card-soft group rounded-[2rem] border border-emerald-100 bg-white p-7 transition hover:-translate-y-2"
          >
            <div className={`grid h-20 w-20 place-items-center rounded-[1.5rem] bg-gradient-to-br ${a.color} text-4xl shadow-xl`}>
              {a.emoji}
            </div>
            <h2 className="font-display mt-5 text-2xl font-extrabold text-emerald-900">{a.title}</h2>
            <ul className="mt-4 space-y-2">
              {a.items.map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-emerald-500">✦</span>
                  {i}
                </li>
              ))}
            </ul>
            <span className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-3 text-sm font-bold text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
              Mulai <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-5 rounded-[2rem] border border-amber-200 bg-amber-50 p-7 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <span className="text-4xl">🏆</span>
        <div>
          <h3 className="font-display text-xl font-extrabold text-amber-900">Kumpulkan Bintang Terbanyak!</h3>
          <p className="mt-1 text-sm text-amber-800/80">
            Skor kuis ananda otomatis tercatat di Papan Bintang. Bintang tertinggi setiap bulan
            mendapat hadiah dari Ya Bunayya.
          </p>
        </div>
        <Link href="/peringkat" className="rounded-2xl bg-amber-500 px-6 py-3 text-center text-sm font-bold text-white hover:bg-amber-600">
          Lihat Papan Bintang
        </Link>
      </div>
    </div>
  );
}
