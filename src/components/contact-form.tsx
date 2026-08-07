"use client";

import { useState } from "react";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("loading");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          body: form.get("body"),
        }),
      });
      let json: { error?: string } = {};
      try {
        json = (await res.json()) as { error?: string };
      } catch {
        // ignore JSON parse error
      }
      if (!res.ok) throw new Error(json.error ?? "Gagal mengirim pesan.");
      setState("done");
      setMsg("Terima kasih! Pesan Bunda/Ayah sudah kami terima. Tim kami akan membalas lewat WhatsApp.");
      e.currentTarget.reset();
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Gagal mengirim pesan.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder="Nama Bunda / Ayah"
          className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
        <input
          name="phone"
          placeholder="Nomor WhatsApp"
          className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
      </div>
      <textarea
        name="body"
        required
        rows={4}
        placeholder="Tulis pertanyaan Anda di sini..."
        className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {state === "loading" ? "Mengirim..." : "Kirim Pertanyaan"}
      </button>
      {msg ? (
        <p className={`text-sm font-semibold ${state === "done" ? "text-emerald-700" : "text-rose-600"}`}>{msg}</p>
      ) : null}
    </form>
  );
}
