export const EMOTE_SOURCES_MAX_QUERY_STRING_LENGTH = allEmoteSources.reduce(
  (length, source) => length + source.length,
  allEmoteSources.count,
);

export const EMOTE_SOURCES_MIN_QUERY_STRING_LENGTH = allEmoteSources.reduce(
  (min, source) => Math.min(min, source.length),
  0,
);

export const UNDEFINED_RECEIVED_ERROR_MESSAGE = `Must provided sources query string, allowed values are: ${allEmoteSources.join(", ")}, must be separated by +`;
export const SOURCES_LENGTH_IS_ZERO_ERROR_MESSAGE = `At least one source is required, allowed values are: ${allEmoteSources.join(", ")}, must be separated by +`;
