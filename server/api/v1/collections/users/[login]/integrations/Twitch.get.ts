export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  const user = await getTwitchUser(login);
  const integration = await personIntegrationsGetters.Twitch(user);
  return integration;
});
