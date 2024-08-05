export default defineEventHandler(async () => {
  const integrations = await getAllGlobalEmotesIntegrations();
  return {
    integrations,
  };
});
