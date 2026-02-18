import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_games_game_type" AS ENUM('scrimmage', 'regular-season', 'playoffs');
  CREATE TYPE "public"."enum_games_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__games_v_version_game_type" AS ENUM('scrimmage', 'regular-season', 'playoffs');
  CREATE TYPE "public"."enum__games_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_players_position" AS ENUM('Attack', 'Midfield', 'Defense', 'Goalie', 'Face Off');
  CREATE TYPE "public"."enum_rosters_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__rosters_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_coaching_staff_coaches_role" AS ENUM('head', 'assistant');
  CREATE TYPE "public"."enum_form_submissions_status" AS ENUM('new', 'reviewed', 'replied', 'archived');
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"photo_attribution" varchar,
  	"season_id" integer,
  	"author_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_photo_attribution" varchar,
  	"version_season_id" integer,
  	"version_author_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "games" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"season_id" integer,
  	"level_id" integer,
  	"name" varchar,
  	"opponent_id" integer,
  	"date" timestamp(3) with time zone,
  	"location" varchar,
  	"livestream_link" varchar,
  	"game_type" "enum_games_game_type" DEFAULT 'regular-season',
  	"ls_final" numeric,
  	"opponent_final" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_games_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_games_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_season_id" integer,
  	"version_level_id" integer,
  	"version_name" varchar,
  	"version_opponent_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_livestream_link" varchar,
  	"version_game_type" "enum__games_v_version_game_type" DEFAULT 'regular-season',
  	"version_ls_final" numeric,
  	"version_opponent_final" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__games_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "players" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"full_name" varchar,
  	"position" "enum_players_position" NOT NULL,
  	"jersey_number" numeric NOT NULL,
  	"graduation_year_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "rosters_players" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"player_id" integer
  );
  
  CREATE TABLE "rosters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"season_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_rosters_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_rosters_v_version_players" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"player_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_rosters_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_season_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__rosters_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "opponents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"short_name" varchar NOT NULL,
  	"logo_id" integer,
  	"school_address" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "coaching_staff_coaches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"coach_id" integer NOT NULL,
  	"role" "enum_coaching_staff_coaches_role" DEFAULT 'assistant'
  );
  
  CREATE TABLE "coaching_staff" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"level_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "coaches" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"full_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_name" varchar NOT NULL,
  	"name" varchar,
  	"email" varchar,
  	"payload" jsonb NOT NULL,
  	"formatted_data" varchar,
  	"status" "enum_form_submissions_status" DEFAULT 'new',
  	"source_page" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric
  );
  
  CREATE TABLE "levels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "years" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"games_id" integer,
  	"players_id" integer,
  	"rosters_id" integer,
  	"opponents_id" integer,
  	"coaching_staff_id" integer,
  	"coaches_id" integer,
  	"form_submissions_id" integer,
  	"users_id" integer,
  	"media_id" integer,
  	"levels_id" integer,
  	"years_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_season_id_years_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."years"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_season_id_years_id_fk" FOREIGN KEY ("version_season_id") REFERENCES "public"."years"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "games" ADD CONSTRAINT "games_season_id_years_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."years"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "games" ADD CONSTRAINT "games_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "games" ADD CONSTRAINT "games_opponent_id_opponents_id_fk" FOREIGN KEY ("opponent_id") REFERENCES "public"."opponents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_games_v" ADD CONSTRAINT "_games_v_parent_id_games_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."games"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_games_v" ADD CONSTRAINT "_games_v_version_season_id_years_id_fk" FOREIGN KEY ("version_season_id") REFERENCES "public"."years"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_games_v" ADD CONSTRAINT "_games_v_version_level_id_levels_id_fk" FOREIGN KEY ("version_level_id") REFERENCES "public"."levels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_games_v" ADD CONSTRAINT "_games_v_version_opponent_id_opponents_id_fk" FOREIGN KEY ("version_opponent_id") REFERENCES "public"."opponents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "players" ADD CONSTRAINT "players_graduation_year_id_years_id_fk" FOREIGN KEY ("graduation_year_id") REFERENCES "public"."years"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "rosters_players" ADD CONSTRAINT "rosters_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "rosters_players" ADD CONSTRAINT "rosters_players_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rosters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rosters" ADD CONSTRAINT "rosters_season_id_years_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."years"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_rosters_v_version_players" ADD CONSTRAINT "_rosters_v_version_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_rosters_v_version_players" ADD CONSTRAINT "_rosters_v_version_players_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_rosters_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rosters_v" ADD CONSTRAINT "_rosters_v_parent_id_rosters_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."rosters"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_rosters_v" ADD CONSTRAINT "_rosters_v_version_season_id_years_id_fk" FOREIGN KEY ("version_season_id") REFERENCES "public"."years"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "opponents" ADD CONSTRAINT "opponents_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "coaching_staff_coaches" ADD CONSTRAINT "coaching_staff_coaches_coach_id_coaches_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coaches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "coaching_staff_coaches" ADD CONSTRAINT "coaching_staff_coaches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."coaching_staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coaching_staff" ADD CONSTRAINT "coaching_staff_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_games_fk" FOREIGN KEY ("games_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_players_fk" FOREIGN KEY ("players_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rosters_fk" FOREIGN KEY ("rosters_id") REFERENCES "public"."rosters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_opponents_fk" FOREIGN KEY ("opponents_id") REFERENCES "public"."opponents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_coaching_staff_fk" FOREIGN KEY ("coaching_staff_id") REFERENCES "public"."coaching_staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_coaches_fk" FOREIGN KEY ("coaches_id") REFERENCES "public"."coaches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_levels_fk" FOREIGN KEY ("levels_id") REFERENCES "public"."levels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_years_fk" FOREIGN KEY ("years_id") REFERENCES "public"."years"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_season_idx" ON "posts" USING btree ("season_id");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_version_season_idx" ON "_posts_v" USING btree ("version_season_id");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "games_slug_idx" ON "games" USING btree ("slug");
  CREATE INDEX "games_season_idx" ON "games" USING btree ("season_id");
  CREATE INDEX "games_level_idx" ON "games" USING btree ("level_id");
  CREATE INDEX "games_opponent_idx" ON "games" USING btree ("opponent_id");
  CREATE INDEX "games_updated_at_idx" ON "games" USING btree ("updated_at");
  CREATE INDEX "games_created_at_idx" ON "games" USING btree ("created_at");
  CREATE INDEX "games__status_idx" ON "games" USING btree ("_status");
  CREATE INDEX "_games_v_parent_idx" ON "_games_v" USING btree ("parent_id");
  CREATE INDEX "_games_v_version_version_slug_idx" ON "_games_v" USING btree ("version_slug");
  CREATE INDEX "_games_v_version_version_season_idx" ON "_games_v" USING btree ("version_season_id");
  CREATE INDEX "_games_v_version_version_level_idx" ON "_games_v" USING btree ("version_level_id");
  CREATE INDEX "_games_v_version_version_opponent_idx" ON "_games_v" USING btree ("version_opponent_id");
  CREATE INDEX "_games_v_version_version_updated_at_idx" ON "_games_v" USING btree ("version_updated_at");
  CREATE INDEX "_games_v_version_version_created_at_idx" ON "_games_v" USING btree ("version_created_at");
  CREATE INDEX "_games_v_version_version__status_idx" ON "_games_v" USING btree ("version__status");
  CREATE INDEX "_games_v_created_at_idx" ON "_games_v" USING btree ("created_at");
  CREATE INDEX "_games_v_updated_at_idx" ON "_games_v" USING btree ("updated_at");
  CREATE INDEX "_games_v_latest_idx" ON "_games_v" USING btree ("latest");
  CREATE INDEX "players_graduation_year_idx" ON "players" USING btree ("graduation_year_id");
  CREATE INDEX "players_updated_at_idx" ON "players" USING btree ("updated_at");
  CREATE INDEX "players_created_at_idx" ON "players" USING btree ("created_at");
  CREATE INDEX "rosters_players_order_idx" ON "rosters_players" USING btree ("_order");
  CREATE INDEX "rosters_players_parent_id_idx" ON "rosters_players" USING btree ("_parent_id");
  CREATE INDEX "rosters_players_player_idx" ON "rosters_players" USING btree ("player_id");
  CREATE INDEX "rosters_season_idx" ON "rosters" USING btree ("season_id");
  CREATE INDEX "rosters_updated_at_idx" ON "rosters" USING btree ("updated_at");
  CREATE INDEX "rosters_created_at_idx" ON "rosters" USING btree ("created_at");
  CREATE INDEX "rosters__status_idx" ON "rosters" USING btree ("_status");
  CREATE INDEX "_rosters_v_version_players_order_idx" ON "_rosters_v_version_players" USING btree ("_order");
  CREATE INDEX "_rosters_v_version_players_parent_id_idx" ON "_rosters_v_version_players" USING btree ("_parent_id");
  CREATE INDEX "_rosters_v_version_players_player_idx" ON "_rosters_v_version_players" USING btree ("player_id");
  CREATE INDEX "_rosters_v_parent_idx" ON "_rosters_v" USING btree ("parent_id");
  CREATE INDEX "_rosters_v_version_version_season_idx" ON "_rosters_v" USING btree ("version_season_id");
  CREATE INDEX "_rosters_v_version_version_updated_at_idx" ON "_rosters_v" USING btree ("version_updated_at");
  CREATE INDEX "_rosters_v_version_version_created_at_idx" ON "_rosters_v" USING btree ("version_created_at");
  CREATE INDEX "_rosters_v_version_version__status_idx" ON "_rosters_v" USING btree ("version__status");
  CREATE INDEX "_rosters_v_created_at_idx" ON "_rosters_v" USING btree ("created_at");
  CREATE INDEX "_rosters_v_updated_at_idx" ON "_rosters_v" USING btree ("updated_at");
  CREATE INDEX "_rosters_v_latest_idx" ON "_rosters_v" USING btree ("latest");
  CREATE UNIQUE INDEX "opponents_slug_idx" ON "opponents" USING btree ("slug");
  CREATE INDEX "opponents_logo_idx" ON "opponents" USING btree ("logo_id");
  CREATE INDEX "opponents_updated_at_idx" ON "opponents" USING btree ("updated_at");
  CREATE INDEX "opponents_created_at_idx" ON "opponents" USING btree ("created_at");
  CREATE INDEX "coaching_staff_coaches_order_idx" ON "coaching_staff_coaches" USING btree ("_order");
  CREATE INDEX "coaching_staff_coaches_parent_id_idx" ON "coaching_staff_coaches" USING btree ("_parent_id");
  CREATE INDEX "coaching_staff_coaches_coach_idx" ON "coaching_staff_coaches" USING btree ("coach_id");
  CREATE INDEX "coaching_staff_year_idx" ON "coaching_staff" USING btree ("year");
  CREATE INDEX "coaching_staff_level_idx" ON "coaching_staff" USING btree ("level_id");
  CREATE INDEX "coaching_staff_updated_at_idx" ON "coaching_staff" USING btree ("updated_at");
  CREATE INDEX "coaching_staff_created_at_idx" ON "coaching_staff" USING btree ("created_at");
  CREATE INDEX "coaches_updated_at_idx" ON "coaches" USING btree ("updated_at");
  CREATE INDEX "coaches_created_at_idx" ON "coaches" USING btree ("created_at");
  CREATE INDEX "form_submissions_form_name_idx" ON "form_submissions" USING btree ("form_name");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "levels_updated_at_idx" ON "levels" USING btree ("updated_at");
  CREATE INDEX "levels_created_at_idx" ON "levels" USING btree ("created_at");
  CREATE UNIQUE INDEX "years_year_idx" ON "years" USING btree ("year");
  CREATE INDEX "years_updated_at_idx" ON "years" USING btree ("updated_at");
  CREATE INDEX "years_created_at_idx" ON "years" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_games_id_idx" ON "payload_locked_documents_rels" USING btree ("games_id");
  CREATE INDEX "payload_locked_documents_rels_players_id_idx" ON "payload_locked_documents_rels" USING btree ("players_id");
  CREATE INDEX "payload_locked_documents_rels_rosters_id_idx" ON "payload_locked_documents_rels" USING btree ("rosters_id");
  CREATE INDEX "payload_locked_documents_rels_opponents_id_idx" ON "payload_locked_documents_rels" USING btree ("opponents_id");
  CREATE INDEX "payload_locked_documents_rels_coaching_staff_id_idx" ON "payload_locked_documents_rels" USING btree ("coaching_staff_id");
  CREATE INDEX "payload_locked_documents_rels_coaches_id_idx" ON "payload_locked_documents_rels" USING btree ("coaches_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_levels_id_idx" ON "payload_locked_documents_rels" USING btree ("levels_id");
  CREATE INDEX "payload_locked_documents_rels_years_id_idx" ON "payload_locked_documents_rels" USING btree ("years_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "posts" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "games" CASCADE;
  DROP TABLE "_games_v" CASCADE;
  DROP TABLE "players" CASCADE;
  DROP TABLE "rosters_players" CASCADE;
  DROP TABLE "rosters" CASCADE;
  DROP TABLE "_rosters_v_version_players" CASCADE;
  DROP TABLE "_rosters_v" CASCADE;
  DROP TABLE "opponents" CASCADE;
  DROP TABLE "coaching_staff_coaches" CASCADE;
  DROP TABLE "coaching_staff" CASCADE;
  DROP TABLE "coaches" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "levels" CASCADE;
  DROP TABLE "years" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_games_game_type";
  DROP TYPE "public"."enum_games_status";
  DROP TYPE "public"."enum__games_v_version_game_type";
  DROP TYPE "public"."enum__games_v_version_status";
  DROP TYPE "public"."enum_players_position";
  DROP TYPE "public"."enum_rosters_status";
  DROP TYPE "public"."enum__rosters_v_version_status";
  DROP TYPE "public"."enum_coaching_staff_coaches_role";
  DROP TYPE "public"."enum_form_submissions_status";`)
}
