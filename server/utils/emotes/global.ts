import { EmoteSource } from "~/integrations";
import { flatGroupBy } from "~/utils/object";

const globalEmoteCollectionsGetters = {
  BetterTTV: getBetterTTVGlobalCollection,
  FrankerFaceZ: getFrankerFaceZGlobalCollection,
  SevenTV: getSevenTVGlobalCollection,
  Twitch: getTwitchGlobalCollection,
};

export async function getAllGlobalEmoteCollections() {
  // TODO: add timeout
  // TODO: ? add streaming ?
  const [BetterTTV, FrankerFaceZ, SevenTV, Twitch] = await Promise.all([
    globalEmoteCollectionsGetters.BetterTTV(),
    globalEmoteCollectionsGetters.FrankerFaceZ(),
    globalEmoteCollectionsGetters.SevenTV(),
    globalEmoteCollectionsGetters.Twitch(),
  ]);

  return {
    BetterTTV,
    FrankerFaceZ,
    SevenTV,
    Twitch,
  };
}

export async function getGlobalEmoteCollections(sources: EmoteSource[]) {
  const getters = sources.map(
    (source) => globalEmoteCollectionsGetters[source],
  );
  const collections = await Promise.all(getters.map((getter) => getter()));
  const grouped = flatGroupBy(collections, (collection) => collection.source);
  return grouped;
}
