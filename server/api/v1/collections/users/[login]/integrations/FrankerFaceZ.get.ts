export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  const user = await getTwitchUser(login);
  const integration = await personIntegrationsGetters.FrankerFaceZ(user);
  return integration;
});
