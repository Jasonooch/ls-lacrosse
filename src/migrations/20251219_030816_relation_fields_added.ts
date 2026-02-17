import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`posts\` ADD \`photo_attribution\` text;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`season_id\` integer REFERENCES years(id);`)
  await db.run(sql`CREATE INDEX \`posts_season_idx\` ON \`posts\` (\`season_id\`);`)
  await db.run(sql`ALTER TABLE \`posts\` DROP COLUMN \`excerpt\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_photo_attribution\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_season_id\` integer REFERENCES years(id);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_season_idx\` ON \`_posts_v\` (\`version_season_id\`);`)
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`version_excerpt\`;`)
  await db.run(sql`ALTER TABLE \`rosters\` ADD \`season_id\` integer REFERENCES years(id);`)
  await db.run(sql`CREATE INDEX \`rosters_season_idx\` ON \`rosters\` (\`season_id\`);`)
  await db.run(sql`ALTER TABLE \`rosters\` DROP COLUMN \`season\`;`)
  await db.run(sql`ALTER TABLE \`_rosters_v\` ADD \`version_season_id\` integer REFERENCES years(id);`)
  await db.run(sql`CREATE INDEX \`_rosters_v_version_version_season_idx\` ON \`_rosters_v\` (\`version_season_id\`);`)
  await db.run(sql`ALTER TABLE \`_rosters_v\` DROP COLUMN \`version_season\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_posts\` (
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
  await db.run(sql`INSERT INTO \`__new_posts\`("id", "title", "slug", "hero_image_id", "content", "excerpt", "published_at", "author_id", "updated_at", "created_at", "_status") SELECT "id", "title", "slug", "hero_image_id", "content", "excerpt", "published_at", "author_id", "updated_at", "created_at", "_status" FROM \`posts\`;`)
  await db.run(sql`DROP TABLE \`posts\`;`)
  await db.run(sql`ALTER TABLE \`__new_posts\` RENAME TO \`posts\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_slug_idx\` ON \`posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`posts_hero_image_idx\` ON \`posts\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_author_idx\` ON \`posts\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`posts__status_idx\` ON \`posts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__posts_v\` (
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
  await db.run(sql`INSERT INTO \`__new__posts_v\`("id", "parent_id", "version_title", "version_slug", "version_hero_image_id", "version_content", "version_excerpt", "version_published_at", "version_author_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave") SELECT "id", "parent_id", "version_title", "version_slug", "version_hero_image_id", "version_content", "version_excerpt", "version_published_at", "version_author_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave" FROM \`_posts_v\`;`)
  await db.run(sql`DROP TABLE \`_posts_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__posts_v\` RENAME TO \`_posts_v\`;`)
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
  await db.run(sql`CREATE TABLE \`__new__rosters_v\` (
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
  await db.run(sql`INSERT INTO \`__new__rosters_v\`("id", "parent_id", "version_season", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_season", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_rosters_v\`;`)
  await db.run(sql`DROP TABLE \`_rosters_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__rosters_v\` RENAME TO \`_rosters_v\`;`)
  await db.run(sql`CREATE INDEX \`_rosters_v_parent_idx\` ON \`_rosters_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_rosters_v_version_version_updated_at_idx\` ON \`_rosters_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_rosters_v_version_version_created_at_idx\` ON \`_rosters_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_rosters_v_version_version__status_idx\` ON \`_rosters_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_rosters_v_created_at_idx\` ON \`_rosters_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_rosters_v_updated_at_idx\` ON \`_rosters_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_rosters_v_latest_idx\` ON \`_rosters_v\` (\`latest\`);`)
}
