import { flatGroupBy } from "~/utils/object";

export async function getUserEmoteCollection(login: Lowercase<string>) {
  const account = await getTwitchUser(login);
  const integrations = await getUserAllEmoteIntegrations(account);
  return {
    user: {
      twitch: account,
      twitchAccount: account,
    },
    twitchAccount: account,
    integrations,
    updatedAt: Date.now(),
  };
}

export async function getUsersEmoteCollections(logins: Lowercase<string>[]) {
  const collections = await Promise.all(
    logins.map((login) => getUserEmoteCollection(login)),
  );
  const grouped = flatGroupBy(
    collections,
    (collection) => collection.user.twitch.login,
  );
  return grouped;
}
