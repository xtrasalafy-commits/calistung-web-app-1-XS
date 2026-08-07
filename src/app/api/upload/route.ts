import { NextRequest, NextResponse } from "next/server";
import { cloudinaryConfigured, CLOUDINARY_UPLOAD_PRESET, uploadToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

export async function POST(req: NextRequest) {
  console.log("[upload] cloudinaryConfigured:", cloudinaryConfigured, "preset:", CLOUDINARY_UPLOAD_PRESET);

  if (!cloudinaryConfigured) {
    return NextResponse.json(
      { error: "Cloudinary belum dikonfigurasi pada server." },
      { status: 500 },
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    const folder = (form.get("folder") as string | null) ?? "umum";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Berkas tidak ditemukan." }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "Berkas kosong." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Ukuran berkas maksimal 15 MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await uploadToCloudinary(buffer, {
      folder: folder.replace(/[^a-zA-Z0-9-_/]/g, ""),
      filename: file.name?.replace(/\.[^.]+$/, ""),
      resourceType: "auto",
    });

    return NextResponse.json({ ok: true, asset });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal mengunggah berkas.";
    console.error("[upload]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
