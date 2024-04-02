import { z } from "zod";
import { toLowerCase } from "~/utils/string";
import { uniqueValues } from "~/utils/array";

const TWITCH_LOGIN_MIN_LENGTH = 3;
const TWITCH_LOGIN_MAX_LENGTH = 25;

export type TwitchUserLogin = Lowercase<string>;

const loginParamSchema = z
  .string()
  .min(TWITCH_LOGIN_MIN_LENGTH)
  .max(TWITCH_LOGIN_MAX_LENGTH)
  .transform((str) => toLowerCase(str.replace(/\s+/g, "")));

export function getTwitchLoginRouteParam(event: H3E) {
  return loginParamSchema.parse(getRouterParam(event, "login"));
}

const loginQuerySchema = z.object({
  login: loginParamSchema,
});

export function getTwitchLoginFromQuery(event: H3E) {
  return loginQuerySchema.parse(getQuery(event)).login;
}

const TWITCH_LOGINS_MAX_QUERY_STRING_COUNT =
  env.TWITCH_LOGINS_MAX_QUERY_STRING_COUNT;

const TWITCH_LOGINS_QUERY_STRING_PLUS_SIGN_COUNT =
  TWITCH_LOGINS_MAX_QUERY_STRING_COUNT - 1;

const TWITCH_LOGINS_QUERY_STRING_MAX_LENGTH =
  TWITCH_LOGIN_MAX_LENGTH * TWITCH_LOGINS_MAX_QUERY_STRING_COUNT +
  TWITCH_LOGINS_QUERY_STRING_PLUS_SIGN_COUNT;

const loginsQueryStringSchema = z
  .string({
    required_error: "No nicknames provided in the query string",
  })
  .min(TWITCH_LOGIN_MIN_LENGTH)
  .max(TWITCH_LOGINS_QUERY_STRING_MAX_LENGTH)
  .transform((loginsStr) => {
    const logins = loginsStr
      .split("+")
      .map((nickname) => toLowerCase(nickname.trim()));
    return uniqueValues(logins);
  });

export function getTwitchLoginsFromQuery(event: H3E) {
  return loginsQueryStringSchema.parse(getQuery(event).nicknames);
}
