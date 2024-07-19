export default defineEventHandler(async (event) => {
  const login = getTwitchLoginFromQuery(event);
  return await getTwitchChannels(login);
});
