import { z } from "zod";
import { sum } from "~/utils/array";
import { flatGroupBy } from "~/utils/object";
import {
  type EmoteSource,
  emoteSources,
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

export const getCachedGlobalCollection = defineCachedFunction(
  async (source: EmoteSource) => await getGlobalCollection(source),
  {
    maxAge: 60 * 10 /* 10 minutes */,
    swr: false,
    name: "global-collection",
    getKey: (source: EmoteSource) => source,
  },
);

const querySchema = z.object({
  sources: z
    .string()
    .max(sum(emoteSources, (source) => source.length, emoteSources.length))
    .optional()
    .transform((sources) => {
      if (!sources) {
        return emoteSources;
      }
      return Object.freeze(
        [...new Set(sources.split("+"))].filter(
          (source): source is EmoteSource =>
            emoteSources.includes(source as EmoteSource),
        ),
      );
    }),
});

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { sources } = querySchema.parse(query);
  const noValidSource = !sources.length;
  if (noValidSource) {
    return setResponseStatus(event, 204);
  }
  const collections = await Promise.all(
    sources.map((source) => getCachedGlobalCollection(source)),
  );
  const groupedBySource = flatGroupBy(
    collections,
    (collection) => collection.source,
  );
  return groupedBySource as IGlobalEmoteCollectionRecord;
});

function fetchTwitchGlobalEmotes() {
  return twitchApi.fetch<ITwitchGlobalEmoteResponse>("/chat/emotes/global");
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
    const response = await fetchTwitchGlobalEmotes();
    return makeTwitchGlobalCollection(response);
  },
};

function getGlobalCollection(source: EmoteSource) {
  return globalEmotesGetters[source]();
}
