ALTER TABLE "previous_pastas" RENAME COLUMN "author_twitch_id" TO "publisher_twitch_id";--> statement-breakpoint
ALTER TABLE "previous_pastas" DROP CONSTRAINT "previous_pastas_author_twitch_id_twitch_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "previous_pastas" ADD CONSTRAINT "previous_pastas_publisher_twitch_id_twitch_users_id_fk" FOREIGN KEY ("publisher_twitch_id") REFERENCES "twitch_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
