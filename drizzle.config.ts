import { defineConfig } from "drizzle-kit";
import { env } from "~/server/utils/env";

export default defineConfig({
  schema: "./db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
  out: "./db",
});
