export default defineEventHandler(async (event) => {
  const sources = getEmoteSourcesFromQuery(event);
  const integrations = await getGlobalEmoteIntegrations(sources);
  return {
    integrations,
  };
});
