import type { IUserEmoteCollection } from "~/integrations";
import { flatGroupBy } from "~/utils/object";

export async function getUserEmoteCollection(login: TwitchUserLogin) {
  const account = await getTwitchUser(login);
  const integrations = await getUserAllEmoteIntegrations(account);
  return <IUserEmoteCollection>{
    user: {
      twitch: account,
    },
    integrations,
    formedAt: Date.now(),
  };
}

export async function getUsersEmoteCollections(logins: TwitchUserLogin[]) {
  const collections = await Promise.all(
    logins.map((login) => getUserEmoteCollection(login)),
  );
  const grouped = flatGroupBy(
    collections,
    (collection) => collection.user.twitch.login,
  );
  return grouped;
}
