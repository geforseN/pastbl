export async function getGlobalEmotesIntegration(source: EmoteSource) {
  return await globalEmotesIntegrations.of(source).get();
}
