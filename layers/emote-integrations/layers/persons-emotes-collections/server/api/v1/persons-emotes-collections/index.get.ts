export default defineEventHandler(async (event) => {
  const logins = getTwitchLoginsFromQuery(event);
  return await getPersonsEmoteCollections(logins);
});
