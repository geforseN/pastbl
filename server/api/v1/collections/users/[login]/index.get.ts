export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  return await getPersonEmoteCollection(login);
});
