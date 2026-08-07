/**
 * Seed data awal + unggah media contoh ke Cloudinary.
 * Jalankan: node scripts/seed.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { Client } from "pg";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

const DB_URL = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/app_db";
const ROOT = process.env.CLOUDINARY_FOLDER ?? "yabunayya";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const preset = process.env.CLOUDINARY_UPLOAD_PRESET;

async function upload(source, folder, publicId) {
  const base = {
    folder: `${ROOT}/${folder}`,
    public_id: publicId,
    resource_type: "image",
    overwrite: true,
    unique_filename: false,
    use_filename: false,
  };
  try {
    return await cloudinary.uploader.upload(source, preset ? { ...base, upload_preset: preset } : base);
  } catch (err) {
    try {
      return await cloudinary.uploader.upload(source, base);
    } catch (err2) {
      console.warn(`  ! Gagal unggah ${publicId}: ${err2?.message ?? err?.message}`);
      return null;
    }
  }
}

const PHOTOS = [
  {
    id: "kegiatan-mengenal-huruf",
    src: "https://images.pexels.com/photos/8087862/pexels-photo-8087862.jpeg?auto=compress&cs=tinysrgb&w=1400",
    title: "Bermain Kartu Huruf",
    caption: "Kelas Calistung Dasar mengenal bentuk huruf lewat kartu bergambar.",
    tag: "Kegiatan",
  },
  {
    id: "kelas-alfabet",
    src: "https://images.pexels.com/photos/8422132/pexels-photo-8422132.jpeg?auto=compress&cs=tinysrgb&w=1400",
    title: "Kelas Pagi Sabtu",
    caption: "Suasana belajar kelompok kecil, satu guru maksimal lima ananda.",
    tag: "Kegiatan",
  },
  {
    id: "latihan-menulis",
    src: "https://images.pexels.com/photos/8363026/pexels-photo-8363026.jpeg?auto=compress&cs=tinysrgb&w=1400",
    title: "Latihan Menebalkan Huruf",
    caption: "Melatih motorik halus sebelum menulis huruf sambung.",
    tag: "Menulis",
  },
  {
    id: "apresiasi-siswa",
    src: "https://images.pexels.com/photos/8363771/pexels-photo-8363771.jpeg?auto=compress&cs=tinysrgb&w=1400",
    title: "Tos Semangat!",
    caption: "Apresiasi untuk ananda yang berhasil membaca satu halaman penuh.",
    tag: "Prestasi",
  },
  {
    id: "papan-alfabet",
    src: "https://images.pexels.com/photos/8499573/pexels-photo-8499573.jpeg?auto=compress&cs=tinysrgb&w=1400",
    title: "Pojok Baca Ya Bunayya",
    caption: "Dinding kelas penuh warna membantu anak mengingat huruf.",
    tag: "Fasilitas",
  },
  {
    id: "blok-angka",
    src: "https://images.pexels.com/photos/12960389/pexels-photo-12960389.jpeg?auto=compress&cs=tinysrgb&w=1400",
    title: "Berhitung dengan Balok",
    caption: "Konsep penjumlahan diperkenalkan lewat benda konkret.",
    tag: "Berhitung",
  },
  {
    id: "kartu-huruf-warna",
    src: "https://images.pexels.com/photos/1337374/pexels-photo-1337374.jpeg?auto=compress&cs=tinysrgb&w=1400",
    title: "Koleksi Kartu Huruf",
    caption: "Media belajar yang dipakai di setiap sesi membaca.",
    tag: "Fasilitas",
  },
  {
    id: "kelas-bersama-guru",
    src: "https://images.pexels.com/photos/8422164/pexels-photo-8422164.jpeg?auto=compress&cs=tinysrgb&w=1400",
    title: "Belajar Bersama Ustadzah",
    caption: "Pendampingan personal untuk setiap ananda.",
    tag: "Kegiatan",
  },
];

const MATERIALS = [
  {
    photoId: "kartu-huruf-warna",
    title: "Kartu Huruf A-Z Siap Cetak",
    description: "Lembar kartu huruf besar & kecil untuk dilatih di rumah bersama orang tua.",
    category: "baca",
    level: "Level 1",
  },
  {
    photoId: "latihan-menulis",
    title: "Lembar Menebalkan Huruf",
    description: "Latihan menebalkan garis dan huruf untuk melatih motorik halus ananda.",
    category: "tulis",
    level: "Level 1",
  },
  {
    photoId: "blok-angka",
    title: "Latihan Penjumlahan 1-20",
    description: "Dua puluh soal penjumlahan bergambar dengan kunci jawaban.",
    category: "hitung",
    level: "Level 2",
  },
  {
    photoId: "papan-alfabet",
    title: "Poster Suku Kata BA-BI-BU",
    description: "Poster suku kata untuk ditempel di kamar ananda.",
    category: "baca",
    level: "Level 2",
  },
];

const TEACHERS = [
  { name: "Ustadzah Nurhayati, S.Pd.", role: "Kepala Program Calistung", bio: "9 tahun mendampingi anak usia dini, spesialis metode baca suku kata.", order: 1 },
  { name: "Ustadzah Fitri Ramadhani", role: "Guru Membaca & Menulis", bio: "Sabar dan telaten, ahli menangani anak yang belum kenal huruf sama sekali.", order: 2 },
  { name: "Ustadz Ahmad Fauzan", role: "Guru Berhitung & Tahsin", bio: "Mengemas matematika dasar jadi permainan yang ditunggu anak-anak.", order: 3 },
  { name: "Ustadzah Salsabila", role: "Guru Kelas Persiapan SD", bio: "Fokus melatih kesiapan tes masuk SD favorit di Palembang.", order: 4 },
];

const STUDENTS = [
  ["Kayla Azzahra", "Kayla", "Akhwat", 6, "Bunda Rizka", "0812-7100-1122", "Calistung Lancar", "Level 3", 92, 85, 78],
  ["Muhammad Fadhil", "Fadhil", "Ikhwan", 6, "Ayah Rahmat", "0813-6700-2211", "Persiapan Masuk SD", "Persiapan SD", 88, 90, 95],
  ["Aisyah Humaira", "Aisyah", "Akhwat", 5, "Bunda Siti", "0821-7788-3344", "Calistung Lancar", "Level 2", 74, 68, 71],
  ["Rafa Alfarizi", "Rafa", "Ikhwan", 4, "Ayah Doni", "0852-6600-9911", "Calistung Dasar", "Level 1", 55, 48, 60],
  ["Nadia Syakila", "Nadia", "Akhwat", 5, "Bunda Lastri", "0819-2233-4455", "Tahsin & Iqro", "Level 2", 80, 72, 65],
  ["Zaki Ramadhan", "Zaki", "Ikhwan", 6, "Ayah Hendra", "0878-1100-8899", "Persiapan Masuk SD", "Persiapan SD", 91, 83, 88],
];

const ATTEMPTS = [
  ["Kayla", "hitung", "Level 2", 10, 10, 62],
  ["Fadhil", "hitung", "Level 3", 9, 10, 71],
  ["Aisyah", "baca", "Level 1", 10, 10, 55],
  ["Rafa", "baca", "Level 1", 7, 10, 90],
  ["Zaki", "hitung", "Level 3", 10, 10, 58],
  ["Nadia", "baca", "Level 2", 8, 10, 77],
  ["Fadhil", "baca", "Level 3", 10, 10, 49],
  ["Kayla", "baca", "Level 2", 9, 10, 66],
];

const REGISTRATIONS = [
  ["Alif Pratama", "Alif", "Ikhwan", "Bunda Wulan", "0813-7788-1010", "alifmom@mail.com", "Jl. Kapten A. Rivai No. 12, Palembang", "Calistung Dasar", "Sabtu Pagi (08.00)", "baru"],
  ["Khansa Aulia", "Khansa", "Akhwat", "Ayah Bagus", "0852-6611-2233", "bagus@mail.com", "Perum OPI Jakabaring Blok C, Palembang", "Calistung Lancar", "Selasa & Kamis (15.30)", "dihubungi"],
  ["Yusuf Ibrahim", "Yusuf", "Ikhwan", "Bunda Maya", "0812-9900-7766", null, "Jl. Sukabangun II, Palembang", "Persiapan Masuk SD", "Privat ke rumah", "diterima"],
];

async function main() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();

  const { rows } = await client.query("select count(*)::int as c from gallery_items");
  if (rows[0].c > 0) {
    console.log("Seed dilewati: data sudah ada.");
    await client.end();
    return;
  }

  console.log("Mengunggah media ke Cloudinary...");
  const uploaded = {};

  const heroPath = path.join(process.cwd(), "public/images/hero-calistung.jpg");
  if (existsSync(heroPath)) {
    const b64 = `data:image/jpeg;base64,${readFileSync(heroPath).toString("base64")}`;
    const res = await upload(b64, "brand", "hero-calistung");
    if (res) console.log(`  ✓ hero -> ${res.secure_url}`);
  }

  for (const photo of PHOTOS) {
    const res = await upload(photo.src, "galeri", photo.id);
    uploaded[photo.id] = res
      ? { url: res.secure_url, publicId: res.public_id, width: res.width, height: res.height, bytes: res.bytes, format: res.format }
      : { url: photo.src, publicId: null, width: 1200, height: 800, bytes: 0, format: "jpg" };
    console.log(`  ✓ ${photo.id}`);
  }

  for (const photo of PHOTOS) {
    const a = uploaded[photo.id];
    await client.query(
      "insert into gallery_items (title, caption, tag, url, public_id, width, height) values ($1,$2,$3,$4,$5,$6,$7)",
      [photo.title, photo.caption, photo.tag, a.url, a.publicId, a.width, a.height],
    );
  }

  for (const m of MATERIALS) {
    const a = uploaded[m.photoId];
    await client.query(
      "insert into materials (title, description, category, level, kind, url, public_id, format, bytes, downloads) values ($1,$2,$3,$4,'image',$5,$6,$7,$8,$9)",
      [m.title, m.description, m.category, m.level, a.url, a.publicId, a.format, a.bytes, Math.floor(Math.random() * 90) + 10],
    );
  }

  for (const t of TEACHERS) {
    await client.query(
      "insert into teachers (name, role, bio, sort_order) values ($1,$2,$3,$4)",
      [t.name, t.role, t.bio, t.order],
    );
  }

  for (const s of STUDENTS) {
    await client.query(
      "insert into students (name, nickname, gender, age, parent_name, phone, program, level, progress_baca, progress_tulis, progress_hitung) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
      s,
    );
  }

  for (const a of ATTEMPTS) {
    await client.query(
      "insert into quiz_attempts (player_name, module, level, score, total, duration_sec) values ($1,$2,$3,$4,$5,$6)",
      a,
    );
  }

  for (const r of REGISTRATIONS) {
    await client.query(
      "insert into registrations (child_name, nickname, gender, parent_name, phone, email, address, program, schedule, status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
      r,
    );
  }

  await client.query(
    "insert into messages (name, phone, body) values ($1,$2,$3)",
    ["Bunda Ayu", "0812-3344-5566", "Assalamualaikum, apakah masih ada kuota kelas Sabtu pagi untuk anak usia 5 tahun?"],
  );

  console.log("Seed selesai ✅");
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
