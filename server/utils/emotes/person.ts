import type { IPersonEmoteCollection } from "~/integrations/abstract";
import { flatGroupBy } from "~/utils/object";

export async function getPersonEmoteCollection(login: TwitchUserLogin) {
  const twitch = await getTwitchUser(login);
  const integrations = await getPersonAllEmoteIntegrations(twitch);
  return <IPersonEmoteCollection>{
    user: {
      twitch,
    },
    integrations,
    formedAt: Date.now(),
  };
}

export async function getPersonsEmoteCollections(logins: TwitchUserLogin[]) {
  const collections = await Promise.all(
    logins.map((login) => getPersonEmoteCollection(login)),
  );
  const grouped = flatGroupBy(
    collections,
    (collection) => collection.user.twitch.login,
  );
  return grouped;
}
