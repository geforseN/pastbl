import { z } from "zod";
import { allEmoteSources } from "$/emote-integrations/emote-sources/utils/external";

const EMOTE_SOURCES_MAX_QUERY_STRING_LENGTH = allEmoteSources.reduce(
  (length, source) => length + source.length,
  allEmoteSources.count,
);

const EMOTE_SOURCES_MIN_QUERY_STRING_LENGTH = allEmoteSources.reduce(
  (min, source) => Math.min(min, source.length),
  0,
);

const emoteSourcesQueryStringSchema = z
  .string()
  .min(EMOTE_SOURCES_MIN_QUERY_STRING_LENGTH)
  .max(EMOTE_SOURCES_MAX_QUERY_STRING_LENGTH)
  .transform((sources) => {
    const validSources = sources
      .split("+")
      .filter((source) => allEmoteSources.has(source));
    return uniqueValues(validSources);
  });

const emoteSourcesQuerySchema = z.object({
  sources: emoteSourcesQueryStringSchema,
});

export function getEmoteSourcesFromQuery(event: H3Event) {
  return emoteSourcesQuerySchema.parse(getQuery(event)).sources;
}
