import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`_games_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_name\` text,
  	\`version_opponent_id\` integer,
  	\`version_season_id\` integer,
  	\`version_date\` text,
  	\`version_location\` text,
  	\`version_livestream_link\` text,
  	\`version_game_type\` text DEFAULT 'regular-season',
  	\`version_ls_final\` numeric,
  	\`version_opponent_final\` numeric,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`games\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_opponent_id\`) REFERENCES \`opponents\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_season_id\`) REFERENCES \`years\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_games_v_parent_idx\` ON \`_games_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_games_v_version_version_slug_idx\` ON \`_games_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_games_v_version_version_opponent_idx\` ON \`_games_v\` (\`version_opponent_id\`);`)
  await db.run(sql`CREATE INDEX \`_games_v_version_version_season_idx\` ON \`_games_v\` (\`version_season_id\`);`)
  await db.run(sql`CREATE INDEX \`_games_v_version_version_updated_at_idx\` ON \`_games_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_games_v_version_version_created_at_idx\` ON \`_games_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_games_v_version_version__status_idx\` ON \`_games_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_games_v_created_at_idx\` ON \`_games_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_games_v_updated_at_idx\` ON \`_games_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_games_v_latest_idx\` ON \`_games_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_rosters_v_version_players\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`player_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`player_id\`) REFERENCES \`players\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_rosters_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_rosters_v_version_players_order_idx\` ON \`_rosters_v_version_players\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_rosters_v_version_players_parent_id_idx\` ON \`_rosters_v_version_players\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_rosters_v_version_players_player_idx\` ON \`_rosters_v_version_players\` (\`player_id\`);`)
  await db.run(sql`CREATE TABLE \`_rosters_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_season\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`rosters\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_rosters_v_parent_idx\` ON \`_rosters_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_rosters_v_version_version_updated_at_idx\` ON \`_rosters_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_rosters_v_version_version_created_at_idx\` ON \`_rosters_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_rosters_v_version_version__status_idx\` ON \`_rosters_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_rosters_v_created_at_idx\` ON \`_rosters_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_rosters_v_updated_at_idx\` ON \`_rosters_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_rosters_v_latest_idx\` ON \`_rosters_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`coaching_staff_coaches\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`coach_id\` integer NOT NULL,
  	\`role\` text DEFAULT 'assistant',
  	FOREIGN KEY (\`coach_id\`) REFERENCES \`coaches\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`coaching_staff\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`coaching_staff_coaches_order_idx\` ON \`coaching_staff_coaches\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`coaching_staff_coaches_parent_id_idx\` ON \`coaching_staff_coaches\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`coaching_staff_coaches_coach_idx\` ON \`coaching_staff_coaches\` (\`coach_id\`);`)
  await db.run(sql`CREATE TABLE \`coaching_staff\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`year\` text NOT NULL,
  	\`level_id\` integer NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`level_id\`) REFERENCES \`levels\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`coaching_staff_year_idx\` ON \`coaching_staff\` (\`year\`);`)
  await db.run(sql`CREATE INDEX \`coaching_staff_level_idx\` ON \`coaching_staff\` (\`level_id\`);`)
  await db.run(sql`CREATE INDEX \`coaching_staff_updated_at_idx\` ON \`coaching_staff\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`coaching_staff_created_at_idx\` ON \`coaching_staff\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`coaches\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`full_name\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`coaches_updated_at_idx\` ON \`coaches\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`coaches_created_at_idx\` ON \`coaches\` (\`created_at\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_games\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`name\` text,
  	\`opponent_id\` integer,
  	\`season_id\` integer,
  	\`date\` text,
  	\`location\` text,
  	\`livestream_link\` text,
  	\`game_type\` text DEFAULT 'regular-season',
  	\`ls_final\` numeric,
  	\`opponent_final\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`opponent_id\`) REFERENCES \`opponents\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`season_id\`) REFERENCES \`years\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_games\`("id", "slug", "name", "opponent_id", "season_id", "date", "location", "livestream_link", "game_type", "ls_final", "opponent_final", "updated_at", "created_at", "_status") SELECT "id", "slug", "name", "opponent_id", "season_id", "date", "location", "livestream_link", "game_type", "ls_final", "opponent_final", "updated_at", "created_at", "_status" FROM \`games\`;`)
  await db.run(sql`DROP TABLE \`games\`;`)
  await db.run(sql`ALTER TABLE \`__new_games\` RENAME TO \`games\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`games_slug_idx\` ON \`games\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`games_opponent_idx\` ON \`games\` (\`opponent_id\`);`)
  await db.run(sql`CREATE INDEX \`games_season_idx\` ON \`games\` (\`season_id\`);`)
  await db.run(sql`CREATE INDEX \`games_updated_at_idx\` ON \`games\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`games_created_at_idx\` ON \`games\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`games__status_idx\` ON \`games\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_rosters_players\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`player_id\` integer,
  	FOREIGN KEY (\`player_id\`) REFERENCES \`players\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`rosters\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_rosters_players\`("_order", "_parent_id", "id", "player_id") SELECT "_order", "_parent_id", "id", "player_id" FROM \`rosters_players\`;`)
  await db.run(sql`DROP TABLE \`rosters_players\`;`)
  await db.run(sql`ALTER TABLE \`__new_rosters_players\` RENAME TO \`rosters_players\`;`)
  await db.run(sql`CREATE INDEX \`rosters_players_order_idx\` ON \`rosters_players\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`rosters_players_parent_id_idx\` ON \`rosters_players\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`rosters_players_player_idx\` ON \`rosters_players\` (\`player_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_rosters\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`season\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`INSERT INTO \`__new_rosters\`("id", "season", "updated_at", "created_at", "_status") SELECT "id", "season", "updated_at", "created_at", "_status" FROM \`rosters\`;`)
  await db.run(sql`DROP TABLE \`rosters\`;`)
  await db.run(sql`ALTER TABLE \`__new_rosters\` RENAME TO \`rosters\`;`)
  await db.run(sql`CREATE INDEX \`rosters_updated_at_idx\` ON \`rosters\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`rosters_created_at_idx\` ON \`rosters\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`rosters__status_idx\` ON \`rosters\` (\`_status\`);`)
  await db.run(sql`ALTER TABLE \`players\` ADD \`position\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`coaching_staff_id\` integer REFERENCES coaching_staff(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`coaches_id\` integer REFERENCES coaches(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_coaching_staff_id_idx\` ON \`payload_locked_documents_rels\` (\`coaching_staff_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_coaches_id_idx\` ON \`payload_locked_documents_rels\` (\`coaches_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_games_v\`;`)
  await db.run(sql`DROP TABLE \`_rosters_v_version_players\`;`)
  await db.run(sql`DROP TABLE \`_rosters_v\`;`)
  await db.run(sql`DROP TABLE \`coaching_staff_coaches\`;`)
  await db.run(sql`DROP TABLE \`coaching_staff\`;`)
  await db.run(sql`DROP TABLE \`coaches\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`posts_id\` integer,
  	\`games_id\` integer,
  	\`players_id\` integer,
  	\`rosters_id\` integer,
  	\`opponents_id\` integer,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`levels_id\` integer,
  	\`years_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`games_id\`) REFERENCES \`games\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`players_id\`) REFERENCES \`players\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`rosters_id\`) REFERENCES \`rosters\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`opponents_id\`) REFERENCES \`opponents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`levels_id\`) REFERENCES \`levels\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`years_id\`) REFERENCES \`years\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "posts_id", "games_id", "players_id", "rosters_id", "opponents_id", "users_id", "media_id", "levels_id", "years_id") SELECT "id", "order", "parent_id", "path", "posts_id", "games_id", "players_id", "rosters_id", "opponents_id", "users_id", "media_id", "levels_id", "years_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_games_id_idx\` ON \`payload_locked_documents_rels\` (\`games_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_players_id_idx\` ON \`payload_locked_documents_rels\` (\`players_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_rosters_id_idx\` ON \`payload_locked_documents_rels\` (\`rosters_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_opponents_id_idx\` ON \`payload_locked_documents_rels\` (\`opponents_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_levels_id_idx\` ON \`payload_locked_documents_rels\` (\`levels_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_years_id_idx\` ON \`payload_locked_documents_rels\` (\`years_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_games\` (
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
  await db.run(sql`INSERT INTO \`__new_games\`("id", "slug", "name", "opponent_id", "season_id", "date", "location", "livestream_link", "game_type", "ls_final", "opponent_final", "updated_at", "created_at") SELECT "id", "slug", "name", "opponent_id", "season_id", "date", "location", "livestream_link", "game_type", "ls_final", "opponent_final", "updated_at", "created_at" FROM \`games\`;`)
  await db.run(sql`DROP TABLE \`games\`;`)
  await db.run(sql`ALTER TABLE \`__new_games\` RENAME TO \`games\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`games_slug_idx\` ON \`games\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`games_opponent_idx\` ON \`games\` (\`opponent_id\`);`)
  await db.run(sql`CREATE INDEX \`games_season_idx\` ON \`games\` (\`season_id\`);`)
  await db.run(sql`CREATE INDEX \`games_updated_at_idx\` ON \`games\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`games_created_at_idx\` ON \`games\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_rosters\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`season\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_rosters\`("id", "season", "updated_at", "created_at") SELECT "id", "season", "updated_at", "created_at" FROM \`rosters\`;`)
  await db.run(sql`DROP TABLE \`rosters\`;`)
  await db.run(sql`ALTER TABLE \`__new_rosters\` RENAME TO \`rosters\`;`)
  await db.run(sql`CREATE INDEX \`rosters_updated_at_idx\` ON \`rosters\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`rosters_created_at_idx\` ON \`rosters\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_rosters_players\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`player_id\` integer NOT NULL,
  	FOREIGN KEY (\`player_id\`) REFERENCES \`players\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`rosters\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_rosters_players\`("_order", "_parent_id", "id", "player_id") SELECT "_order", "_parent_id", "id", "player_id" FROM \`rosters_players\`;`)
  await db.run(sql`DROP TABLE \`rosters_players\`;`)
  await db.run(sql`ALTER TABLE \`__new_rosters_players\` RENAME TO \`rosters_players\`;`)
  await db.run(sql`CREATE INDEX \`rosters_players_order_idx\` ON \`rosters_players\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`rosters_players_parent_id_idx\` ON \`rosters_players\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`rosters_players_player_idx\` ON \`rosters_players\` (\`player_id\`);`)
  await db.run(sql`ALTER TABLE \`players\` DROP COLUMN \`position\`;`)
}
