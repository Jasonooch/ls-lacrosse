import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "hall_of_fame_honors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"honor" varchar NOT NULL
  );
  
  CREATE TABLE "hall_of_fame" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"induction_year" numeric NOT NULL,
  	"years_at_l_s" varchar,
  	"photo_id" integer,
  	"bio" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "hall_of_fame_id" integer;
  ALTER TABLE "hall_of_fame_honors" ADD CONSTRAINT "hall_of_fame_honors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hall_of_fame"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hall_of_fame" ADD CONSTRAINT "hall_of_fame_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "hall_of_fame_honors_order_idx" ON "hall_of_fame_honors" USING btree ("_order");
  CREATE INDEX "hall_of_fame_honors_parent_id_idx" ON "hall_of_fame_honors" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "hall_of_fame_slug_idx" ON "hall_of_fame" USING btree ("slug");
  CREATE INDEX "hall_of_fame_photo_idx" ON "hall_of_fame" USING btree ("photo_id");
  CREATE INDEX "hall_of_fame_updated_at_idx" ON "hall_of_fame" USING btree ("updated_at");
  CREATE INDEX "hall_of_fame_created_at_idx" ON "hall_of_fame" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hall_of_fame_fk" FOREIGN KEY ("hall_of_fame_id") REFERENCES "public"."hall_of_fame"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_hall_of_fame_id_idx" ON "payload_locked_documents_rels" USING btree ("hall_of_fame_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hall_of_fame_honors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hall_of_fame" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "hall_of_fame_honors" CASCADE;
  DROP TABLE "hall_of_fame" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_hall_of_fame_fk";
  
  DROP INDEX "payload_locked_documents_rels_hall_of_fame_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "hall_of_fame_id";`)
}
