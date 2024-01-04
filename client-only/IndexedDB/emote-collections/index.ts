import type { OpenDBCallbacks } from "idb";
import type { CollectionsSchema } from "~/client-only/IndexedDB";
import { GlobalCollectionStore } from "~/client-only/IndexedDB/emote-collections/GlobalCollections";
import { UsersCollectionsStore } from "~/client-only/IndexedDB/emote-collections/UsersCollections";
import { CollectionsKeyValueStore } from "~/client-only/IndexedDB/emote-collections/CollectionsKeyValue";

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

class CollectionsStore {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public readonly global: GlobalCollectionStore,
    public readonly users: UsersCollectionsStore,
    public readonly kv: CollectionsKeyValueStore,
  ) {}
}

export const collectionsIdb = import("~/client-only/IndexedDB")
  .then(({ openIdb }) =>
    openIdb<CollectionsSchema>(
      "emote-collections",
      4,
      openCollectionsIdbUpgrade,
    ),
  )
  .then(
    (idb) =>
      new CollectionsStore(
        new GlobalCollectionStore(idb),
        new UsersCollectionsStore(idb),
        new CollectionsKeyValueStore(idb),
      ),
  );
