export async function getPersonsEmoteCollections(logins: TwitchUserLogin[]) {
  const collections = await Promise.all(
    logins.map((login) => getPersonEmoteCollection(login)),
  );
  const grouped = flatGroupBy(
    collections,
    (collection) => collection.person.twitch.login,
  );
  return grouped;
}
