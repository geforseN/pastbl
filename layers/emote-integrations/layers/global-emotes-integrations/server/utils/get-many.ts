export async function getGlobalEmotesIntegrations(sources: EmoteSource[]) {
  const values = await Promise.all(
    sources
      .toSorted()
      .map((source) => globalEmotesIntegrations.of(source).get()),
  );
  return flatGroupBySource(values);
}
