import type { IDBPDatabase } from "idb";
import {
  type EmoteCollectionsSchema,
  type IndexedDBUserEmoteCollection,
} from "~/client-only/IndexedDB";
import type { IUserEmoteCollection } from "~/integrations";

export class UsersCollections {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly db: IDBPDatabase<EmoteCollectionsSchema>) {}

  get(username: IndexedDBUserEmoteCollection["twitch"]["username"]) {
    return this.db.transaction("users").store.get(username);
  }

  getAll() {
    return this.db.transaction("users").store.getAll();
  }

  getAllUsernames() {
    return this.db.transaction("users").store.getAllKeys();
  }

  // TODO: param should be idbCollection already (add class for data preparation)
  update(collection: IndexedDBUserEmoteCollection) {
    const idbCollection = makeEntriesRaw(collection);
    return this.db
      .transaction("users", "readwrite")
      .objectStore("users")
      .put(idbCollection);
  }

  remove(collection: IndexedDBUserEmoteCollection) {
    return this.db.delete("users", collection.twitch.username);
  }

  // TODO: param should be idbCollection already (add class for data preparation)
  async put(collection: IUserEmoteCollection) {
    const integrations = prepareIntegrationsForPut(collection.integrations);
    const idbCollection = makeEntriesRaw({
      ...collection,
      integrations,
    });
    await this.db
      .transaction("users", "readwrite")
      .objectStore("users")
      .put(idbCollection);
    return idbCollection;
  }
}

function makeEntriesRaw<T>(object: T): T {
  return Object.entries(object).reduce((acc, [key, value]) => {
    acc[key] = toRaw(value);
    return acc;
  }, {} as T);
}

function prepareIntegrationsForPut<T extends IUserEmoteCollection>(
  integrations: T["integrations"],
) {
  const idbIntegrations = Object.values(integrations).map((integration) => ({
    ...integration,
    owner: toRaw(integration.owner),
    sets: integration.sets.map((set) => {
      const { emotes, ...setToInclude } = set;
      return {
        ...setToInclude,
        emoteIds: emotes.map((emote) => emote.id),
      };
    }),
  }));
  return groupBy(idbIntegrations, (integration) => integration.source);
}
