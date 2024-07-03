import type { OpenDBCallbacks } from "idb";
import type { CollectionsSchema } from "~/client-only/IndexedDB";
import { GlobalIntegrationsStore } from "~~/layers/global-emote-integrations/GlobalIntegrationsStore";
import { UsersCollectionsStore } from "~/client-only/IndexedDB/emote-collections/UsersCollections";
import { openIdb } from "~/client-only/IndexedDB/open";

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
  constructor(
    public readonly global: GlobalIntegrationsStore,
    public readonly users: UsersCollectionsStore,
  ) {}
}

export const collectionsIdb = openIdb<CollectionsSchema>(
  "emote-collections",
  6,
  openCollectionsIdbUpgrade,
).then(
  (idb) =>
    new CollectionsStore(
      new GlobalIntegrationsStore(idb),
      new UsersCollectionsStore(idb),
    ),
);
