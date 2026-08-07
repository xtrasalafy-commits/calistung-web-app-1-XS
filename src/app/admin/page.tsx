"use client";

import { useCallback, useEffect, useState } from "react";
import { UploadField, type UploadedAsset } from "@/components/upload-field";
import { LEVELS, MATERIAL_CATEGORIES, PROGRAMS } from "@/lib/content";
import { formatBytes, formatDate } from "@/components/ui";

type Registration = {
  id: number; childName: string; nickname: string | null; gender: string; birthDate: string | null;
  parentName: string; phone: string; email: string | null; address: string | null; program: string;
  schedule: string; message: string | null; documentUrl: string | null; status: string; createdAt: string;
};
type Student = {
  id: number; name: string; nickname: string | null; gender: string; age: number | null; parentName: string | null;
  phone: string | null; program: string; level: string; photoUrl: string | null; progressBaca: number;
  progressTulis: number; progressHitung: number; status: string; notes: string | null; createdAt: string;
};
type Material = {
  id: number; title: string; description: string | null; category: string; level: string; kind: string;
  url: string; format: string | null; bytes: number | null; downloads: number; createdAt: string;
};
type Gallery = { id: number; title: string; caption: string | null; tag: string; url: string; createdAt: string };
type Teacher = { id: number; name: string; role: string; bio: string | null; photoUrl: string | null; sortOrder: number };
type Msg = { id: number; name: string; phone: string | null; body: string; createdAt: string };
type Stats = {
  registrations: number; newRegistrations: number; students: number; materials: number;
  gallery: number; messages: number; attempts: number; storageBytes: number;
};

const TABS = [
  { id: "ringkasan", label: "Ringkasan", emoji: "📊" },
  { id: "pendaftaran", label: "Pendaftaran", emoji: "📝" },
  { id: "siswa", label: "Siswa", emoji: "🧒" },
  { id: "materi", label: "Materi", emoji: "📚" },
  { id: "galeri", label: "Galeri", emoji: "🖼️" },
  { id: "pengajar", label: "Pengajar", emoji: "👩‍🏫" },
  { id: "pesan", label: "Pesan", emoji: "💌" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STATUSES = ["baru", "dihubungi", "diterima", "ditolak"];
const STATUS_STYLE: Record<string, string> = {
  baru: "bg-amber-100 text-amber-700",
  dihubungi: "bg-sky-100 text-sky-700",
  diterima: "bg-emerald-100 text-emerald-700",
  ditolak: "bg-rose-100 text-rose-700",
};

const input =
  "w-full rounded-xl border border-emerald-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-emerald-400";
const card = "card-soft rounded-3xl border border-emerald-100 bg-white p-6";

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  let data: T & { error?: string } = {} as T & { error?: string };
  try {
    data = (await res.json()) as T & { error?: string };
  } catch {
    // ignore JSON parse error
  }
  if (!res.ok) throw new Error(data.error ?? "Terjadi kesalahan.");
  return data;
}

export default function AdminPage() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("ringkasan");

  const [stats, setStats] = useState<Stats | null>(null);
  const [regs, setRegs] = useState<Registration[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    try {
      const [s, r, st, m, g, t, ms] = await Promise.all([
        jsonFetch<{ data: Stats }>("/api/stats"),
        jsonFetch<{ data: Registration[] }>("/api/registrations"),
        jsonFetch<{ data: Student[] }>("/api/students"),
        jsonFetch<{ data: Material[] }>("/api/materials"),
        jsonFetch<{ data: Gallery[] }>("/api/gallery"),
        jsonFetch<{ data: Teacher[] }>("/api/teachers"),
        jsonFetch<{ data: Msg[] }>("/api/messages"),
      ]);
      setStats(s.data); setRegs(r.data); setStudents(st.data); setMaterials(m.data);
      setGallery(g.data); setTeachers(t.data); setMsgs(ms.data);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Gagal memuat data.");
    }
  }, []);

  useEffect(() => {
    void jsonFetch<{ authenticated: boolean }>("/api/admin/session")
      .then(async (r) => {
        setAuth(r.authenticated);
        if (r.authenticated) await loadAll();
      })
      .catch(() => setAuth(false));
  }, [loadAll]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    try {
      await jsonFetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      setAuth(true);
      await loadAll();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Gagal masuk.");
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuth(false);
  }

  function flash(text: string) {
    setNotice(text);
    setTimeout(() => setNotice(null), 3500);
  }

  /* ---------- forms state ---------- */
  const [mat, setMat] = useState({ title: "", description: "", category: "baca", level: LEVELS[0] });
  const [matAsset, setMatAsset] = useState<UploadedAsset | null>(null);
  const [gal, setGal] = useState({ title: "", caption: "", tag: "Kegiatan" });
  const [galAsset, setGalAsset] = useState<UploadedAsset | null>(null);
  const [stu, setStu] = useState({ name: "", nickname: "", gender: "Ikhwan", age: "", parentName: "", phone: "", program: PROGRAMS[0].name, level: LEVELS[0] });
  const [stuAsset, setStuAsset] = useState<UploadedAsset | null>(null);
  const [tea, setTea] = useState({ name: "", role: "Guru Calistung", bio: "" });
  const [teaAsset, setTeaAsset] = useState<UploadedAsset | null>(null);

  if (auth === null) {
    return <div className="grid min-h-[60vh] place-items-center text-slate-400">Memuat panel...</div>;
  }

  if (!auth) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4">
        <form onSubmit={login} className={`${card} w-full text-center`}>
          <div className="text-5xl">🔐</div>
          <h1 className="font-display mt-3 text-2xl font-extrabold text-emerald-900">Panel Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Masuk untuk mengelola data Ya Bunayya.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kata sandi admin"
            className={`${input} mt-5 text-center`}
          />
          {loginError ? <p className="mt-2 text-sm font-semibold text-rose-600">{loginError}</p> : null}
          <button type="submit" className="mt-4 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700">
            Masuk
          </button>
          <p className="mt-4 text-xs text-slate-400">Sandi bawaan: yabunayya2026</p>
        </form>
      </div>
    );
  }

  const statCards = stats
    ? [
        { label: "Pendaftar", value: stats.registrations, sub: `${stats.newRegistrations} baru`, emoji: "📝", color: "bg-amber-50 text-amber-700" },
        { label: "Siswa Aktif", value: stats.students, sub: "terdaftar", emoji: "🧒", color: "bg-emerald-50 text-emerald-700" },
        { label: "Materi", value: stats.materials, sub: formatBytes(stats.storageBytes) + " di Cloudinary", emoji: "📚", color: "bg-sky-50 text-sky-700" },
        { label: "Foto Galeri", value: stats.gallery, sub: "media", emoji: "🖼️", color: "bg-violet-50 text-violet-700" },
        { label: "Latihan Kuis", value: stats.attempts, sub: "percobaan", emoji: "🎯", color: "bg-rose-50 text-rose-700" },
        { label: "Pesan Masuk", value: stats.messages, sub: "dari orang tua", emoji: "💌", color: "bg-teal-50 text-teal-700" },
      ]
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-emerald-950">🛠️ Panel Admin</h1>
          <p className="text-sm text-slate-500">Kelola pendaftaran, siswa, materi, dan media Cloudinary.</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => void loadAll()} className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 shadow-sm">
            🔄 Muat ulang
          </button>
          <button onClick={logout} className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600">
            Keluar
          </button>
        </div>
      </div>

      {notice ? (
        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</p>
      ) : null}

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

      {/* RINGKASAN */}
      {tab === "ringkasan" ? (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((s) => (
              <div key={s.label} className={card}>
                <div className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${s.color}`}>{s.emoji}</div>
                <p className="font-display mt-4 text-3xl font-extrabold text-emerald-900">{s.value}</p>
                <p className="text-sm font-bold text-slate-600">{s.label}</p>
                <p className="text-xs text-slate-400">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className={card}>
            <h2 className="font-display text-lg font-extrabold text-emerald-900">Pendaftar Terbaru</h2>
            <div className="mt-4 space-y-2">
              {regs.slice(0, 5).map((r) => (
                <div key={r.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-emerald-50/60 px-4 py-3">
                  <span className="text-xl">{r.gender === "Akhwat" ? "👧" : "👦"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-emerald-900">{r.childName}</p>
                    <p className="truncate text-xs text-slate-500">{r.program} · {r.parentName} · {r.phone}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                </div>
              ))}
              {regs.length === 0 ? <p className="text-sm text-slate-400">Belum ada pendaftar.</p> : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* PENDAFTARAN */}
      {tab === "pendaftaran" ? (
        <div className="mt-6 space-y-3">
          {regs.map((r) => (
            <div key={r.id} className={card}>
              <div className="flex flex-wrap items-start gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-2xl">
                  {r.gender === "Akhwat" ? "👧" : "👦"}
                </span>
                <div className="min-w-[200px] flex-1">
                  <p className="font-display text-lg font-extrabold text-emerald-900">
                    {r.childName} {r.nickname ? <span className="text-sm font-medium text-slate-400">({r.nickname})</span> : null}
                  </p>
                  <p className="text-sm text-slate-600">
                    {r.program} · {r.schedule}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    👤 {r.parentName} · 📞 {r.phone} {r.email ? `· ✉️ ${r.email}` : ""}
                  </p>
                  {r.address ? <p className="text-xs text-slate-400">📍 {r.address}</p> : null}
                  {r.message ? <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">💬 {r.message}</p> : null}
                  <p className="mt-2 text-[11px] text-slate-400">Didaftarkan {formatDate(r.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select
                    value={r.status}
                    onChange={async (e) => {
                      const status = e.target.value;
                      await jsonFetch(`/api/registrations/${r.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status }),
                      });
                      flash(`Status ${r.childName} diperbarui.`);
                      void loadAll();
                    }}
                    className={`rounded-xl px-3 py-2 text-xs font-bold ${STATUS_STYLE[r.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {r.documentUrl ? (
                    <a href={r.documentUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-600 underline">
                      📎 Lihat berkas
                    </a>
                  ) : null}
                  <a href={`https://wa.me/${r.phone.replace(/\D/g, "").replace(/^0/, "62")}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-600">
                    💬 WhatsApp
                  </a>
                  <button
                    onClick={async () => {
                      await fetch(`/api/registrations/${r.id}`, { method: "DELETE" });
                      flash("Pendaftaran dihapus.");
                      void loadAll();
                    }}
                    className="text-xs font-bold text-rose-500"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
          {regs.length === 0 ? <p className="text-sm text-slate-400">Belum ada pendaftar.</p> : null}
        </div>
      ) : null}

      {/* SISWA */}
      {tab === "siswa" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className={`${card} h-max`}>
            <h2 className="font-display text-lg font-extrabold text-emerald-900">➕ Tambah Siswa</h2>
            <div className="mt-4 grid gap-3">
              <input className={input} placeholder="Nama lengkap" value={stu.name} onChange={(e) => setStu({ ...stu, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input className={input} placeholder="Panggilan" value={stu.nickname} onChange={(e) => setStu({ ...stu, nickname: e.target.value })} />
                <input className={input} placeholder="Usia" type="number" value={stu.age} onChange={(e) => setStu({ ...stu, age: e.target.value })} />
              </div>
              <select className={input} value={stu.gender} onChange={(e) => setStu({ ...stu, gender: e.target.value })}>
                <option>Ikhwan</option>
                <option>Akhwat</option>
              </select>
              <input className={input} placeholder="Nama orang tua" value={stu.parentName} onChange={(e) => setStu({ ...stu, parentName: e.target.value })} />
              <input className={input} placeholder="No. WhatsApp" value={stu.phone} onChange={(e) => setStu({ ...stu, phone: e.target.value })} />
              <select className={input} value={stu.program} onChange={(e) => setStu({ ...stu, program: e.target.value })}>
                {PROGRAMS.map((p) => <option key={p.slug}>{p.name}</option>)}
              </select>
              <select className={input} value={stu.level} onChange={(e) => setStu({ ...stu, level: e.target.value })}>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
              <UploadField folder="siswa" label="Foto siswa" accept="image/*" hint="JPG / PNG" onUploaded={setStuAsset} />
              <button
                onClick={async () => {
                  if (stu.name.trim().length < 2) return flash("Nama siswa wajib diisi.");
                  await jsonFetch("/api/students", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...stu, photoUrl: stuAsset?.url, photoPublicId: stuAsset?.publicId }),
                  });
                  setStu({ ...stu, name: "", nickname: "", age: "", parentName: "", phone: "" });
                  setStuAsset(null);
                  flash("Siswa ditambahkan.");
                  void loadAll();
                }}
                className="rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white"
              >
                Simpan Siswa
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {students.map((s) => (
              <div key={s.id} className={card}>
                <div className="flex flex-wrap items-center gap-4">
                  {s.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.photoUrl} alt={s.name} className="h-14 w-14 rounded-2xl object-cover" />
                  ) : (
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-2xl">
                      {s.gender === "Akhwat" ? "👧" : "👦"}
                    </span>
                  )}
                  <div className="min-w-[180px] flex-1">
                    <p className="font-display text-lg font-extrabold text-emerald-900">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.program} · {s.level} {s.age ? `· ${s.age} th` : ""}</p>
                    <p className="text-xs text-slate-400">{s.parentName} {s.phone ? `· ${s.phone}` : ""}</p>
                  </div>
                  <button
                    onClick={async () => {
                      await fetch(`/api/students/${s.id}`, { method: "DELETE" });
                      flash("Data siswa dihapus.");
                      void loadAll();
                    }}
                    className="text-xs font-bold text-rose-500"
                  >
                    🗑️ Hapus
                  </button>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {([
                    ["progressBaca", "📖 Baca", s.progressBaca, "bg-rose-500"],
                    ["progressTulis", "✏️ Tulis", s.progressTulis, "bg-emerald-500"],
                    ["progressHitung", "🔢 Hitung", s.progressHitung, "bg-amber-500"],
                  ] as const).map(([key, label, val, color]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>{label}</span>
                        <span>{val}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full ${color}`} style={{ width: `${val}%` }} />
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        defaultValue={val}
                        onPointerUp={async (e) => {
                          const v = Number((e.target as HTMLInputElement).value);
                          await jsonFetch(`/api/students/${s.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ [key]: v }),
                          });
                          flash(`Progres ${s.name} diperbarui.`);
                          void loadAll();
                        }}
                        className="mt-1 w-full accent-emerald-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {students.length === 0 ? <p className="text-sm text-slate-400">Belum ada siswa.</p> : null}
          </div>
        </div>
      ) : null}

      {/* MATERI */}
      {tab === "materi" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className={`${card} h-max`}>
            <h2 className="font-display text-lg font-extrabold text-emerald-900">☁️ Unggah Materi</h2>
            <div className="mt-4 grid gap-3">
              <input className={input} placeholder="Judul materi" value={mat.title} onChange={(e) => setMat({ ...mat, title: e.target.value })} />
              <textarea className={input} rows={3} placeholder="Deskripsi singkat" value={mat.description} onChange={(e) => setMat({ ...mat, description: e.target.value })} />
              <select className={input} value={mat.category} onChange={(e) => setMat({ ...mat, category: e.target.value })}>
                {MATERIAL_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
              </select>
              <select className={input} value={mat.level} onChange={(e) => setMat({ ...mat, level: e.target.value })}>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
              <UploadField folder="materi" label="Pilih berkas materi" onUploaded={setMatAsset} />
              <button
                onClick={async () => {
                  if (!mat.title.trim() || !matAsset) return flash("Judul & berkas wajib diisi.");
                  const kind = matAsset.resourceType === "video" ? "video" : matAsset.format === "pdf" ? "pdf" : "image";
                  await jsonFetch("/api/materials", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      ...mat, kind, url: matAsset.url, publicId: matAsset.publicId,
                      format: matAsset.format, bytes: matAsset.bytes,
                    }),
                  });
                  setMat({ title: "", description: "", category: "baca", level: LEVELS[0] });
                  setMatAsset(null);
                  flash("Materi berhasil ditambahkan.");
                  void loadAll();
                }}
                className="rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white"
              >
                Simpan Materi
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {materials.map((m) => (
              <div key={m.id} className={`${card} flex flex-wrap items-center gap-4`}>
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-2xl">
                  {m.kind === "video" ? "🎬" : m.kind === "pdf" ? "📄" : "🖼️"}
                </span>
                <div className="min-w-[180px] flex-1">
                  <p className="font-display text-base font-extrabold text-emerald-900">{m.title}</p>
                  <p className="text-xs text-slate-500">{m.description}</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {m.category} · {m.level} · {formatBytes(m.bytes)} · ⬇ {m.downloads} · {formatDate(m.createdAt)}
                  </p>
                </div>
                <a href={m.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-600 underline">Buka</a>
                <button
                  onClick={async () => {
                    await fetch(`/api/materials/${m.id}`, { method: "DELETE" });
                    flash("Materi dihapus dari database & Cloudinary.");
                    void loadAll();
                  }}
                  className="text-xs font-bold text-rose-500"
                >
                  🗑️ Hapus
                </button>
              </div>
            ))}
            {materials.length === 0 ? <p className="text-sm text-slate-400">Belum ada materi.</p> : null}
          </div>
        </div>
      ) : null}

      {/* GALERI */}
      {tab === "galeri" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className={`${card} h-max`}>
            <h2 className="font-display text-lg font-extrabold text-emerald-900">🖼️ Tambah Foto</h2>
            <div className="mt-4 grid gap-3">
              <input className={input} placeholder="Judul foto" value={gal.title} onChange={(e) => setGal({ ...gal, title: e.target.value })} />
              <textarea className={input} rows={2} placeholder="Keterangan" value={gal.caption} onChange={(e) => setGal({ ...gal, caption: e.target.value })} />
              <select className={input} value={gal.tag} onChange={(e) => setGal({ ...gal, tag: e.target.value })}>
                {["Kegiatan", "Prestasi", "Fasilitas", "Menulis", "Berhitung", "Karya Siswa"].map((t) => <option key={t}>{t}</option>)}
              </select>
              <UploadField folder="galeri" label="Pilih foto" accept="image/*" hint="JPG / PNG · maks 15 MB" onUploaded={setGalAsset} />
              <button
                onClick={async () => {
                  if (!galAsset) return flash("Foto wajib diunggah.");
                  await jsonFetch("/api/gallery", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      ...gal, url: galAsset.url, publicId: galAsset.publicId,
                      width: galAsset.width, height: galAsset.height,
                    }),
                  });
                  setGal({ title: "", caption: "", tag: "Kegiatan" });
                  setGalAsset(null);
                  flash("Foto ditambahkan ke galeri.");
                  void loadAll();
                }}
                className="rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white"
              >
                Simpan Foto
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {gallery.map((g) => (
              <div key={g.id} className="card-soft overflow-hidden rounded-3xl border border-emerald-100 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.url} alt={g.title} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <p className="text-sm font-bold text-emerald-900">{g.title}</p>
                  <p className="text-[11px] text-slate-400">{g.tag} · {formatDate(g.createdAt)}</p>
                  <button
                    onClick={async () => {
                      await fetch(`/api/gallery/${g.id}`, { method: "DELETE" });
                      flash("Foto dihapus.");
                      void loadAll();
                    }}
                    className="mt-2 text-xs font-bold text-rose-500"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            ))}
            {gallery.length === 0 ? <p className="text-sm text-slate-400">Belum ada foto.</p> : null}
          </div>
        </div>
      ) : null}

      {/* PENGAJAR */}
      {tab === "pengajar" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className={`${card} h-max`}>
            <h2 className="font-display text-lg font-extrabold text-emerald-900">👩‍🏫 Tambah Pengajar</h2>
            <div className="mt-4 grid gap-3">
              <input className={input} placeholder="Nama pengajar" value={tea.name} onChange={(e) => setTea({ ...tea, name: e.target.value })} />
              <input className={input} placeholder="Peran / jabatan" value={tea.role} onChange={(e) => setTea({ ...tea, role: e.target.value })} />
              <textarea className={input} rows={3} placeholder="Bio singkat" value={tea.bio} onChange={(e) => setTea({ ...tea, bio: e.target.value })} />
              <UploadField folder="pengajar" label="Foto pengajar" accept="image/*" hint="JPG / PNG" onUploaded={setTeaAsset} />
              <button
                onClick={async () => {
                  if (tea.name.trim().length < 2) return flash("Nama pengajar wajib diisi.");
                  await jsonFetch("/api/teachers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...tea, photoUrl: teaAsset?.url, photoPublicId: teaAsset?.publicId, sortOrder: teachers.length + 1 }),
                  });
                  setTea({ name: "", role: "Guru Calistung", bio: "" });
                  setTeaAsset(null);
                  flash("Pengajar ditambahkan.");
                  void loadAll();
                }}
                className="rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white"
              >
                Simpan Pengajar
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {teachers.map((t) => (
              <div key={t.id} className={`${card} flex items-center gap-4`}>
                {t.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.photoUrl} alt={t.name} className="h-16 w-16 rounded-2xl object-cover" />
                ) : (
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-2xl">🧕</span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-emerald-900">{t.name}</p>
                  <p className="text-xs text-amber-600">{t.role}</p>
                  <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">{t.bio}</p>
                </div>
                <button
                  onClick={async () => {
                    await fetch(`/api/teachers/${t.id}`, { method: "DELETE" });
                    flash("Pengajar dihapus.");
                    void loadAll();
                  }}
                  className="text-xs font-bold text-rose-500"
                >
                  🗑️
                </button>
              </div>
            ))}
            {teachers.length === 0 ? <p className="text-sm text-slate-400">Belum ada pengajar.</p> : null}
          </div>
        </div>
      ) : null}

      {/* PESAN */}
      {tab === "pesan" ? (
        <div className="mt-6 space-y-3">
          {msgs.map((m) => (
            <div key={m.id} className={card}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-xl">💌</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-emerald-900">{m.name}</p>
                  <p className="text-xs text-slate-400">{m.phone ?? "tanpa nomor"} · {formatDate(m.createdAt)}</p>
                </div>
                {m.phone ? (
                  <a href={`https://wa.me/${m.phone.replace(/\D/g, "").replace(/^0/, "62")}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-600">
                    💬 Balas
                  </a>
                ) : null}
              </div>
              <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{m.body}</p>
            </div>
          ))}
          {msgs.length === 0 ? <p className="text-sm text-slate-400">Belum ada pesan.</p> : null}
        </div>
      ) : null}
    </div>
  );
}
