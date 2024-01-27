import type { OpenDBCallbacks } from "idb";
import type { CollectionsSchema } from "~/client-only/IndexedDB";
import { GlobalCollectionStore } from "~/client-only/IndexedDB/emote-collections/GlobalCollections";
import { UsersCollectionsStore } from "~/client-only/IndexedDB/emote-collections/UsersCollections";

const openCollectionsIdbUpgrade: OpenDBCallbacks<CollectionsSchema>["upgrade"] =
  (database) => {
    if (database.objectStoreNames.contains("users")) {
      database.deleteObjectStore("users");
    }
    database.createObjectStore("users", {
      keyPath: "user.twitch.login",
    });
    if (!database.objectStoreNames.contains("global")) {
      database.createObjectStore("global", {
        keyPath: "source",
      });
    }
    // @ts-expect-error key-value store can be in database
    if (database.objectStoreNames.contains("key-value")) {
      // @ts-expect-error key-value store can be in database
      database.deleteObjectStore("key-value");
    }
  };

class CollectionsStore {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public readonly global: GlobalCollectionStore,
    public readonly users: UsersCollectionsStore,
  ) {}
}

export const collectionsIdb = import("~/client-only/IndexedDB")
  .then(({ openIdb }) =>
    openIdb<CollectionsSchema>(
      "emote-collections",
      6,
      openCollectionsIdbUpgrade,
    ),
  )
  .then(
    (idb) =>
      new CollectionsStore(
        new GlobalCollectionStore(idb),
        new UsersCollectionsStore(idb),
      ),
  );
