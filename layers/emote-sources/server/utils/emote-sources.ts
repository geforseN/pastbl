import { z } from "zod";
import {
  emoteSources,
  isEmoteSource,
} from "~~/layers/emote-sources/utils/emote-sources";
import { uniqueValues } from "~/utils/array";

const EMOTE_SOURCES_MAX_QUERY_STRING_LENGTH = emoteSources.reduce(
  (length, source) => length + source.length,
  emoteSources.length,
);

const EMOTE_SOURCES_MIN_QUERY_STRING_LENGTH = emoteSources.reduce(
  (min, source) => Math.min(min, source.length),
  0,
);

export const emoteSourcesQueryStringSchema = z
  .string()
  .min(EMOTE_SOURCES_MIN_QUERY_STRING_LENGTH)
  .max(EMOTE_SOURCES_MAX_QUERY_STRING_LENGTH)
  .transform((sources) => {
    const validSources = sources.split("+").filter(isEmoteSource);
    return uniqueValues(validSources);
  });

const emoteSourcesQuerySchema = z.object({
  sources: emoteSourcesQueryStringSchema,
});

export function getEmoteSourcesFromQuery(event: H3Event) {
  return emoteSourcesQuerySchema.parse(getQuery(event)).sources;
}
