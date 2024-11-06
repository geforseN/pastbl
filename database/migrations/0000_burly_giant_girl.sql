CREATE TABLE IF NOT EXISTS "pastas" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" varchar(1984) NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"author_twitch_id" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pastas_tags" (
	"tag" varchar(128) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "previous_pastas" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"text" varchar(1984) NOT NULL,
	"author_twitch_id" varchar NOT NULL,
	"last_updated_at" timestamp NOT NULL,
	"tags_string" varchar(1289) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags_to_pastas" (
	"tag_id" varchar NOT NULL,
	"pasta_uuid" uuid NOT NULL,
	CONSTRAINT "tags_to_pastas_tag_id_pasta_uuid_pk" PRIMARY KEY("tag_id","pasta_uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "twitch_users" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"nickname" varchar(25) NOT NULL,
	"login" varchar(25) NOT NULL,
	"description" varchar(192),
	"profile_image_url" varchar(192),
	CONSTRAINT "twitch_users_nickname_unique" UNIQUE("nickname"),
	CONSTRAINT "twitch_users_login_unique" UNIQUE("login")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pastas_index" ON "pastas" ("author_twitch_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tags_index" ON "pastas_tags" ("tag");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pastas" ADD CONSTRAINT "pastas_author_twitch_id_twitch_users_id_fk" FOREIGN KEY ("author_twitch_id") REFERENCES "twitch_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "previous_pastas" ADD CONSTRAINT "previous_pastas_uuid_pastas_uuid_fk" FOREIGN KEY ("uuid") REFERENCES "pastas"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "previous_pastas" ADD CONSTRAINT "previous_pastas_author_twitch_id_twitch_users_id_fk" FOREIGN KEY ("author_twitch_id") REFERENCES "twitch_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags_to_pastas" ADD CONSTRAINT "tags_to_pastas_tag_id_pastas_tags_tag_fk" FOREIGN KEY ("tag_id") REFERENCES "pastas_tags"("tag") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags_to_pastas" ADD CONSTRAINT "tags_to_pastas_pasta_uuid_pastas_uuid_fk" FOREIGN KEY ("pasta_uuid") REFERENCES "pastas"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
