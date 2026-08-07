"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SCHOOL } from "@/lib/content";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/program", label: "Program" },
  { href: "/belajar", label: "Belajar Seru" },
  { href: "/materi", label: "Materi" },
  { href: "/galeri", label: "Galeri" },
  { href: "/peringkat", label: "Papan Bintang" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:h-[72px]">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-xl shadow-md shadow-emerald-200">
            📚
          </span>
          <span className="leading-tight">
            <span className="font-display block text-lg font-extrabold text-emerald-800">
              Ya Bunayya
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-500">
              Calistung {SCHOOL.city}
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                isActive(item.href)
                  ? "bg-emerald-100 text-emerald-800"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/daftar"
            className="ml-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-200 transition hover:brightness-105"
          >
            Daftar Sekarang
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
          className="ml-auto grid h-11 w-11 place-items-center rounded-xl border border-emerald-200 text-emerald-700 lg:hidden"
        >
          <span className="text-lg">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-emerald-100 bg-white px-4 pb-4 pt-2 lg:hidden">
          <div className="grid gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  isActive(item.href) ? "bg-emerald-100 text-emerald-800" : "text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/daftar"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-3 text-center text-sm font-bold text-white"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
