import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "drills_age_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "drills_gameplay" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "drills_phase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "drills_positions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "drills" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "drills_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "drills_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "drill_skills" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "drills_age_groups" CASCADE;
  DROP TABLE IF EXISTS "drills_gameplay" CASCADE;
  DROP TABLE IF EXISTS "drills_phase" CASCADE;
  DROP TABLE IF EXISTS "drills_positions" CASCADE;
  DROP TABLE IF EXISTS "drills" CASCADE;
  DROP TABLE IF EXISTS "drills_texts" CASCADE;
  DROP TABLE IF EXISTS "drills_rels" CASCADE;
  DROP TABLE IF EXISTS "drill_skills" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_drills_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_drill_skills_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_drills_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_drill_skills_id_idx";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "name";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "role";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "drills_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "drill_skills_id";
  DROP TYPE IF EXISTS "public"."enum_drills_age_groups";
  DROP TYPE IF EXISTS "public"."enum_drills_gameplay";
  DROP TYPE IF EXISTS "public"."enum_drills_phase";
  DROP TYPE IF EXISTS "public"."enum_drills_positions";
  DROP TYPE IF EXISTS "public"."enum_users_role";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_drills_age_groups" AS ENUM('u8', 'u10', 'u12', 'u14', 'high-school', 'college');
  CREATE TYPE "public"."enum_drills_gameplay" AS ENUM('mens', 'womens', 'box');
  CREATE TYPE "public"."enum_drills_phase" AS ENUM('offense', 'defense', 'transition', 'special-teams');
  CREATE TYPE "public"."enum_drills_positions" AS ENUM('attack', 'midfield', 'defense', 'goalie', 'faceoff');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'coach');
  CREATE TABLE "drills_age_groups" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_drills_age_groups",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "drills_gameplay" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_drills_gameplay",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "drills_phase" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_drills_phase",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "drills_positions" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_drills_positions",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "drills" (
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
  
  CREATE TABLE "drills_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "drills_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"drill_skills_id" integer
  );
  
  CREATE TABLE "drill_skills" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "name" varchar;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'coach' NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "drills_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "drill_skills_id" integer;
  ALTER TABLE "drills_age_groups" ADD CONSTRAINT "drills_age_groups_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."drills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drills_gameplay" ADD CONSTRAINT "drills_gameplay_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."drills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drills_phase" ADD CONSTRAINT "drills_phase_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."drills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drills_positions" ADD CONSTRAINT "drills_positions_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."drills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drills" ADD CONSTRAINT "drills_diagram_id_media_id_fk" FOREIGN KEY ("diagram_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "drills_texts" ADD CONSTRAINT "drills_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."drills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drills_rels" ADD CONSTRAINT "drills_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."drills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drills_rels" ADD CONSTRAINT "drills_rels_drill_skills_fk" FOREIGN KEY ("drill_skills_id") REFERENCES "public"."drill_skills"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "drills_age_groups_order_idx" ON "drills_age_groups" USING btree ("order");
  CREATE INDEX "drills_age_groups_parent_idx" ON "drills_age_groups" USING btree ("parent_id");
  CREATE INDEX "drills_gameplay_order_idx" ON "drills_gameplay" USING btree ("order");
  CREATE INDEX "drills_gameplay_parent_idx" ON "drills_gameplay" USING btree ("parent_id");
  CREATE INDEX "drills_phase_order_idx" ON "drills_phase" USING btree ("order");
  CREATE INDEX "drills_phase_parent_idx" ON "drills_phase" USING btree ("parent_id");
  CREATE INDEX "drills_positions_order_idx" ON "drills_positions" USING btree ("order");
  CREATE INDEX "drills_positions_parent_idx" ON "drills_positions" USING btree ("parent_id");
  CREATE UNIQUE INDEX "drills_slug_idx" ON "drills" USING btree ("slug");
  CREATE INDEX "drills_diagram_idx" ON "drills" USING btree ("diagram_id");
  CREATE INDEX "drills_updated_at_idx" ON "drills" USING btree ("updated_at");
  CREATE INDEX "drills_created_at_idx" ON "drills" USING btree ("created_at");
  CREATE INDEX "drills_texts_order_parent" ON "drills_texts" USING btree ("order","parent_id");
  CREATE INDEX "drills_rels_order_idx" ON "drills_rels" USING btree ("order");
  CREATE INDEX "drills_rels_parent_idx" ON "drills_rels" USING btree ("parent_id");
  CREATE INDEX "drills_rels_path_idx" ON "drills_rels" USING btree ("path");
  CREATE INDEX "drills_rels_drill_skills_id_idx" ON "drills_rels" USING btree ("drill_skills_id");
  CREATE UNIQUE INDEX "drill_skills_slug_idx" ON "drill_skills" USING btree ("slug");
  CREATE INDEX "drill_skills_updated_at_idx" ON "drill_skills" USING btree ("updated_at");
  CREATE INDEX "drill_skills_created_at_idx" ON "drill_skills" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_drills_fk" FOREIGN KEY ("drills_id") REFERENCES "public"."drills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_drill_skills_fk" FOREIGN KEY ("drill_skills_id") REFERENCES "public"."drill_skills"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_drills_id_idx" ON "payload_locked_documents_rels" USING btree ("drills_id");
  CREATE INDEX "payload_locked_documents_rels_drill_skills_id_idx" ON "payload_locked_documents_rels" USING btree ("drill_skills_id");`)
}
