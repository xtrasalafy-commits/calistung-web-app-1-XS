"use client";

let cachedVoice: SpeechSynthesisVoice | null | undefined;

function pickVoice(lang: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (cachedVoice !== undefined && cachedVoice?.lang?.startsWith(lang.slice(0, 2))) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  cachedVoice =
    voices.find((v) => v.lang?.toLowerCase().startsWith(lang.toLowerCase())) ??
    voices.find((v) => v.lang?.toLowerCase().startsWith(lang.slice(0, 2))) ??
    null;
  return cachedVoice;
}

/** Ucapkan teks memakai Web Speech API (default bahasa Indonesia). */
export function speak(text: string, lang = "id-ID", rate = 0.85) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = rate;
    utter.pitch = 1.15;
    const voice = pickVoice(lang);
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  } catch {
    /* abaikan bila browser tidak mendukung */
  }
}

/** Efek suara sederhana memakai Web Audio API (benar / salah). */
export function chime(kind: "benar" | "salah" = "benar") {
  if (typeof window === "undefined") return;
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const notes = kind === "benar" ? [523.25, 659.25, 783.99] : [311.13, 233.08];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === "benar" ? "triangle" : "sawtooth";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + i * 0.11 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.11 + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.11);
      osc.stop(ctx.currentTime + i * 0.11 + 0.24);
    });
    setTimeout(() => void ctx.close(), 900);
  } catch {
    /* abaikan */
  }
}

export function saveAttempt(payload: {
  playerName: string;
  module: string;
  level: string;
  score: number;
  total: number;
  durationSec: number;
}) {
  return fetch("/api/quiz-attempts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
