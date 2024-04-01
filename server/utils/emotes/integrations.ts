import { getUserBetterTTVIntegration } from "./BetterTTV";
import { getUserFrankerFaceZIntegration } from "./FrankerFaceZ";
import { getUserSevenTVIntegration } from "./SevenTV";
import { getUserTwitchIntegration } from "./Twitch";
import { flatGroupBy } from "~/utils/object";
import {
  EmoteSource,
  emoteSources,
  IUserEmoteIntegration,
} from "~/integrations";

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

export function makeUserIntegrationGetter<S extends EmoteSource>(
  source: S,
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

export async function getUserEmoteIntegration<S extends EmoteSource>(
  source: S,
  account: TwitchUser,
) {
  const getter = userIntegrationsGetters[source];
  const integration = await getter(account);
  return integration;
}

export async function getUserEmoteIntegrations<S extends EmoteSource>(
  sources: Readonly<S[]>,
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

export async function getUserAllEmoteIntegrations(user: TwitchUser) {
  const [BetterTTV, FrankerFaceZ, SevenTV, Twitch] = await Promise.all([
    userIntegrationsGetters.BetterTTV(user),
    userIntegrationsGetters.FrankerFaceZ(user),
    userIntegrationsGetters.SevenTV(user),
    userIntegrationsGetters.Twitch(user),
  ]);
  return {
    BetterTTV,
    FrankerFaceZ,
    SevenTV,
    Twitch,
  };
}

export function getUserAllEmoteIntegrations2(user: TwitchUser) {
  return getUserEmoteIntegrations(emoteSources, user);
}
