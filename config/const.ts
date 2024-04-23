export const PASTA_TAG_MIN_LENGTH = 1;
export const PASTA_TAG_MAX_LENGTH = 128;
export const pastaTagLength = {
  min: PASTA_TAG_MIN_LENGTH,
  max: PASTA_TAG_MAX_LENGTH,
} as const;

export const MIN_TAGS_IN_PASTA = 0;
export const MAX_TAGS_IN_PASTA = 10;
export const pastaTagsCount = {
  min: MIN_TAGS_IN_PASTA,
  max: MAX_TAGS_IN_PASTA,
} as const;

export const PASTA_TEXT_MIN_LENGTH = 1;
export const PASTA_TEXT_MAX_LENGTH = 1984;
export const pastaTextLength = {
  min: PASTA_TEXT_MIN_LENGTH,
  max: PASTA_TEXT_MAX_LENGTH,
  warning: 500,
} as const;
