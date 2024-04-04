export default defineEventHandler(async (event) => {
  const sources = getEmoteSourcesFromQuery(event);
  return await getGlobalEmoteCollections(sources);
});
