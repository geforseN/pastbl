import type { IPersonEmoteCollection } from "~/integrations/abstract";
import { flatGroupBy } from "~/utils/object";

// FIXME: move all from utils
export async function getPersonEmoteCollection(login: TwitchUserLogin) {
  const twitch = await getTwitchUser(login);
  const integrations = await getPersonAllEmoteIntegrations(twitch);
  return <IPersonEmoteCollection>{
    person: {
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
    (collection) => collection.person.twitch.login,
  );
  return grouped;
}
