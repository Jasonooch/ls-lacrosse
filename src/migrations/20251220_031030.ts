import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`games\` ADD \`level_id\` integer REFERENCES levels(id);`)
  await db.run(sql`CREATE INDEX \`games_level_idx\` ON \`games\` (\`level_id\`);`)
  await db.run(sql`ALTER TABLE \`_games_v\` ADD \`version_level_id\` integer REFERENCES levels(id);`)
  await db.run(sql`CREATE INDEX \`_games_v_version_version_level_idx\` ON \`_games_v\` (\`version_level_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
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
  await db.run(sql`CREATE TABLE \`__new__games_v\` (
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
  await db.run(sql`INSERT INTO \`__new__games_v\`("id", "parent_id", "version_slug", "version_name", "version_opponent_id", "version_season_id", "version_date", "version_location", "version_livestream_link", "version_game_type", "version_ls_final", "version_opponent_final", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_slug", "version_name", "version_opponent_id", "version_season_id", "version_date", "version_location", "version_livestream_link", "version_game_type", "version_ls_final", "version_opponent_final", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_games_v\`;`)
  await db.run(sql`DROP TABLE \`_games_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__games_v\` RENAME TO \`_games_v\`;`)
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
}
