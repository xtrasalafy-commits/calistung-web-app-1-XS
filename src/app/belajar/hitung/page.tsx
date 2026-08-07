"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ANGKA } from "@/lib/content";
import { chime, saveAttempt, speak } from "@/lib/speak";

type Level = "Level 1" | "Level 2" | "Level 3";

type Soal = {
  teks: string;
  jawab: number;
  opsi: number[];
  visual?: string;
};

const LEVELS: { id: Level; label: string; desc: string; emoji: string }[] = [
  { id: "Level 1", label: "Mudah", desc: "Penjumlahan sampai 10 (bergambar)", emoji: "🍎" },
  { id: "Level 2", label: "Sedang", desc: "Tambah & kurang sampai 20", emoji: "🧮" },
  { id: "Level 3", label: "Mahir", desc: "Sampai 100 & perkalian dasar", emoji: "🚀" },
];

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

function buatSoal(level: Level): Soal {
  let teks = "";
  let jawab = 0;
  let visual: string | undefined;

  if (level === "Level 1") {
    const a = rnd(1, 5);
    const b = rnd(1, 5);
    teks = `${a} + ${b} = ?`;
    jawab = a + b;
    visual = `${"🍎".repeat(a)}  ➕  ${"🍏".repeat(b)}`;
  } else if (level === "Level 2") {
    if (Math.random() > 0.5) {
      const a = rnd(3, 12);
      const b = rnd(1, 8);
      teks = `${a} + ${b} = ?`;
      jawab = a + b;
    } else {
      const a = rnd(6, 20);
      const b = rnd(1, a - 1);
      teks = `${a} − ${b} = ?`;
      jawab = a - b;
    }
  } else {
    const mode = rnd(1, 3);
    if (mode === 1) {
      const a = rnd(10, 60);
      const b = rnd(5, 39);
      teks = `${a} + ${b} = ?`;
      jawab = a + b;
    } else if (mode === 2) {
      const a = rnd(30, 99);
      const b = rnd(5, 29);
      teks = `${a} − ${b} = ?`;
      jawab = a - b;
    } else {
      const a = rnd(2, 5);
      const b = rnd(2, 9);
      teks = `${a} × ${b} = ?`;
      jawab = a * b;
    }
  }

  const set = new Set<number>([jawab]);
  while (set.size < 4) {
    const delta = rnd(1, Math.max(3, Math.round(jawab * 0.3)));
    const cand = Math.random() > 0.5 ? jawab + delta : jawab - delta;
    if (cand >= 0) set.add(cand);
  }

  return { teks, jawab, opsi: shuffle([...set]), visual };
}

export default function HitungPage() {
  const [level, setLevel] = useState<Level>("Level 1");
  const [soalList, setSoalList] = useState<Soal[]>(() => Array.from({ length: 10 }, () => buatSoal("Level 1")));
  const [idx, setIdx] = useState(0);
  const [skor, setSkor] = useState(0);
  const [streak, setStreak] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [selesai, setSelesai] = useState(false);
  const [detik, setDetik] = useState(0);
  const [main, setMain] = useState(false);
  const [nama, setNama] = useState("");
  const [tersimpan, setTersimpan] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (main && !selesai) {
      timer.current = setInterval(() => setDetik((d) => d + 1), 1000);
      return () => {
        if (timer.current) clearInterval(timer.current);
      };
    }
    if (timer.current) clearInterval(timer.current);
    return undefined;
  }, [main, selesai]);

  const soal = soalList[idx];
  const persen = useMemo(() => (idx / soalList.length) * 100, [idx, soalList.length]);

  function mulai(l: Level) {
    setLevel(l);
    setSoalList(Array.from({ length: 10 }, () => buatSoal(l)));
    setIdx(0);
    setSkor(0);
    setStreak(0);
    setPicked(null);
    setSelesai(false);
    setDetik(0);
    setTersimpan(false);
    setMain(true);
  }

  function jawab(n: number) {
    if (picked !== null) return;
    setPicked(n);
    if (n === soal.jawab) {
      setSkor((s) => s + 1);
      setStreak((s) => s + 1);
      chime("benar");
      speak("Benar!");
    } else {
      setStreak(0);
      chime("salah");
      speak(`Jawaban yang benar ${soal.jawab}`);
    }
    setTimeout(() => {
      setPicked(null);
      if (idx + 1 >= soalList.length) setSelesai(true);
      else setIdx((i) => i + 1);
    }, 1000);
  }

  async function simpan() {
    if (nama.trim().length < 2) return;
    await saveAttempt({
      playerName: nama.trim(),
      module: "hitung",
      level,
      score: skor,
      total: soalList.length,
      durationSec: detik,
    });
    setTersimpan(true);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/belajar" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
          ← Arena lain
        </Link>
        <h1 className="font-display text-3xl font-extrabold text-emerald-950 sm:text-4xl">🔢 Arena Berhitung</h1>
      </div>

      {/* Kenal angka */}
      <div className="card-soft mt-6 rounded-3xl border border-emerald-100 bg-white p-6">
        <h2 className="font-display text-lg font-extrabold text-emerald-900">👋 Kenal Angka 1–10</h2>
        <p className="text-sm text-slate-500">Ketuk angka untuk mendengar namanya.</p>
        <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
          {ANGKA.map((a) => (
            <button
              key={a.n}
              onClick={() => speak(`${a.n}, ${a.nama}`)}
              className="rounded-2xl bg-amber-50 py-3 text-center transition hover:bg-amber-100"
            >
              <span className="font-display block text-2xl font-extrabold text-amber-600">{a.n}</span>
              <span className="text-[10px] font-bold text-slate-500">{a.nama}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Kuis */}
      {!main ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => mulai(l.id)}
              className="card-soft rounded-3xl border-2 border-transparent bg-white p-6 text-left transition hover:-translate-y-1 hover:border-emerald-300"
            >
              <div className="text-3xl">{l.emoji}</div>
              <p className="font-display mt-3 text-xl font-extrabold text-emerald-900">{l.id}</p>
              <p className="text-xs font-bold uppercase tracking-wide text-amber-600">{l.label}</p>
              <p className="mt-2 text-sm text-slate-600">{l.desc}</p>
              <span className="mt-4 inline-block rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                Mulai 10 soal →
              </span>
            </button>
          ))}
        </div>
      ) : !selesai ? (
        <div className="card-soft mt-6 rounded-[2rem] border border-emerald-100 bg-white p-7">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-slate-500">
            <span>{level} · Soal {idx + 1}/{soalList.length}</span>
            <span className="flex items-center gap-3">
              <span>⏱️ {detik}s</span>
              <span>⭐ {skor}</span>
              {streak >= 3 ? <span className="rounded-full bg-orange-100 px-2 py-0.5 text-orange-600">🔥 {streak} beruntun</span> : null}
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-emerald-100">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${persen}%` }} />
          </div>

          <div className="mt-8 text-center">
            {soal.visual ? <p className="mb-4 text-2xl leading-relaxed sm:text-3xl">{soal.visual}</p> : null}
            <p className="font-display text-5xl font-extrabold text-emerald-800 sm:text-6xl">{soal.teks}</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {soal.opsi.map((o) => {
              const benar = o === soal.jawab;
              const state = picked !== null
                ? benar
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : picked === o
                    ? "border-rose-400 bg-rose-50 text-rose-600"
                    : "border-transparent opacity-50"
                : "border-transparent hover:border-emerald-300";
              return (
                <button
                  key={o}
                  onClick={() => jawab(o)}
                  className={`font-display rounded-3xl border-2 bg-white py-6 text-3xl font-extrabold text-emerald-700 shadow-sm transition ${state}`}
                >
                  {o}
                </button>
              );
            })}
          </div>

          <button onClick={() => setMain(false)} className="mt-6 text-xs font-bold text-slate-400 underline">
            Ganti tingkat kesulitan
          </button>
        </div>
      ) : (
        <div className="card-soft mt-6 rounded-[2rem] border border-emerald-100 bg-white p-9 text-center">
          <div className="animate-pop text-6xl">{skor >= 9 ? "🏆" : skor >= 6 ? "🎉" : "💪"}</div>
          <h2 className="font-display mt-4 text-3xl font-extrabold text-emerald-900">
            {skor} / {soalList.length} benar
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {level} · selesai dalam {detik} detik
          </p>

          {!tersimpan ? (
            <div className="mx-auto mt-6 flex max-w-sm flex-col gap-2 sm:flex-row">
              <input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Tulis namamu"
                className="flex-1 rounded-2xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
              />
              <button onClick={simpan} className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-bold text-white">
                Simpan Bintang
              </button>
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              ✅ Bintangmu tersimpan di Papan Bintang!
            </p>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => mulai(level)} className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white">
              🔁 Ulangi {level}
            </button>
            <button onClick={() => setMain(false)} className="rounded-2xl border-2 border-emerald-200 px-6 py-3 text-sm font-bold text-emerald-700">
              🎚️ Ganti level
            </button>
            <Link href="/peringkat" className="rounded-2xl border-2 border-amber-200 px-6 py-3 text-sm font-bold text-amber-700">
              🏆 Papan Bintang
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
