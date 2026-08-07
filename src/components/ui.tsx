import type { ReactNode } from "react";

export function SectionTitle({
  kicker,
  title,
  desc,
  center = true,
}: {
  kicker?: string;
  title: string;
  desc?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {kicker ? (
        <span className="inline-block rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-700">
          {kicker}
        </span>
      ) : null}
      <h2 className="font-display mt-3 text-3xl font-extrabold text-emerald-900 sm:text-4xl">
        {title}
      </h2>
      {desc ? <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{desc}</p> : null}
    </div>
  );
}

export function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`card-soft rounded-3xl border border-emerald-100 bg-white p-6 ${className}`}>
      {children}
    </div>
  );
}

export function EmptyState({ emoji = "🗂️", title, desc }: { emoji?: string; title: string; desc?: string }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-emerald-200 bg-white/70 px-6 py-14 text-center">
      <div className="text-4xl">{emoji}</div>
      <p className="font-display mt-3 text-lg font-bold text-emerald-900">{title}</p>
      {desc ? <p className="mt-1 text-sm text-slate-500">{desc}</p> : null}
    </div>
  );
}

export function formatBytes(bytes?: number | null) {
  if (!bytes) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
