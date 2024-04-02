import { getUserBetterTTVIntegration } from "./BetterTTV";
import { getUserFrankerFaceZIntegration } from "./FrankerFaceZ";
import { getUserSevenTVIntegration } from "./SevenTV";
import { getUserTwitchIntegration } from "./Twitch";
import { flatGroupBy } from "~/utils/object";
import { EmoteSource, emoteSources } from "~/integrations";

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
