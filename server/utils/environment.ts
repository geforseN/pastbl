import { z } from "zod";

export const environment = z
  .object({
    TWITCH_APP_CLIENT_SECRET: z.string(),
    TWITCH_APP_CLIENT_ID: z.string(),
    DATABASE_URL: z.string(),
    TWITCH_LOGINS_MAX_QUERY_STRING_COUNT: z
      .optional(z.coerce.number().int().positive())
      .default(10),
  })
  .parse(process.env);
