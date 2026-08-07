import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SCHOOL } from "@/lib/content";

export const metadata: Metadata = {
  title: {
    default: `${SCHOOL.name} ${SCHOOL.city} — Bimbingan Baca Tulis Hitung Anak`,
    template: `%s · ${SCHOOL.name}`,
  },
  description:
    "Bimbingan belajar Calistung (baca, tulis, hitung) untuk anak usia 4-7 tahun di Palembang. Kelas kecil, guru sabar, metode bermain, plus latihan interaktif online gratis.",
  keywords: [
    "calistung palembang",
    "les baca tulis hitung anak",
    "bimbel anak palembang",
    "ya bunayya palembang",
    "persiapan masuk SD",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[var(--color-cream)] text-slate-800 antialiased">
        <SiteHeader />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
