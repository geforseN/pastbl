import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "~~/database/schema";
import { environment } from "~~/server/utils/environment";

export const client = postgres(environment.DATABASE_URL);
export const database = drizzle(client, { schema, logger: true });
