import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/** Pendaftaran siswa baru (online) */
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  childName: varchar("child_name", { length: 120 }).notNull(),
  nickname: varchar("nickname", { length: 60 }),
  gender: varchar("gender", { length: 16 }).notNull().default("Ikhwan"),
  birthDate: date("birth_date"),
  parentName: varchar("parent_name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  email: varchar("email", { length: 120 }),
  address: text("address"),
  program: varchar("program", { length: 80 }).notNull().default("Calistung Dasar"),
  schedule: varchar("schedule", { length: 80 }).notNull().default("Senin & Rabu (15.30)"),
  message: text("message"),
  documentUrl: text("document_url"),
  documentPublicId: text("document_public_id"),
  status: varchar("status", { length: 24 }).notNull().default("baru"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Data siswa aktif */
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  nickname: varchar("nickname", { length: 60 }),
  gender: varchar("gender", { length: 16 }).notNull().default("Ikhwan"),
  age: integer("age"),
  parentName: varchar("parent_name", { length: 120 }),
  phone: varchar("phone", { length: 40 }),
  program: varchar("program", { length: 80 }).notNull().default("Calistung Dasar"),
  level: varchar("level", { length: 40 }).notNull().default("Level 1"),
  photoUrl: text("photo_url"),
  photoPublicId: text("photo_public_id"),
  progressBaca: integer("progress_baca").notNull().default(0),
  progressTulis: integer("progress_tulis").notNull().default(0),
  progressHitung: integer("progress_hitung").notNull().default(0),
  status: varchar("status", { length: 24 }).notNull().default("aktif"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Materi belajar (file di-host di Cloudinary) */
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 32 }).notNull().default("baca"),
  level: varchar("level", { length: 40 }).notNull().default("Level 1"),
  kind: varchar("kind", { length: 24 }).notNull().default("image"),
  url: text("url").notNull(),
  publicId: text("public_id"),
  format: varchar("format", { length: 24 }),
  bytes: integer("bytes"),
  downloads: integer("downloads").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Galeri kegiatan & karya siswa */
export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  caption: text("caption"),
  tag: varchar("tag", { length: 40 }).notNull().default("Kegiatan"),
  url: text("url").notNull(),
  publicId: text("public_id"),
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Ustadz / Ustadzah pengajar */
export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  role: varchar("role", { length: 100 }).notNull().default("Guru Calistung"),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  photoPublicId: text("public_id"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Hasil latihan / kuis interaktif */
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  playerName: varchar("player_name", { length: 80 }).notNull(),
  module: varchar("module", { length: 24 }).notNull().default("hitung"),
  level: varchar("level", { length: 40 }).notNull().default("Level 1"),
  score: integer("score").notNull().default(0),
  total: integer("total").notNull().default(10),
  durationSec: integer("duration_sec").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Pesan / pertanyaan orang tua */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  body: text("body").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Registration = typeof registrations.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Material = typeof materials.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type Teacher = typeof teachers.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type Message = typeof messages.$inferSelect;
