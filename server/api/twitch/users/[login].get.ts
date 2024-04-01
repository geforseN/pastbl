export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  return await getTwitchUser(login);
});
