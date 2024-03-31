import { z } from "zod";
import { emoteSources, isValidEmoteSource } from "~/integrations";
import { uniqueValues } from "~/utils/array";

const sources_ = [...emoteSources];

const EMOTE_SOURCES_MAX_QUERY_STRING_LENGTH = sources_.reduce(
  (acc, source) => acc + source.length,
  sources_.length,
);

const EMOTE_SOURCES_MIN_QUERY_STRING_LENGTH = sources_.reduce(
  (min, source) => Math.min(min, source.length),
  0,
);
export const emoteSourcesQueryStringSchema = z
  .string()
  .min(EMOTE_SOURCES_MIN_QUERY_STRING_LENGTH)
  .max(EMOTE_SOURCES_MAX_QUERY_STRING_LENGTH)
  .transform((sources) => {
    const validSources = sources.split("+").filter(isValidEmoteSource);
    return uniqueValues(validSources);
  });

const emoteSourcesQuerySchema = z.object({
  sources: emoteSourcesQueryStringSchema,
});

export function getEmoteSourcesFromQuery(event: H3E) {
  return emoteSourcesQuerySchema.parse(getQuery(event)).sources;
}
