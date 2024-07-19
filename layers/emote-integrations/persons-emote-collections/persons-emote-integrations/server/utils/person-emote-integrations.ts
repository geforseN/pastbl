import { allEmoteSources } from "~~/layers/emote-integrations/emote-sources/utils/emote-sources"; 
import { flatGroupBySource } from "~~/layers/emote-integrations/emote-sources/server/utils/flat-group-by-source";

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
  twitch: PersonTwitch,
) {
  const getter = personIntegrationsGetters[source];
  const integration = await getter(twitch);
  return integration;
}

export async function getPersonEmoteIntegrations<S extends EmoteSource>(
  sources: S[],
  twitch: PersonTwitch,
) {
  const getters = sources.map((source) => personIntegrationsGetters[source]);
  const integrations = await Promise.all(
    getters.map((getIntegration) => getIntegration(twitch)),
  );
  const grouped = flatGroupBySource(integrations);
  return grouped;
}

export async function getPersonAllEmoteIntegrations(twitch: PersonTwitch) {
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

export function getPersonAllEmoteIntegrations2(twitch: PersonTwitch) {
  return getPersonEmoteIntegrations(allEmoteSources.values, twitch);
}
