"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ALPHABET, HIJAIYAH, KATA_LATIHAN, KONSONAN, VOKAL } from "@/lib/content";
import { chime, saveAttempt, speak } from "@/lib/speak";

type Tab = "alfabet" | "hijaiyah" | "suku" | "kuis";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "alfabet", label: "Huruf A-Z", emoji: "🔤" },
  { id: "hijaiyah", label: "Hijaiyah", emoji: "🕌" },
  { id: "suku", label: "Suku Kata", emoji: "🧩" },
  { id: "kuis", label: "Kuis Huruf", emoji: "🎯" },
];

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeQuestions() {
  return shuffle(ALPHABET)
    .slice(0, 10)
    .map((item) => {
      const wrong = shuffle(ALPHABET.filter((a) => a.huruf !== item.huruf)).slice(0, 3);
      return { target: item, options: shuffle([item, ...wrong]) };
    });
}

export default function BacaPage() {
  const [tab, setTab] = useState<Tab>("alfabet");
  const [active, setActive] = useState<string | null>(null);

  // suku kata
  const [kons, setKons] = useState("b");
  const [vokal, setVokal] = useState("a");
  const suku = `${kons}${vokal}`;

  // kuis
  const [questions, setQuestions] = useState(makeQuestions);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [startAt, setStartAt] = useState(() => Date.now());
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const current = questions[qIndex];

  const progress = useMemo(() => ((qIndex + (finished ? 1 : 0)) / questions.length) * 100, [qIndex, finished, questions.length]);

  function answer(huruf: string) {
    if (picked) return;
    setPicked(huruf);
    const correct = huruf === current.target.huruf;
    if (correct) {
      setScore((s) => s + 1);
      chime("benar");
      speak("Hebat! Benar sekali");
    } else {
      chime("salah");
      speak(`Belum tepat, ini huruf ${current.target.huruf}`);
    }
    setTimeout(() => {
      setPicked(null);
      if (qIndex + 1 >= questions.length) setFinished(true);
      else setQIndex((i) => i + 1);
    }, 1100);
  }

  function restart() {
    setQuestions(makeQuestions());
    setQIndex(0);
    setScore(0);
    setPicked(null);
    setFinished(false);
    setSaved(false);
    setStartAt(Date.now());
  }

  async function submitScore() {
    if (name.trim().length < 2) return;
    await saveAttempt({
      playerName: name.trim(),
      module: "baca",
      level: "Level 1",
      score,
      total: questions.length,
      durationSec: Math.round((Date.now() - startAt) / 1000),
    });
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/belajar" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
          ← Arena lain
        </Link>
        <h1 className="font-display text-3xl font-extrabold text-emerald-950 sm:text-4xl">
          📖 Arena Membaca
        </h1>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Ketuk kartu untuk mendengar bunyinya. Pastikan volume perangkat sudah dinyalakan ya!
      </p>

      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
              tab === t.id ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-white text-slate-600 hover:bg-emerald-50"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {tab === "alfabet" ? (
        <div className="mt-7 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {ALPHABET.map((a) => (
            <button
              key={a.huruf}
              onClick={() => {
                setActive(a.huruf);
                speak(`${a.huruf}. ${a.kata}`);
              }}
              className={`card-soft rounded-3xl border-2 bg-white p-4 text-center transition hover:-translate-y-1 ${
                active === a.huruf ? "border-emerald-400 bg-emerald-50" : "border-transparent"
              }`}
            >
              <div className="font-display text-4xl font-extrabold text-emerald-700">
                {a.huruf}
                <span className="text-2xl text-emerald-400">{a.huruf.toLowerCase()}</span>
              </div>
              <div className="mt-1 text-2xl">{a.emoji}</div>
              <div className="mt-1 text-xs font-bold text-slate-500">{a.kata}</div>
            </button>
          ))}
        </div>
      ) : null}

      {tab === "hijaiyah" ? (
        <div className="mt-7 grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
          {HIJAIYAH.map((h) => (
            <button
              key={h.nama}
              onClick={() => {
                setActive(h.nama);
                speak(h.nama);
              }}
              className={`card-soft rounded-3xl border-2 bg-white p-4 text-center transition hover:-translate-y-1 ${
                active === h.nama ? "border-sky-400 bg-sky-50" : "border-transparent"
              }`}
            >
              <div className="text-4xl text-sky-700">{h.huruf}</div>
              <div className="mt-2 text-xs font-bold text-slate-500">{h.nama}</div>
            </button>
          ))}
        </div>
      ) : null}

      {tab === "suku" ? (
        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="card-soft rounded-3xl border border-emerald-100 bg-white p-6">
            <h2 className="font-display text-xl font-extrabold text-emerald-900">🧩 Susun Suku Kata</h2>
            <div className="mt-5 grid place-items-center rounded-3xl bg-emerald-50 py-8">
              <p className="font-display text-6xl font-extrabold tracking-wide text-emerald-700">{suku}</p>
              <button
                onClick={() => speak(suku)}
                className="mt-4 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white"
              >
                🔊 Dengarkan
              </button>
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Konsonan</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {KONSONAN.map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    setKons(k);
                    speak(`${k}${vokal}`);
                  }}
                  className={`h-10 w-10 rounded-xl text-sm font-extrabold uppercase transition ${
                    kons === k ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Vokal</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {VOKAL.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setVokal(v);
                    speak(`${kons}${v}`);
                  }}
                  className={`h-10 w-10 rounded-xl text-sm font-extrabold uppercase transition ${
                    vokal === v ? "bg-amber-500 text-white" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="card-soft rounded-3xl border border-emerald-100 bg-white p-6">
            <h2 className="font-display text-xl font-extrabold text-emerald-900">📚 Latihan Kata</h2>
            <p className="mt-1 text-sm text-slate-500">Ketuk kata untuk mendengar cara membacanya.</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {KATA_LATIHAN.map((k) => (
                <button
                  key={k.full}
                  onClick={() => speak(k.kata.replace(/-/g, " "), "id-ID", 0.7)}
                  className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-left transition hover:bg-emerald-100"
                >
                  <span className="text-2xl">{k.emoji}</span>
                  <span>
                    <span className="font-display block text-lg font-extrabold text-emerald-800">{k.full}</span>
                    <span className="text-xs text-slate-500">{k.kata}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {tab === "kuis" ? (
        <div className="mt-7">
          {!finished ? (
            <div className="card-soft rounded-[2rem] border border-emerald-100 bg-white p-7">
              <div className="flex items-center justify-between text-sm font-bold text-slate-500">
                <span>Soal {qIndex + 1} / {questions.length}</span>
                <span>⭐ {score}</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-emerald-100">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-amber-600">Mana huruf awal dari</p>
                <p className="mt-3 text-6xl">{current.target.emoji}</p>
                <p className="font-display mt-2 text-2xl font-extrabold text-emerald-900">{current.target.kata}</p>
                <button
                  onClick={() => speak(current.target.kata)}
                  className="mt-3 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700"
                >
                  🔊 Dengar lagi
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {current.options.map((o) => {
                  const isTarget = o.huruf === current.target.huruf;
                  const state = picked
                    ? isTarget
                      ? "border-emerald-500 bg-emerald-50"
                      : picked === o.huruf
                        ? "border-rose-400 bg-rose-50"
                        : "border-transparent opacity-50"
                    : "border-transparent hover:border-emerald-300";
                  return (
                    <button
                      key={o.huruf}
                      onClick={() => answer(o.huruf)}
                      className={`font-display rounded-3xl border-2 bg-white py-7 text-4xl font-extrabold text-emerald-700 shadow-sm transition ${state}`}
                    >
                      {o.huruf}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="card-soft rounded-[2rem] border border-emerald-100 bg-white p-9 text-center">
              <div className="animate-pop text-6xl">{score >= 8 ? "🏆" : score >= 5 ? "🎉" : "💪"}</div>
              <h2 className="font-display mt-4 text-3xl font-extrabold text-emerald-900">
                Skor kamu {score} / {questions.length}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {score >= 8 ? "Masya Allah, hebat sekali!" : score >= 5 ? "Bagus! Sedikit lagi sempurna." : "Ayo coba lagi, pasti bisa!"}
              </p>

              {!saved ? (
                <div className="mx-auto mt-6 flex max-w-sm flex-col gap-2 sm:flex-row">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tulis namamu"
                    className="flex-1 rounded-2xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
                  />
                  <button onClick={submitScore} className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-bold text-white">
                    Simpan Bintang
                  </button>
                </div>
              ) : (
                <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                  ✅ Bintangmu tersimpan di Papan Bintang!
                </p>
              )}

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button onClick={restart} className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white">
                  🔁 Main lagi
                </button>
                <Link href="/peringkat" className="rounded-2xl border-2 border-emerald-200 px-6 py-3 text-sm font-bold text-emerald-700">
                  🏆 Papan Bintang
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
