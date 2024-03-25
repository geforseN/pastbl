DO $$ BEGIN
 CREATE TYPE "pasta_publicity" AS ENUM('public', 'private');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "pastas" RENAME COLUMN "author_twitch_id" TO "publisher_twitch_id";--> statement-breakpoint
ALTER TABLE "pastas" DROP CONSTRAINT "pastas_author_twitch_id_twitch_users_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "pastas_index";--> statement-breakpoint
ALTER TABLE "pastas" ADD COLUMN "publicity" "pasta_publicity" DEFAULT 'public' NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pastas_index" ON "pastas" ("publisher_twitch_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pastas" ADD CONSTRAINT "pastas_publisher_twitch_id_twitch_users_id_fk" FOREIGN KEY ("publisher_twitch_id") REFERENCES "twitch_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
