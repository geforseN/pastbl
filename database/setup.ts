import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "~~/database/schema.ts";
import { environment } from "~~/server/utils/environment.ts";

export const client = postgres(environment.DATABASE_URL);
export const database = drizzle(client, { schema, logger: true, casing: "snake_case" });
