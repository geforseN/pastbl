import { defineConfig } from "drizzle-kit";
import { environment } from "./server/utils/environment.ts";

export default defineConfig({
  schema: "./database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: environment.DATABASE_URL,
  },
  out: "./database/migrations",
  casing: "snake_case",
  verbose: true,
  strict: true,
});
