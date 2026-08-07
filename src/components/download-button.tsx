"use client";

export function DownloadButton({ id, url }: { id: number; url: string }) {
  return (
    <button
      onClick={() => {
        void fetch(`/api/materials/${id}`, { method: "POST" });
        window.open(url, "_blank", "noopener");
      }}
      className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-center text-sm font-bold text-white transition hover:bg-emerald-700"
    >
      Buka / Unduh
    </button>
  );
}
