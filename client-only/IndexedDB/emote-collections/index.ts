import { openDB, type IDBPDatabase, type OpenDBCallbacks } from "idb";
import { GlobalCollectionStore } from "./GlobalEmoteCollections";
import { UsersCollectionsStore } from "./UsersEmoteCollections";
import { CollectionsKeyValueStore } from "./KeyValueEmoteCollections";
import type { CollectionsSchema } from "~/client-only/IndexedDB";

const openCollectionsIdbUpgrade: OpenDBCallbacks<CollectionsSchema>["upgrade"] =
  async (database, _, __, transaction) => {
    if (!database.objectStoreNames.contains("users")) {
      database.createObjectStore("users", {
        keyPath: "twitch.username",
      });
    }
    if (!database.objectStoreNames.contains("global")) {
      database.createObjectStore("global", {
        keyPath: "source",
      });
    }
    if (!database.objectStoreNames.contains("key-value")) {
      database.createObjectStore("key-value");
    }
    const activeUserCollectionUsername = await transaction
      .objectStore("key-value")
      .get("active-user-collection-username");
    if (activeUserCollectionUsername === undefined) {
      await transaction
        .objectStore("key-value")
        .put("", "active-user-collection-username");
    }
  };

function openCollectionsIdb(
  upgrade: OpenDBCallbacks<CollectionsSchema>["upgrade"],
) {
  if (typeof window === "undefined") {
    return Promise.resolve({} as IDBPDatabase<CollectionsSchema>);
  }
  return openDB<CollectionsSchema>("emote-collections", 4, { upgrade });
}

class CollectionsStore {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public readonly global: GlobalCollectionStore,
    public readonly users: UsersCollectionsStore,
    public readonly kv: CollectionsKeyValueStore,
  ) {}
}

export const collectionsIdb = openCollectionsIdb(
  openCollectionsIdbUpgrade,
).then(
  (idb) =>
    new CollectionsStore(
      new GlobalCollectionStore(idb),
      new UsersCollectionsStore(idb),
      new CollectionsKeyValueStore(idb),
    ),
);
