ALTER TABLE "pastas" RENAME COLUMN "updated_at" TO "last_updated_at";--> statement-breakpoint
ALTER TABLE "pastas_tags" DROP CONSTRAINT "pastas_tags_pasta_id_pastas_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "publisher_newest";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pastas_tags" ADD CONSTRAINT "pastas_tags_pasta_id_pastas_id_fk" FOREIGN KEY ("pasta_id") REFERENCES "public"."pastas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "publisher_newest" ON "pastas" USING btree ("publisher_twitch_id","published_at" DESC NULLS LAST);