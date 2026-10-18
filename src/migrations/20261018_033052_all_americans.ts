import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "players_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"years_id" integer
  );
  
  ALTER TABLE "players" ALTER COLUMN "position" DROP NOT NULL;
  ALTER TABLE "players" ALTER COLUMN "jersey_number" DROP NOT NULL;
  ALTER TABLE "players" ADD COLUMN "all_american" boolean DEFAULT false;
  ALTER TABLE "players_rels" ADD CONSTRAINT "players_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "players_rels" ADD CONSTRAINT "players_rels_years_fk" FOREIGN KEY ("years_id") REFERENCES "public"."years"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "players_rels_order_idx" ON "players_rels" USING btree ("order");
  CREATE INDEX "players_rels_parent_idx" ON "players_rels" USING btree ("parent_id");
  CREATE INDEX "players_rels_path_idx" ON "players_rels" USING btree ("path");
  CREATE INDEX "players_rels_years_id_idx" ON "players_rels" USING btree ("years_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "players_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "players_rels" CASCADE;
  ALTER TABLE "players" ALTER COLUMN "position" SET NOT NULL;
  ALTER TABLE "players" ALTER COLUMN "jersey_number" SET NOT NULL;
  ALTER TABLE "players" DROP COLUMN "all_american";`)
}
