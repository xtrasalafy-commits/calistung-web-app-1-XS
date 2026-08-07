"use client";

import { useRef, useState } from "react";

export type UploadedAsset = {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  resourceType: string;
  originalFilename?: string;
};

export function UploadField({
  folder,
  label = "Unggah berkas",
  accept = "image/*,application/pdf",
  hint = "JPG, PNG, atau PDF · maks 15 MB",
  onUploaded,
}: {
  folder: string;
  label?: string;
  accept?: string;
  hint?: string;
  onUploaded: (asset: UploadedAsset) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<UploadedAsset | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      let json: { asset?: UploadedAsset; error?: string } = {};
      try {
        json = (await res.json()) as { asset?: UploadedAsset; error?: string };
      } catch {
        // ignore JSON parse error
      }
      if (!res.ok || !json.asset) throw new Error(json.error ?? "Gagal mengunggah.");
      setDone(json.asset);
      onUploaded(json.asset);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/60 px-4 py-5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
      >
        {busy ? "⏳ Mengunggah ke Cloudinary..." : `☁️ ${label}`}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
      <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      {error ? <p className="mt-1 text-xs font-semibold text-rose-600">{error}</p> : null}
      {done ? (
        <div className="mt-2 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          <span>✅</span>
          <span className="truncate">
            Tersimpan: <span className="font-semibold">{done.publicId.split("/").pop()}</span>
          </span>
          <a href={done.url} target="_blank" rel="noreferrer" className="ml-auto shrink-0 font-bold underline">
            Lihat
          </a>
        </div>
      ) : null}
    </div>
  );
}
