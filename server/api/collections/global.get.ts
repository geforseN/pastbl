import { flatGroupBy } from "~/utils/object";
import {
  type EmoteSource,
  createFFZGlobalCollection,
  create7TVGlobalCollection,
  BetterTTV,
  IGlobalEmoteCollectionRecord,
} from "~/integrations";
import { BetterTTVApi } from "~/integrations/BetterTTV/api";
import { getFFZGlobalEmoteSets } from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";
import { get7TVGlobalEmotesSet } from "~/integrations/SevenTV/SevenTV.api";
import {
  type ITwitchGlobalEmoteResponse,
  makeTwitchGlobalCollection,
} from "~/integrations/Twitch";
import { getEmoteSourcesFromQuery } from "~/server/utils/emote-source";

export const getCachedGlobalCollection = defineCachedFunction(
  async (source: EmoteSource) => await getGlobalCollection(source),
  {
    maxAge: 60 * 10,
    swr: false,
    name: "global-collection",
    getKey: (source: EmoteSource) => source,
  },
);

export default defineEventHandler(async (event) => {
  // TODO: handleCacheHeaders(event, {});
  const sources = getEmoteSourcesFromQuery(event);
  const collections = await Promise.all(
    sources.map((source) => getCachedGlobalCollection(source)),
  );
  const groupedBySource = flatGroupBy(
    collections,
    (collection) => collection.source,
  );
  return groupedBySource as IGlobalEmoteCollectionRecord;
});

function getGlobalCollection(source: EmoteSource) {
  return globalEmotesGetters[source]();
}

const globalEmotesGetters = {
  async FrankerFaceZ() {
    const globalEmotes = await getFFZGlobalEmoteSets();
    return createFFZGlobalCollection(globalEmotes);
  },
  async BetterTTV() {
    const globalEmotes = await BetterTTVApi.getGlobalEmotes();
    return BetterTTV.giveGlobalCollection(globalEmotes);
  },
  async SevenTV() {
    const globalEmotes = await get7TVGlobalEmotesSet();
    return create7TVGlobalCollection(globalEmotes);
  },
  async Twitch() {
    const response = await twitchApi.fetch<ITwitchGlobalEmoteResponse>(
      "/chat/emotes/global",
    );
    return makeTwitchGlobalCollection(response);
  },
};
