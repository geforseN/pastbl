import { z } from "zod";

const environmentSchema = z
  .object({
    TWITCH_APP_CLIENT_SECRET: z.string(),
    NUXT_OAUTH_TWITCH_CLIENT_SECRET: z.string().optional(),
    TWITCH_APP_CLIENT_ID: z.string(),
    NUXT_OAUTH_TWITCH_CLIENT_ID: z.string().optional(),
    DATABASE_URL: z.string(),
    TWITCH_LOGINS_MAX_QUERY_STRING_COUNT: z
      .optional(z.coerce.number().int().positive())
      .default(10),
  })
  .transform((environment) => {
    return {
      ...environment,
      NUXT_OAUTH_TWITCH_CLIENT_SECRET:
        environment.NUXT_OAUTH_TWITCH_CLIENT_SECRET ??
        environment.TWITCH_APP_CLIENT_SECRET,
      NUXT_OAUTH_TWITCH_CLIENT_ID:
        environment.NUXT_OAUTH_TWITCH_CLIENT_ID ??
        environment.TWITCH_APP_CLIENT_ID,
    };
  });

const environmentParse = environmentSchema.safeParse(process.env);

if (!environmentParse.success && !import.meta.test) {
  throw environmentParse.error;
}

export const environment = (environmentParse.data || {}) as z.infer<
  typeof environmentSchema
>;
