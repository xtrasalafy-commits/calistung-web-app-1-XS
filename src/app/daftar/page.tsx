import { Suspense } from "react";
import type { Metadata } from "next";
import { RegistrationForm } from "./registration-form";

export const metadata: Metadata = {
  title: "Pendaftaran Siswa Baru",
  description: "Formulir pendaftaran online Calistung Ya Bunayya Palembang. Gratis kelas trial + asesmen awal.",
};

export default function DaftarPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-20 text-center text-slate-400">Memuat formulir...</div>}>
      <RegistrationForm />
    </Suspense>
  );
}
