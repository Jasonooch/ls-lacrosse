import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`form_submissions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`form_name\` text NOT NULL,
  	\`name\` text,
  	\`email\` text,
  	\`payload\` text NOT NULL,
  	\`status\` text DEFAULT 'new',
  	\`source_page\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`form_submissions_form_name_idx\` ON \`form_submissions\` (\`form_name\`);`)
  await db.run(sql`CREATE INDEX \`form_submissions_updated_at_idx\` ON \`form_submissions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`form_submissions_created_at_idx\` ON \`form_submissions\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`form_submissions_id\` integer REFERENCES form_submissions(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`form_submissions\`;`)
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
  	\`coaching_staff_id\` integer,
  	\`coaches_id\` integer,
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
  	FOREIGN KEY (\`coaching_staff_id\`) REFERENCES \`coaching_staff\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`coaches_id\`) REFERENCES \`coaches\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`levels_id\`) REFERENCES \`levels\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`years_id\`) REFERENCES \`years\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "posts_id", "games_id", "players_id", "rosters_id", "opponents_id", "coaching_staff_id", "coaches_id", "users_id", "media_id", "levels_id", "years_id") SELECT "id", "order", "parent_id", "path", "posts_id", "games_id", "players_id", "rosters_id", "opponents_id", "coaching_staff_id", "coaches_id", "users_id", "media_id", "levels_id", "years_id" FROM \`payload_locked_documents_rels\`;`)
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
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_coaching_staff_id_idx\` ON \`payload_locked_documents_rels\` (\`coaching_staff_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_coaches_id_idx\` ON \`payload_locked_documents_rels\` (\`coaches_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_levels_id_idx\` ON \`payload_locked_documents_rels\` (\`levels_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_years_id_idx\` ON \`payload_locked_documents_rels\` (\`years_id\`);`)
}
