export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  const user = await getTwitchUser(login);
  const integration = await getUserEmoteIntegration("FrankerFaceZ", user);
  return {
    FrankerFaceZ: integration,
  };
});
