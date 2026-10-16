import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN CREATE TYPE "public"."enum_drills_age_groups" AS ENUM('u8', 'u10', 'u12', 'u14', 'high-school', 'college'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_drills_gameplay" AS ENUM('mens', 'womens', 'box'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_drills_phase" AS ENUM('offense', 'defense', 'transition', 'special-teams'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_drills_positions" AS ENUM('attack', 'midfield', 'defense', 'goalie', 'faceoff'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'coach'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE TABLE IF NOT EXISTS "drills_age_groups" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_drills_age_groups",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "drills_gameplay" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_drills_gameplay",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "drills_phase" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_drills_phase",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "drills_positions" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_drills_positions",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "drills" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"featured" boolean DEFAULT false,
  	"summary" varchar NOT NULL,
  	"diagram_id" integer,
  	"video_url" varchar,
  	"setup" jsonb,
  	"instructions" jsonb,
  	"coaching_points" jsonb,
  	"small_sided_game" boolean DEFAULT false,
  	"player_count_min" numeric,
  	"player_count_max" numeric,
  	"duration" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "drills_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "drills_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"drill_skills_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "drill_skills" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DROP INDEX IF EXISTS "posts_meta_meta_image_1_idx";
  DROP INDEX IF EXISTS "_posts_v_version_meta_version_meta_image_1_idx";
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" "enum_users_role" DEFAULT 'coach' NOT NULL;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "focal_x" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "focal_y" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_micro_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_micro_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_micro_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_micro_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_micro_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_micro_filename" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_thumbnail_filename" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_filename" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "drills_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "drill_skills_id" integer;
  DO $$ BEGIN ALTER TABLE "drills_age_groups" ADD CONSTRAINT "drills_age_groups_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."drills"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "drills_gameplay" ADD CONSTRAINT "drills_gameplay_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."drills"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "drills_phase" ADD CONSTRAINT "drills_phase_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."drills"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "drills_positions" ADD CONSTRAINT "drills_positions_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."drills"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "drills" ADD CONSTRAINT "drills_diagram_id_media_id_fk" FOREIGN KEY ("diagram_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "drills_texts" ADD CONSTRAINT "drills_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."drills"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "drills_rels" ADD CONSTRAINT "drills_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."drills"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "drills_rels" ADD CONSTRAINT "drills_rels_drill_skills_fk" FOREIGN KEY ("drill_skills_id") REFERENCES "public"."drill_skills"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "drills_age_groups_order_idx" ON "drills_age_groups" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "drills_age_groups_parent_idx" ON "drills_age_groups" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "drills_gameplay_order_idx" ON "drills_gameplay" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "drills_gameplay_parent_idx" ON "drills_gameplay" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "drills_phase_order_idx" ON "drills_phase" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "drills_phase_parent_idx" ON "drills_phase" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "drills_positions_order_idx" ON "drills_positions" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "drills_positions_parent_idx" ON "drills_positions" USING btree ("parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "drills_slug_idx" ON "drills" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "drills_diagram_idx" ON "drills" USING btree ("diagram_id");
  CREATE INDEX IF NOT EXISTS "drills_updated_at_idx" ON "drills" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "drills_created_at_idx" ON "drills" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "drills_texts_order_parent" ON "drills_texts" USING btree ("order","parent_id");
  CREATE INDEX IF NOT EXISTS "drills_rels_order_idx" ON "drills_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "drills_rels_parent_idx" ON "drills_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "drills_rels_path_idx" ON "drills_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "drills_rels_drill_skills_id_idx" ON "drills_rels" USING btree ("drill_skills_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "drill_skills_slug_idx" ON "drill_skills" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "drill_skills_updated_at_idx" ON "drill_skills" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "drill_skills_created_at_idx" ON "drill_skills" USING btree ("created_at");
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_drills_fk" FOREIGN KEY ("drills_id") REFERENCES "public"."drills"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_drill_skills_fk" FOREIGN KEY ("drill_skills_id") REFERENCES "public"."drill_skills"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "media_sizes_micro_sizes_micro_filename_idx" ON "media" USING btree ("sizes_micro_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_drills_id_idx" ON "payload_locked_documents_rels" USING btree ("drills_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_drill_skills_id_idx" ON "payload_locked_documents_rels" USING btree ("drill_skills_id");`)

  // The new role column defaults to 'coach', which would strip admin-panel access
  // from every account that existed before roles existed. Promote them instead.
  await db.execute(sql`UPDATE "users" SET "role" = 'admin';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "drills_age_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "drills_gameplay" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "drills_phase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "drills_positions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "drills" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "drills_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "drills_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "drill_skills" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "drills_age_groups" CASCADE;
  DROP TABLE "drills_gameplay" CASCADE;
  DROP TABLE "drills_phase" CASCADE;
  DROP TABLE "drills_positions" CASCADE;
  DROP TABLE "drills" CASCADE;
  DROP TABLE "drills_texts" CASCADE;
  DROP TABLE "drills_rels" CASCADE;
  DROP TABLE "drill_skills" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_drills_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_drill_skills_fk";
  
  DROP INDEX IF EXISTS "media_sizes_micro_sizes_micro_filename_idx";
  DROP INDEX IF EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx";
  DROP INDEX IF EXISTS "media_sizes_card_sizes_card_filename_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_drills_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_drill_skills_id_idx";
  CREATE INDEX IF NOT EXISTS "posts_meta_meta_image_1_idx" ON "posts" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_meta_version_meta_image_1_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "media" DROP COLUMN "focal_x";
  ALTER TABLE "media" DROP COLUMN "focal_y";
  ALTER TABLE "media" DROP COLUMN "sizes_micro_url";
  ALTER TABLE "media" DROP COLUMN "sizes_micro_width";
  ALTER TABLE "media" DROP COLUMN "sizes_micro_height";
  ALTER TABLE "media" DROP COLUMN "sizes_micro_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_micro_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_micro_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_url";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_width";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_height";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_card_url";
  ALTER TABLE "media" DROP COLUMN "sizes_card_width";
  ALTER TABLE "media" DROP COLUMN "sizes_card_height";
  ALTER TABLE "media" DROP COLUMN "sizes_card_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filename";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "drills_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "drill_skills_id";
  DROP TYPE "public"."enum_drills_age_groups";
  DROP TYPE "public"."enum_drills_gameplay";
  DROP TYPE "public"."enum_drills_phase";
  DROP TYPE "public"."enum_drills_positions";
  DROP TYPE "public"."enum_users_role";`)
}
