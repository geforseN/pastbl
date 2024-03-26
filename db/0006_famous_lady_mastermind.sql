DROP TABLE "previous_pastas";--> statement-breakpoint
DROP TABLE "tags_to_pastas";--> statement-breakpoint
DROP INDEX IF EXISTS "tags_index";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'pastas_tags'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "pastas_tags" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "pastas_tags" ADD CONSTRAINT "pastas_tags_pasta_id_tag_pk" PRIMARY KEY("pasta_id","tag");--> statement-breakpoint
ALTER TABLE "pastas" ADD COLUMN "id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "pastas_tags" ADD COLUMN "pasta_id" integer NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pastas" ON "pastas_tags" ("pasta_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "values" ON "pastas_tags" ("tag");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pastas_tags" ADD CONSTRAINT "pastas_tags_pasta_id_pastas_id_fk" FOREIGN KEY ("pasta_id") REFERENCES "pastas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "pastas" DROP COLUMN IF EXISTS "uuid";