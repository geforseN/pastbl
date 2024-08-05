import consola from "consola";
import type { FrankerFaceZApi } from "$/emote-integrations/integrations/frankerfacez/server/utils/api-types";
import type { TFrankerFaceZ } from "$/emote-integrations/integrations/frankerfacez/server/utils/types";

export const makeFrankerFaceZGlobalIntegration =
  defineGlobalIntegrationMaker<TFrankerFaceZ.Global.ReadyIntegration>(
    "FrankerFaceZ",
  );

export function transformFrankerFaceZGlobalSets(
  response: FrankerFaceZApi.GlobalStruct,
) {
  const defaultEmoteSetsIds = new Set(response.default_sets.map(String));
  const specificEmoteSets = new Map(Object.entries(response.user_ids));
  return Object.values(response.sets)
    .map(makeMappedFrankerFaceZEmoteSet)
    .map((set) => {
      if (defaultEmoteSetsIds.has(set.id)) {
        return transformFrankerFaceZGlobalSet(set);
      }
      const twitchIds = specificEmoteSets.get(set.id);
      if (twitchIds) {
        return transformFrankerFaceZSpecificSet(set, twitchIds);
      }
      consola.error(
        "FrankerFaceZ API returned data with different schema, internal code must be changed",
      );
    })
    .filter(isNotNullable);
}

function makeFrankerFaceZGlobalEmote(
  emote: FrankerFaceZApi.Emote,
): TFrankerFaceZ.GlobalEmote {
  return makeFrankerFaceZEmote<TFrankerFaceZ.GlobalEmote>(emote, "global");
}

function transformFrankerFaceZGlobalSet(
  set: FrankerFaceZMappedEmoteSet,
): TFrankerFaceZ.GlobalEmoteSet {
  return {
    name: set.title,
    id: set.id,
    type: "global",
    source: "FrankerFaceZ",
    emotes: set.emoticons.map(makeFrankerFaceZGlobalEmote),
  };
}

function makeFrankerFaceZSpecificEmote(emote: FrankerFaceZApi.Emote) {
  return makeFrankerFaceZEmote<TFrankerFaceZ.SpecificEmote>(emote, "specific");
}

function transformFrankerFaceZSpecificSet(
  set: FrankerFaceZMappedEmoteSet,
  twitchIds: number[],
): TFrankerFaceZ.SpecificEmoteSet {
  return {
    name: set.title,
    id: set.id,
    type: "specific",
    source: "FrankerFaceZ",
    emotes: set.emoticons.map(makeFrankerFaceZSpecificEmote),
    allowedTo: {
      twitchIds,
    },
  };
}
