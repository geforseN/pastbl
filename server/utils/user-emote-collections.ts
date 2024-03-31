import { z } from "zod";
import { getUserEmoteCollection } from "~/server/api/collections/users/[login]/index.get";
import { EmoteSource, IUserEmoteIntegration } from "~/integrations";
import { getUserBetterTTVIntegration } from "~/server/api/collections/users/[login]/integrations/BetterTTV.get";
import { getUserFrankerFaceZIntegration } from "~/server/api/collections/users/[login]/integrations/FrankerFaceZ.get";
import { getUserSevenTVIntegration } from "~/server/api/collections/users/[login]/integrations/SevenTV.get";
import { getUserTwitchIntegration } from "~/server/api/collections/users/[login]/integrations/Twitch.get";
import { toLowerCase } from "~/utils/string";
import { flatGroupBy } from "~/utils/object";
import { uniqueValues } from "~/utils/array";
import type { TwitchUser } from "~/server/api/twitch/users/[login].get";

const TWITCH_LOGIN_MIN_LENGTH = 3;
const TWITCH_LOGIN_MAX_LENGTH = 32;

// FIXME: refine no spaces, \n, \t, etc.
const loginParamSchema = z
  .string()
  .trim()
  .min(TWITCH_LOGIN_MIN_LENGTH)
  .max(TWITCH_LOGIN_MAX_LENGTH)
  .transform(toLowerCase);

export function getTwitchLoginRouteParam(event: H3E) {
  return loginParamSchema.parse(getRouterParam(event, "login"));
}

const TWITCH_LOGINS_MAX_QUERY_STRING_COUNT =
  env.twitchLoginsMaxQueryStringCount;

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

function handleEmoteIntegrationError(
  fail: unknown,
  source: EmoteSource,
  nickname: string,
) {
  const reason =
    fail instanceof Error
      ? fail.message
      : `Failed to load ${source} integration of ${nickname}`;
  return {
    status: "fail" as const,
    source,
    reason,
  };
}

function withReadyStatus<I extends IUserEmoteIntegration>(integration: I) {
  return {
    ...integration,
    status: "ready" as const,
  };
}

export function makeUserIntegrationGetter(
  source: EmoteSource,
  getUserCollectionIntegration: (
    account: TwitchUser,
  ) => Promise<IUserEmoteIntegration>,
) {
  return async (account: TwitchUser) => {
    try {
      const integration = await getUserCollectionIntegration(account);
      return withReadyStatus(integration);
    } catch (error) {
      return handleEmoteIntegrationError(error, source, account.nickname);
    }
  };
}

const userIntegrationsGetters = {
  BetterTTV: getUserBetterTTVIntegration,
  FrankerFaceZ: getUserFrankerFaceZIntegration,
  SevenTV: getUserSevenTVIntegration,
  Twitch: getUserTwitchIntegration,
};

export async function getUserEmoteIntegrations(
  sources: EmoteSource[],
  account: TwitchUser,
) {
  const getters = sources.map((source) => userIntegrationsGetters[source]);
  const integrations = await Promise.all(
    getters.map((getter) => getter(account)),
  );
  const grouped = flatGroupBy(
    integrations,
    (integration) => integration.source,
  );
  return grouped;
}

export async function getUsersEmoteCollections(logins: Lowercase<string>[]) {
  const collections = await Promise.all(
    logins.map((login) => getUserEmoteCollection(login)),
  );
  const grouped = flatGroupBy(
    collections,
    (collection) => collection.user.twitch.login,
  );
  return grouped;
}
