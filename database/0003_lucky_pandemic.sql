DROP TABLE "twitch_users";--> statement-breakpoint
ALTER TABLE "pastas" DROP CONSTRAINT "pastas_publisher_twitch_id_twitch_users_id_fk";
--> statement-breakpoint
ALTER TABLE "previous_pastas" DROP CONSTRAINT "previous_pastas_publisher_twitch_id_twitch_users_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "pastas_index";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "publisher_index" ON "pastas" ("publisher_twitch_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "publisher_uuid_index" ON "pastas" ("publisher_twitch_id","uuid");