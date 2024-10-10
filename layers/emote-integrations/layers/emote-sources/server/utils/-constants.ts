export const EMOTE_SOURCES_MAX_QUERY_STRING_LENGTH = allEmoteSources.reduce(
  (length, source) => length + source.length,
  allEmoteSources.count,
);

export const EMOTE_SOURCES_MIN_QUERY_STRING_LENGTH = allEmoteSources.reduce(
  (min, source) => Math.min(min, source.length),
  0,
);

const HELPFUL_TEXT = `Allowed values are: ${allEmoteSources.join(", ")}. Must be separated by \`+\``;

export const UNDEFINED_RECEIVED_ERROR_MESSAGE = `Must provided \`sources\` query string. ${HELPFUL_TEXT}`;
export const SOURCES_LENGTH_IS_ZERO_ERROR_MESSAGE = `At least one source in \`sources\` query string is required. ${HELPFUL_TEXT}`;
