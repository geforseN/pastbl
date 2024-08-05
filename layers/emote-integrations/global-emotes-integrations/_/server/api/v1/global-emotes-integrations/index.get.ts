export default defineEventHandler(async (event) => {
  const sources = getEmoteSourcesFromQuery(event);
  const integrations = await getGlobalEmotesIntegrations(sources);
  return {
    integrations,
  };
});
