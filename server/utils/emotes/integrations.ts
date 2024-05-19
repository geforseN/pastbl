import { EmoteSource, emoteSources } from "~/integrations/emote-source";
import { BetterTTV } from "~/integrations/BetterTTV";
import { FrankerFaceZ } from "~/integrations/FrankerFaceZ";
import { SevenTV } from "~/integrations/SevenTV";
import { Twitch } from "~/integrations/Twitch";
import { flatGroupBySource } from "~/utils/emote-collection";

// NOTE: this functions will always return resolved promises because in makeIntegrationGetter error caught and object with status="failed" & reason is returned
export const personIntegrationsGetters = {
  BetterTTV: makeIntegrationGetter("BetterTTV", BetterTTV.getPersonIntegration),
  FrankerFaceZ: makeIntegrationGetter(
    "FrankerFaceZ",
    FrankerFaceZ.getPersonIntegration,
  ),
  SevenTV: makeIntegrationGetter("SevenTV", SevenTV.getPersonIntegration),
  Twitch: makeIntegrationGetter("Twitch", Twitch.getPersonIntegration),
};

export async function getPersonEmoteIntegration<S extends EmoteSource>(
  source: S,
  account: TwitchUser,
) {
  const getter = personIntegrationsGetters[source];
  const integration = await getter(account);
  return integration;
}

export async function getPersonEmoteIntegrations<S extends EmoteSource>(
  sources: S[],
  twitch: TwitchUser,
) {
  const getters = sources.map((source) => personIntegrationsGetters[source]);
  const integrations = await Promise.all(
    getters.map((getIntegration) => getIntegration(twitch)),
  );
  const grouped = flatGroupBySource(integrations);
  return grouped;
}

export async function getPersonAllEmoteIntegrations(twitch: TwitchUser) {
  const [BetterTTV, FrankerFaceZ, SevenTV, Twitch] = await Promise.all([
    personIntegrationsGetters.BetterTTV(twitch),
    personIntegrationsGetters.FrankerFaceZ(twitch),
    personIntegrationsGetters.SevenTV(twitch),
    personIntegrationsGetters.Twitch(twitch),
  ]);
  return {
    BetterTTV,
    FrankerFaceZ,
    SevenTV,
    Twitch,
  };
}

export function getPersonAllEmoteIntegrations2(user: TwitchUser) {
  return getPersonEmoteIntegrations(emoteSources, user);
}
