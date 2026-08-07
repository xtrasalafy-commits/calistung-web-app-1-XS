"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { PROGRAMS, SCHEDULES, SCHOOL } from "@/lib/content";
import { UploadField, type UploadedAsset } from "@/components/upload-field";

const STEPS = ["Data Ananda", "Data Orang Tua", "Program & Berkas"];

export function RegistrationForm() {
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [doc, setDoc] = useState<UploadedAsset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    childName: "",
    nickname: "",
    gender: "Ikhwan",
    birthDate: "",
    parentName: "",
    phone: "",
    email: "",
    address: "",
    program: params.get("program") ?? PROGRAMS[0].name,
    schedule: SCHEDULES[0],
    message: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function next() {
    setError(null);
    if (step === 0 && form.childName.trim().length < 2) return setError("Nama lengkap ananda wajib diisi.");
    if (step === 1) {
      if (form.parentName.trim().length < 2) return setError("Nama orang tua wajib diisi.");
      if (!/^[0-9+\-\s()]{8,20}$/.test(form.phone)) return setError("Nomor WhatsApp belum valid.");
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          documentUrl: doc?.url ?? null,
          documentPublicId: doc?.publicId ?? null,
        }),
      });
      let json: { error?: string } = {};
      try {
        json = (await res.json()) as { error?: string };
      } catch {
        // ignore JSON parse error
      }
      if (!res.ok) throw new Error(json.error ?? "Pendaftaran gagal.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pendaftaran gagal.");
    } finally {
      setBusy(false);
    }
  }

  const input =
    "w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100";
  const label = "text-xs font-bold uppercase tracking-wider text-slate-500";

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="animate-pop text-7xl">🎉</div>
        <h1 className="font-display mt-5 text-3xl font-extrabold text-emerald-900">Pendaftaran Terkirim!</h1>
        <p className="mt-3 text-slate-600">
          Terima kasih, {form.parentName}. Data ananda <strong>{form.childName}</strong> sudah kami terima.
          Admin akan menghubungi nomor {form.phone} maksimal 1×24 jam untuk penjadwalan kelas trial gratis.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${SCHOOL.whatsapp}?text=${encodeURIComponent(`Assalamualaikum, saya ${form.parentName} baru saja mendaftarkan ${form.childName} untuk program ${form.program}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white"
          >
            💬 Konfirmasi via WhatsApp
          </a>
          <Link href="/belajar" className="rounded-2xl border-2 border-emerald-200 px-6 py-3 text-sm font-bold text-emerald-700">
            🎮 Coba Belajar Seru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <span className="rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-700">
          Pendaftaran Online
        </span>
        <h1 className="font-display mt-4 text-3xl font-extrabold text-emerald-950 sm:text-4xl">
          Daftarkan Ananda Sekarang
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Gratis 1× kelas percobaan + asesmen awal. Hanya butuh 2 menit untuk mengisi.
        </p>
      </div>

      {/* Stepper */}
      <div className="mt-9 flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-9 items-center gap-2 rounded-full px-4 text-xs font-bold transition ${
                i === step ? "bg-emerald-600 text-white" : i < step ? "bg-emerald-100 text-emerald-700" : "bg-white text-slate-400"
              }`}
            >
              <span>{i < step ? "✓" : i + 1}</span>
              <span className="hidden sm:inline">{s}</span>
            </div>
            {i < STEPS.length - 1 ? <span className="h-0.5 w-4 bg-emerald-200 sm:w-8" /> : null}
          </div>
        ))}
      </div>

      <div className="card-soft mt-7 rounded-[2rem] border border-emerald-100 bg-white p-7">
        {step === 0 ? (
          <div className="grid gap-4">
            <div>
              <label className={label}>Nama lengkap ananda *</label>
              <input className={`${input} mt-1.5`} value={form.childName} onChange={(e) => set("childName", e.target.value)} placeholder="Contoh: Aisyah Humaira" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Nama panggilan</label>
                <input className={`${input} mt-1.5`} value={form.nickname} onChange={(e) => set("nickname", e.target.value)} placeholder="Aisyah" />
              </div>
              <div>
                <label className={label}>Tanggal lahir</label>
                <input type="date" className={`${input} mt-1.5`} value={form.birthDate} onChange={(e) => set("birthDate", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={label}>Jenis kelamin</label>
              <div className="mt-1.5 grid grid-cols-2 gap-3">
                {["Ikhwan", "Akhwat"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => set("gender", g)}
                    className={`rounded-2xl border-2 py-3 text-sm font-bold transition ${
                      form.gender === g ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500"
                    }`}
                  >
                    {g === "Ikhwan" ? "👦 Ikhwan" : "👧 Akhwat"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-4">
            <div>
              <label className={label}>Nama orang tua / wali *</label>
              <input className={`${input} mt-1.5`} value={form.parentName} onChange={(e) => set("parentName", e.target.value)} placeholder="Bunda / Ayah ..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Nomor WhatsApp *</label>
                <input className={`${input} mt-1.5`} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="08xx xxxx xxxx" />
              </div>
              <div>
                <label className={label}>Email (opsional)</label>
                <input type="email" className={`${input} mt-1.5`} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="nama@email.com" />
              </div>
            </div>
            <div>
              <label className={label}>Alamat domisili</label>
              <textarea rows={3} className={`${input} mt-1.5`} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Kelurahan / kecamatan di Palembang" />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-4">
            <div>
              <label className={label}>Pilih program *</label>
              <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                {PROGRAMS.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => set("program", p.name)}
                    className={`rounded-2xl border-2 p-4 text-left transition ${
                      form.program === p.name ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-emerald-200"
                    }`}
                  >
                    <span className="text-xl">{p.emoji}</span>
                    <p className="mt-1 text-sm font-bold text-emerald-900">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.age} · {p.price}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={label}>Jadwal yang diinginkan</label>
              <select className={`${input} mt-1.5`} value={form.schedule} onChange={(e) => set("schedule", e.target.value)}>
                {SCHEDULES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Berkas pendukung (KK / akta / foto ananda)</label>
              <div className="mt-1.5">
                <UploadField folder="pendaftaran" label="Unggah berkas ke Cloudinary" onUploaded={setDoc} />
              </div>
            </div>
            <div>
              <label className={label}>Catatan untuk guru</label>
              <textarea rows={3} className={`${input} mt-1.5`} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Contoh: ananda sudah kenal huruf tapi belum bisa merangkai kata." />
            </div>
          </div>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{error}</p>
        ) : null}

        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-2xl border-2 border-slate-200 px-5 py-3 text-sm font-bold text-slate-500 disabled:opacity-40"
          >
            ← Kembali
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="rounded-2xl bg-emerald-600 px-7 py-3 text-sm font-bold text-white hover:bg-emerald-700">
              Lanjut →
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={busy}
              className="bubble-shadow rounded-2xl bg-emerald-600 px-7 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {busy ? "Mengirim..." : "🚀 Kirim Pendaftaran"}
            </button>
          )}
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-slate-400">
        Dengan mendaftar, Anda setuju data digunakan untuk keperluan administrasi {SCHOOL.name}.
      </p>
    </div>
  );
}
