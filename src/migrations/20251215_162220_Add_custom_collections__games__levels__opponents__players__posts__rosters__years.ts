import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`hero_image_id\` integer,
  	\`content\` text,
  	\`excerpt\` text,
  	\`published_at\` text,
  	\`author_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_slug_idx\` ON \`posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`posts_hero_image_idx\` ON \`posts\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_author_idx\` ON \`posts\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`posts__status_idx\` ON \`posts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_posts_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_hero_image_id\` integer,
  	\`version_content\` text,
  	\`version_excerpt\` text,
  	\`version_published_at\` text,
  	\`version_author_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_posts_v_parent_idx\` ON \`_posts_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_slug_idx\` ON \`_posts_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_hero_image_idx\` ON \`_posts_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_author_idx\` ON \`_posts_v\` (\`version_author_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_updated_at_idx\` ON \`_posts_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_created_at_idx\` ON \`_posts_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version__status_idx\` ON \`_posts_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_created_at_idx\` ON \`_posts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_updated_at_idx\` ON \`_posts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_latest_idx\` ON \`_posts_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_autosave_idx\` ON \`_posts_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`games\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`opponent_id\` integer NOT NULL,
  	\`season_id\` integer NOT NULL,
  	\`date\` text NOT NULL,
  	\`location\` text,
  	\`livestream_link\` text,
  	\`game_type\` text DEFAULT 'regular-season' NOT NULL,
  	\`ls_final\` numeric,
  	\`opponent_final\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`opponent_id\`) REFERENCES \`opponents\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`season_id\`) REFERENCES \`years\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`games_slug_idx\` ON \`games\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`games_opponent_idx\` ON \`games\` (\`opponent_id\`);`)
  await db.run(sql`CREATE INDEX \`games_season_idx\` ON \`games\` (\`season_id\`);`)
  await db.run(sql`CREATE INDEX \`games_updated_at_idx\` ON \`games\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`games_created_at_idx\` ON \`games\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`players\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`full_name\` text,
  	\`jersey_number\` numeric NOT NULL,
  	\`graduation_year_id\` integer NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`graduation_year_id\`) REFERENCES \`years\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`players_graduation_year_idx\` ON \`players\` (\`graduation_year_id\`);`)
  await db.run(sql`CREATE INDEX \`players_updated_at_idx\` ON \`players\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`players_created_at_idx\` ON \`players\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`rosters_players\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`player_id\` integer NOT NULL,
  	FOREIGN KEY (\`player_id\`) REFERENCES \`players\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`rosters\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`rosters_players_order_idx\` ON \`rosters_players\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`rosters_players_parent_id_idx\` ON \`rosters_players\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`rosters_players_player_idx\` ON \`rosters_players\` (\`player_id\`);`)
  await db.run(sql`CREATE TABLE \`rosters\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`season\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`rosters_updated_at_idx\` ON \`rosters\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`rosters_created_at_idx\` ON \`rosters\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`opponents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`short_name\` text NOT NULL,
  	\`logo_id\` integer,
  	\`school_address\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`opponents_slug_idx\` ON \`opponents\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`opponents_logo_idx\` ON \`opponents\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`opponents_updated_at_idx\` ON \`opponents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`opponents_created_at_idx\` ON \`opponents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`levels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`levels_updated_at_idx\` ON \`levels\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`levels_created_at_idx\` ON \`levels\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`years\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`year\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`years_year_idx\` ON \`years\` (\`year\`);`)
  await db.run(sql`CREATE INDEX \`years_updated_at_idx\` ON \`years\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`years_created_at_idx\` ON \`years\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`posts_id\` integer REFERENCES posts(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`games_id\` integer REFERENCES games(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`players_id\` integer REFERENCES players(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`rosters_id\` integer REFERENCES rosters(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`opponents_id\` integer REFERENCES opponents(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`levels_id\` integer REFERENCES levels(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`years_id\` integer REFERENCES years(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_games_id_idx\` ON \`payload_locked_documents_rels\` (\`games_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_players_id_idx\` ON \`payload_locked_documents_rels\` (\`players_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_rosters_id_idx\` ON \`payload_locked_documents_rels\` (\`rosters_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_opponents_id_idx\` ON \`payload_locked_documents_rels\` (\`opponents_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_levels_id_idx\` ON \`payload_locked_documents_rels\` (\`levels_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_years_id_idx\` ON \`payload_locked_documents_rels\` (\`years_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`posts\`;`)
  await db.run(sql`DROP TABLE \`_posts_v\`;`)
  await db.run(sql`DROP TABLE \`games\`;`)
  await db.run(sql`DROP TABLE \`players\`;`)
  await db.run(sql`DROP TABLE \`rosters_players\`;`)
  await db.run(sql`DROP TABLE \`rosters\`;`)
  await db.run(sql`DROP TABLE \`opponents\`;`)
  await db.run(sql`DROP TABLE \`levels\`;`)
  await db.run(sql`DROP TABLE \`years\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
}
