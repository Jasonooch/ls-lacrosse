import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`form_submissions\` ADD \`formatted_data\` text;`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`form_submissions\` DROP COLUMN \`formatted_data\`;`)
}
