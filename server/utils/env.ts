import { z } from "zod";

export const env = z
  .object({
    TWITCH_APP_CLIENT_SECRET: z.string(),
    TWITCH_APP_CLIENT_ID: z.string(),
    DATABASE_URL: z.string(),
    TWITCH_LOGINS_MAX_QUERY_STRING_COUNT: z
      .optional(z.coerce.number().int().positive())
      .default(10),
  })
  .transform((env) => {
    return {
      twitchClientSecret: env.TWITCH_APP_CLIENT_SECRET,
      twitchClientId: env.TWITCH_APP_CLIENT_ID,
      databaseUrl: env.DATABASE_URL,
      twitchLoginsMaxQueryStringCount: env.TWITCH_LOGINS_MAX_QUERY_STRING_COUNT,
    };
  })
  .parse(process.env);
