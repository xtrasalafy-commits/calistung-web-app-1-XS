import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? "";
const apiKey = process.env.CLOUDINARY_API_KEY ?? "";
const apiSecret = process.env.CLOUDINARY_API_SECRET ?? "";

export const CLOUDINARY_ROOT_FOLDER = process.env.CLOUDINARY_FOLDER ?? "yabunayya";
export const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET ?? "";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export const cloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

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

type UploadResult = {
  secure_url: string;
  public_id: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  resource_type?: string;
  original_filename?: string;
};

function uploadStream(
  buffer: Buffer,
  options: Record<string, unknown>,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    if (!cloudinary.uploader?.upload_stream) {
      reject(new Error("Cloudinary uploader tidak tersedia."));
      return;
    }
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        const msg = typeof error === "string" ? error : error?.message ?? "Upload gagal tanpa keterangan.";
        reject(new Error(msg));
        return;
      }
      resolve(result as unknown as UploadResult);
    });
    stream.end(buffer);
  });
}

export async function uploadToCloudinary(
  buffer: Buffer,
  opts: { folder?: string; filename?: string; resourceType?: "auto" | "image" | "video" | "raw" } = {},
): Promise<UploadedAsset> {
  if (!cloudinaryConfigured) {
    throw new Error("Kredensial Cloudinary belum dikonfigurasi.");
  }

  if (!buffer || buffer.length === 0) {
    throw new Error("Berkas kosong.");
  }

  const folder = [CLOUDINARY_ROOT_FOLDER, opts.folder].filter(Boolean).join("/");
  const base: Record<string, unknown> = {
    folder,
    resource_type: opts.resourceType ?? "auto",
    overwrite: false,
  };
  if (opts.filename) {
    base.filename_override = opts.filename;
  }

  let result: UploadResult;
  try {
    result = await uploadStream(
      buffer,
      CLOUDINARY_UPLOAD_PRESET
        ? { upload_preset: CLOUDINARY_UPLOAD_PRESET }
        : base,
    );
  } catch (firstErr) {
    console.error("[cloudinary] preset upload failed:", firstErr);
    try {
      result = await uploadStream(buffer, base);
    } catch (fallbackErr) {
      console.error("[cloudinary] fallback upload failed:", fallbackErr);
      throw fallbackErr instanceof Error ? fallbackErr : new Error(String(fallbackErr));
    }
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format ?? "",
    bytes: result.bytes ?? 0,
    width: result.width,
    height: result.height,
    resourceType: result.resource_type ?? "image",
    originalFilename: result.original_filename,
  };
}

export async function destroyFromCloudinary(publicId?: string | null, resourceType = "image") {
  if (!publicId || !cloudinaryConfigured) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
  } catch {
    /* diamkan: file mungkin sudah terhapus */
  }
}

export function cldThumb(url: string, width = 640, height?: number) {
  if (!url.includes("/upload/")) return url;
  const t = ["f_auto", "q_auto", `w_${width}`, height ? `h_${height}` : "", height ? "c_fill" : "c_limit", "g_auto"]
    .filter(Boolean)
    .join(",");
  return url.replace("/upload/", `/upload/${t}/`);
}

export { cloudinary };
