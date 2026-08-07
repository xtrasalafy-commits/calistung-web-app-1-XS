"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { speak } from "@/lib/speak";

const HURUF_BESAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const HURUF_KECIL = "abcdefghijklmnopqrstuvwxyz".split("");
const ANGKA = "0123456789".split("");
const COLORS = ["#0f766e", "#e11d48", "#2563eb", "#f59e0b", "#7c3aed", "#111827"];

const W = 900;
const H = 520;

export default function TulisPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const history = useRef<string[]>([]);

  const [template, setTemplate] = useState<string>("A");
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(14);
  const [eraser, setEraser] = useState(false);
  const [nama, setNama] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const redrawBase = useCallback((letter: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // garis bantu buku tulis
    ctx.strokeStyle = "#d1fae5";
    ctx.lineWidth = 2;
    [H * 0.2, H * 0.5, H * 0.8].forEach((y) => {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(W - 30, y);
      ctx.stroke();
    });
    ctx.setLineDash([12, 14]);
    ctx.strokeStyle = "#fcd34d";
    ctx.beginPath();
    ctx.moveTo(30, H * 0.5);
    ctx.lineTo(W - 30, H * 0.5);
    ctx.stroke();
    ctx.setLineDash([]);

    if (letter !== "bebas") {
      ctx.font = "bold 340px 'Baloo 2', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(16,185,129,0.10)";
      ctx.fillText(letter, W / 2, H / 2 + 10);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(5,150,105,0.45)";
      ctx.setLineDash([16, 14]);
      ctx.strokeText(letter, W / 2, H / 2 + 10);
      ctx.setLineDash([]);
    }
    history.current = [canvas.toDataURL()];
  }, []);

  useEffect(() => {
    redrawBase(template);
  }, [template, redrawBase]);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    };
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.setPointerCapture(e.pointerId);
    drawing.current = true;
    if (history.current.length > 24) history.current.shift();
    history.current.push(canvas.toDataURL());
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = pos(e);
    ctx.strokeStyle = eraser ? "#ffffff" : color;
    ctx.lineWidth = eraser ? size * 2.4 : size;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function end() {
    drawing.current = false;
  }

  function undo() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || history.current.length === 0) return;
    const last = history.current.pop()!;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0);
    };
    img.src = last;
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `karya-${template}-yabunayya.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

  async function kirimKeGaleri() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (nama.trim().length < 2) {
      setStatus("Tulis nama ananda dulu ya.");
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Gagal membuat gambar."))), "image/png"),
      );
      const fd = new FormData();
      fd.append("file", new File([blob], `karya-${nama.trim()}.png`, { type: "image/png" }));
      fd.append("folder", "karya-siswa");
      const up = await fetch("/api/upload", { method: "POST", body: fd });
      const upJson = (await up.json()) as { asset?: { url: string; publicId: string; width?: number; height?: number }; error?: string };
      if (!up.ok || !upJson.asset) throw new Error(upJson.error ?? "Gagal mengunggah.");

      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Karya ${nama.trim()}`,
          caption: `Latihan menulis huruf "${template}" di Arena Menulis Ya Bunayya.`,
          tag: "Karya Siswa",
          url: upJson.asset.url,
          publicId: upJson.asset.publicId,
          width: upJson.asset.width,
          height: upJson.asset.height,
        }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan ke galeri.");
      setStatus("✅ Karya ananda berhasil dikirim ke Galeri!");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/belajar" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
          ← Arena lain
        </Link>
        <h1 className="font-display text-3xl font-extrabold text-emerald-950 sm:text-4xl">✏️ Arena Menulis</h1>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Pilih huruf, lalu tebalkan garis putus-putus dengan jari atau mouse. Karya ananda bisa
        langsung dikirim ke galeri (tersimpan di Cloudinary).
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="card-soft h-max rounded-3xl border border-emerald-100 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pilih pola</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <button
              onClick={() => setTemplate("bebas")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold ${template === "bebas" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700"}`}
            >
              Bebas
            </button>
            {[...HURUF_BESAR, ...HURUF_KECIL, ...ANGKA].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setTemplate(c);
                  speak(c);
                }}
                className={`h-8 w-8 rounded-lg text-sm font-extrabold ${template === c ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Warna pensil</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setEraser(false);
                }}
                style={{ background: c }}
                className={`h-8 w-8 rounded-full ring-offset-2 transition ${color === c && !eraser ? "ring-2 ring-emerald-500" : ""}`}
                aria-label={`Warna ${c}`}
              />
            ))}
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Ketebalan · {size}px</p>
          <input
            type="range"
            min={6}
            max={40}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="mt-2 w-full accent-emerald-600"
          />

          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              onClick={() => setEraser((v) => !v)}
              className={`rounded-xl px-3 py-2.5 text-xs font-bold ${eraser ? "bg-amber-500 text-white" : "bg-amber-50 text-amber-700"}`}
            >
              🧽 Penghapus
            </button>
            <button onClick={undo} className="rounded-xl bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-700">
              ↩️ Undo
            </button>
            <button onClick={() => redrawBase(template)} className="rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-600">
              🗑️ Bersihkan
            </button>
            <button onClick={download} className="rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700">
              ⬇️ Unduh
            </button>
          </div>
        </aside>

        <div>
          <div className="card-soft overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-xl">
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              onPointerDown={start}
              onPointerMove={move}
              onPointerUp={end}
              onPointerLeave={end}
              className="block w-full touch-none"
              style={{ aspectRatio: `${W} / ${H}` }}
            />
          </div>

          <div className="card-soft mt-4 grid gap-3 rounded-3xl border border-emerald-100 bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-display text-base font-extrabold text-emerald-900">🎨 Kirim karya ke Galeri</p>
              <p className="text-xs text-slate-500">Gambar akan diunggah dan disimpan di Cloudinary.</p>
              <input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama ananda"
                className="mt-3 w-full rounded-2xl border border-emerald-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 sm:max-w-xs"
              />
            </div>
            <button
              onClick={kirimKeGaleri}
              disabled={busy}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {busy ? "Mengirim..." : "☁️ Kirim Karya"}
            </button>
            {status ? (
              <p className={`sm:col-span-2 text-sm font-semibold ${status.startsWith("✅") ? "text-emerald-700" : "text-rose-600"}`}>
                {status}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
