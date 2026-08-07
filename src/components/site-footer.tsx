import Link from "next/link";
import { SCHOOL } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-emerald-900 text-emerald-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/25 text-2xl">📚</span>
            <div>
              <p className="font-display text-xl font-extrabold">{SCHOOL.name}</p>
              <p className="text-sm text-emerald-200">{SCHOOL.tagline}</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-emerald-100/85">
            Lembaga bimbingan belajar calistung untuk ananda usia 4–7 tahun di Kota Palembang.
            Mengantarkan anak siap masuk SD dengan hati yang gembira dan akhlak yang baik.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={`https://wa.me/${SCHOOL.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-400"
            >
              💬 WhatsApp
            </a>
            <a
              href={`mailto:${SCHOOL.email}`}
              className="rounded-full border border-emerald-600 px-4 py-2 text-sm font-semibold transition hover:bg-emerald-800"
            >
              ✉️ Email
            </a>
          </div>
        </div>

        <div>
          <p className="font-display text-base font-bold text-amber-300">Jelajahi</p>
          <ul className="mt-3 space-y-2 text-sm text-emerald-100/85">
            <li><Link href="/program" className="hover:text-white">Program & Biaya</Link></li>
            <li><Link href="/belajar" className="hover:text-white">Belajar Interaktif</Link></li>
            <li><Link href="/materi" className="hover:text-white">Unduh Materi</Link></li>
            <li><Link href="/galeri" className="hover:text-white">Galeri Kegiatan</Link></li>
            <li><Link href="/peringkat" className="hover:text-white">Papan Bintang</Link></li>
            <li><Link href="/admin" className="hover:text-white">Panel Admin</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-base font-bold text-amber-300">Kunjungi Kami</p>
          <ul className="mt-3 space-y-3 text-sm text-emerald-100/85">
            <li>📍 {SCHOOL.address}</li>
            <li>📞 {SCHOOL.phone}</li>
            <li>🕘 {SCHOOL.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-emerald-800 py-5 text-center text-xs text-emerald-300">
        © {new Date().getFullYear()} {SCHOOL.name} {SCHOOL.city}. Media & berkas dihosting di Cloudinary.
      </div>
    </footer>
  );
}
