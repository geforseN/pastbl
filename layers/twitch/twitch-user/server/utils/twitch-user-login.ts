import { z } from "zod";
import { uniqueValues } from "~/utils/array.ts";
import { twitchConfig } from "$/twitch/app.config";

export type TwitchUserLogin = Lowercase<string>;

export function isTwitchUserLogin(string: string): string is TwitchUserLogin {
  return isLowercase(string);
}

const loginParamSchema = z
  .string()
  .min(twitchConfig.twitchUser.login.length.min)
  .max(twitchConfig.twitchUser.login.length.max)
  .transform((string) => toLowerCase(string.replaceAll(/\s+/g, "")));

export function getTwitchLoginRouteParam(event: H3Event) {
  const parse = loginParamSchema.safeParse(getRouterParam(event, "login"));
  if (parse.success) {
    return parse.data;
  }
  const issue = parse.error.issues[0];
  assert.ok(issue, "Must be only one issue");
  const message = issue.message.replace("String", "Twitch User Login");
  throw createError({
    statusCode: 400,
    message,
    statusMessage: message,
    data: { issueCode: issue.code },
  });
}

const loginQuerySchema = z.object({
  login: loginParamSchema,
});

export function getTwitchLoginFromQuery(event: H3Event) {
  const parse = loginQuerySchema.safeParse(getQuery(event));
  if (parse.success) {
    return parse.data.login;
  }
  throw createError({ statusCode: 400, message: parse.error.message });
}

const TWITCH_LOGINS_MAX_QUERY_STRING_COUNT
  = environment.TWITCH_LOGINS_MAX_QUERY_STRING_COUNT;

const TWITCH_LOGINS_QUERY_STRING_PLUS_SIGN_COUNT
  = TWITCH_LOGINS_MAX_QUERY_STRING_COUNT - 1;

const TWITCH_LOGINS_QUERY_STRING_MAX_LENGTH
  = twitchConfig.twitchUser.login.length.max
    * TWITCH_LOGINS_MAX_QUERY_STRING_COUNT
    + TWITCH_LOGINS_QUERY_STRING_PLUS_SIGN_COUNT;

const loginsQueryStringSchema = z
  .string({
    required_error: "No nicknames provided in the query string",
  })
  .min(twitchConfig.twitchUser.login.length.min)
  .max(TWITCH_LOGINS_QUERY_STRING_MAX_LENGTH)
  .transform((loginsString) => {
    const logins = loginsString
      .split("+")
      .map((nickname) => toLowerCase(nickname.trim()));
    return uniqueValues(logins);
  });

export function getTwitchLoginsFromQuery(event: H3Event) {
  return loginsQueryStringSchema.parse(getQuery(event).nicknames);
}
