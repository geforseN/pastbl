export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  const sources = getEmoteSourcesFromQuery(event);
  const twitchUser = await getTwitchUser(login);
  return await getPersonEmoteIntegrations(sources, twitchUser);
});
