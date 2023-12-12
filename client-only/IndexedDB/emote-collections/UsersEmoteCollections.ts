import type { IDBPDatabase } from "idb";
import {
  type EmoteCollectionsSchema,
  type IndexedDBUserCollection,
} from "~/client-only/IndexedDB";
import type { IUserEmoteCollection } from "~/integrations";

export class UsersEmoteCollections {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly db: IDBPDatabase<EmoteCollectionsSchema>) {}

  getUserCollectionByUsername(
    username: IndexedDBUserCollection["twitch"]["username"],
  ) {
    return this.db.transaction("users").store.get(username);
  }

  getAllCollections() {
    return this.db.transaction("users").store.getAll();
  }

  getAllCollectionsUsernames() {
    return this.db.transaction("users").store.getAllKeys();
  }

  updateCollection(idbCollection: IndexedDBUserCollection) {
    const raIdbCollection: IndexedDBUserCollection = {
      ...idbCollection,
      collections: toRaw(idbCollection.collections),
      failedCollectionsReasons: toRaw(idbCollection.failedCollectionsReasons),
      twitch: toRaw(idbCollection.twitch),
    };
    return this.db
      .transaction("users", "readwrite")
      .objectStore("users")
      .put(raIdbCollection);
  }

  removeCollection(collection: IndexedDBUserCollection) {
    return this.db.delete("users", collection.twitch.username);
  }

  async putCollection(collection: IUserEmoteCollection) {
    const collectionCollections = Object.values(collection.collections).map(
      (collection) => ({
        ...collection,
        owner: toRaw(collection.owner),
        sets: collection.sets.map((set) => {
          const { emotes, ...setToInclude } = set;
          return {
            ...setToInclude,
            emoteIds: emotes.map((emote) => emote.id),
          };
        }),
      }),
    );
    const idbCollection = {
      ...collection,
      failedCollectionsReasons: toRaw(collection.failedCollectionsReasons),
      twitch: toRaw(collection.twitch),
      collections: groupBy(
        collectionCollections,
        (collection) => collection.source,
      ),
    };
    await this.db
      .transaction("users", "readwrite")
      .objectStore("users")
      .put(idbCollection);
    return idbCollection;
  }
}
