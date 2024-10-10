const lowercaseEmoteSources = new Map(
  allEmoteSources.map((source) => [toLowerCase(source), source] as const),
);

export default defineEventHandler(async (event) => {
  const maybeSource = getRouterParam(event, "maybe-source");
  if (maybeSource === undefined) {
    return await $fetch(`/api/v1/global-emotes-integrations`);
  }
  const preparedMaybeSource = toLowerCase(maybeSource.trim());
  const source = lowercaseEmoteSources.get(preparedMaybeSource);
  if (!source) {
    const message = INVALID_EMOTE_SOURCE_PARAM.replace("<SOURCE>", preparedMaybeSource);
    throw createError({
      statusCode: 404,
      statusMessage: message,
      message,
      data: { message },
    });
  }
  return await $fetch(`/api/v1/global-emotes-integrations/${source}`);
});
