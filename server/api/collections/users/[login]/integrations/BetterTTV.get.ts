export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  const user = await getTwitchUser(login);
  const integration = await getUserEmoteIntegration("BetterTTV", user);
  return {
    BetterTTV: integration,
  };
});
