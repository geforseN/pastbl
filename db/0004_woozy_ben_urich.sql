DROP INDEX IF EXISTS "publisher_index";--> statement-breakpoint
DROP INDEX IF EXISTS "publisher_uuid_index";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "publisher_newest" ON "pastas" ("publisher_twitch_id","published_at");