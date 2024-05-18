const getIntegration = personIntegrationsGetters.SevenTV;

export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  const user = await getTwitchUser(login);
  const integration = await getIntegration(user);
  return integration;
});
