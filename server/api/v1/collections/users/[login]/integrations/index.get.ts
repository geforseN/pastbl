export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  const sources = getEmoteSourcesFromQuery(event);
  const account = await getTwitchUser(login);
  return await getPersonEmoteIntegrations(sources, account);
});
