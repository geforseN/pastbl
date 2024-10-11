import { z } from "zod";
import {
  EMOTE_SOURCES_MAX_QUERY_STRING_LENGTH,
  EMOTE_SOURCES_MIN_QUERY_STRING_LENGTH,
  SOURCES_LENGTH_IS_ZERO_ERROR_MESSAGE,
} from "./-constants";
import { uniqueValues } from "~/utils/array";

export const emoteSourcesQueryStringSchema = z
  .string()
  .min(EMOTE_SOURCES_MIN_QUERY_STRING_LENGTH)
  .max(EMOTE_SOURCES_MAX_QUERY_STRING_LENGTH)
  .transform((sources) => {
    const validSources = sources
      .split("+")
      .filter((source) => allEmoteSources.has(source));
    return uniqueValues(validSources);
  })
  .refine(
    (sources) => sources.length > 0,
    SOURCES_LENGTH_IS_ZERO_ERROR_MESSAGE,
  );

export const emoteSourcesQuerySchema = z.object({
  sources: emoteSourcesQueryStringSchema,
});
