export default defineEventHandler(async (event) => {
  const login = getTwitchLoginFromQuery(event);
  return await getChannels(login);
});
