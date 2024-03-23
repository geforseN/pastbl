import { z } from "zod";

export const env = z
  .object({
    TWITCH_APP_CLIENT_SECRET: z.string(),
    TWITCH_APP_CLIENT_ID: z.string(),
    DATABASE_URL: z.string(),
  })
  .transform((env) => {
    return {
      twitchClientSecret: env.TWITCH_APP_CLIENT_SECRET,
      twitchClientId: env.TWITCH_APP_CLIENT_ID,
      databaseUrl: env.DATABASE_URL,
    };
  })
  .parse(process.env);
