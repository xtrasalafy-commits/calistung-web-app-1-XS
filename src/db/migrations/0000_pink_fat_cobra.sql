CREATE TABLE "gallery_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(160) NOT NULL,
	"caption" text,
	"tag" varchar(40) DEFAULT 'Kegiatan' NOT NULL,
	"url" text NOT NULL,
	"public_id" text,
	"width" integer,
	"height" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text,
	"category" varchar(32) DEFAULT 'baca' NOT NULL,
	"level" varchar(40) DEFAULT 'Level 1' NOT NULL,
	"kind" varchar(24) DEFAULT 'image' NOT NULL,
	"url" text NOT NULL,
	"public_id" text,
	"format" varchar(24),
	"bytes" integer,
	"downloads" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"phone" varchar(40),
	"body" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_name" varchar(80) NOT NULL,
	"module" varchar(24) DEFAULT 'hitung' NOT NULL,
	"level" varchar(40) DEFAULT 'Level 1' NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"total" integer DEFAULT 10 NOT NULL,
	"duration_sec" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"child_name" varchar(120) NOT NULL,
	"nickname" varchar(60),
	"gender" varchar(16) DEFAULT 'Ikhwan' NOT NULL,
	"birth_date" date,
	"parent_name" varchar(120) NOT NULL,
	"phone" varchar(40) NOT NULL,
	"email" varchar(120),
	"address" text,
	"program" varchar(80) DEFAULT 'Calistung Dasar' NOT NULL,
	"schedule" varchar(80) DEFAULT 'Senin & Rabu (15.30)' NOT NULL,
	"message" text,
	"document_url" text,
	"document_public_id" text,
	"status" varchar(24) DEFAULT 'baru' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"nickname" varchar(60),
	"gender" varchar(16) DEFAULT 'Ikhwan' NOT NULL,
	"age" integer,
	"parent_name" varchar(120),
	"phone" varchar(40),
	"program" varchar(80) DEFAULT 'Calistung Dasar' NOT NULL,
	"level" varchar(40) DEFAULT 'Level 1' NOT NULL,
	"photo_url" text,
	"photo_public_id" text,
	"progress_baca" integer DEFAULT 0 NOT NULL,
	"progress_tulis" integer DEFAULT 0 NOT NULL,
	"progress_hitung" integer DEFAULT 0 NOT NULL,
	"status" varchar(24) DEFAULT 'aktif' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"role" varchar(100) DEFAULT 'Guru Calistung' NOT NULL,
	"bio" text,
	"photo_url" text,
	"public_id" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
