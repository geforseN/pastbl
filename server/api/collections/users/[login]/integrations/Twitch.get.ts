export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  const user = await getTwitchUser(login);
  const integration = await getUserEmoteIntegration("Twitch", user);
  return {
    Twitch: integration,
  };
});
