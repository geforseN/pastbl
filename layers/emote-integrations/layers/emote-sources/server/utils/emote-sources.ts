import { z } from "zod";
import { uniqueValues } from "~/utils/array";

const EMOTE_SOURCES_MAX_QUERY_STRING_LENGTH = allEmoteSources.reduce(
  (length, source) => length + source.length,
  allEmoteSources.count,
);

const EMOTE_SOURCES_MIN_QUERY_STRING_LENGTH = allEmoteSources.reduce(
  (min, source) => Math.min(min, source.length),
  0,
);

const UNDEFINED_RECEIVED_ERROR_MESSAGE = `Must provided sources query string, allowed values are: ${allEmoteSources.join(", ")}, must be separated by +`;
const SOURCES_LENGTH_IS_ZERO_ERROR_MESSAGE = `At least one source is required, allowed values are: ${allEmoteSources.join(", ")}, must be separated by +`;

const emoteSourcesQueryStringSchema = z
  .string()
  .min(EMOTE_SOURCES_MIN_QUERY_STRING_LENGTH)
  .max(EMOTE_SOURCES_MAX_QUERY_STRING_LENGTH)
  .transform((sources) => {
    const validSources = sources
      .split("+")
      .filter((source) => allEmoteSources.has(source));
    return uniqueValues(validSources);
  })
  .refine((sources) => sources.length > 0, SOURCES_LENGTH_IS_ZERO_ERROR_MESSAGE);

const emoteSourcesQuerySchema = z.object({
  sources: emoteSourcesQueryStringSchema,
});

export function getEmoteSourcesFromQuery(event: H3Event) {
  const parse = emoteSourcesQuerySchema.safeParse(getQuery(event));
  if (parse.error) {
    let message: string;
    if (parse.error.issues.some((issue) => issue.message === SOURCES_LENGTH_IS_ZERO_ERROR_MESSAGE)) {
      message = SOURCES_LENGTH_IS_ZERO_ERROR_MESSAGE;
    }
    else if (parse.error.issues.some((issue) => issue.code === "invalid_type" && issue.received === "undefined")) {
      message = UNDEFINED_RECEIVED_ERROR_MESSAGE;
    }
    else {
      message = parse.error.toString();
    }
    throw createError({
      statusCode: 400,
      data: { message },
    });
  }

  return parse.data.sources;
}
