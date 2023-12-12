import { openDB, type IDBPDatabase } from "idb";
import { GlobalEmoteCollections } from "./GlobalEmoteCollections";
import { UsersEmoteCollections } from "./UsersEmoteCollections";
import { KeyValueEmoteCollections } from "./KeyValueEmoteCollections";
import { type EmoteCollectionsSchema } from "~/client-only/IndexedDB";
import {
  getGlobalCollection,
  type AvailableEmoteSource,
  type IGlobalEmoteCollection,
} from "~/integrations";

class EmoteCollections {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public readonly global: GlobalEmoteCollections,
    public readonly users: UsersEmoteCollections,
    public readonly kv: KeyValueEmoteCollections,
  ) {}
}

const openEmoteCollectionsIdb = () =>
  typeof window === "undefined"
    ? Promise.resolve({} as IDBPDatabase<EmoteCollectionsSchema>)
    : openDB<EmoteCollectionsSchema>("emote-collections", 4, {
        async upgrade(database, _, __, tx) {
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
          const activeUserCollectionUsername = await tx
            .objectStore("key-value")
            .get("active-user-collection-username");
          if (activeUserCollectionUsername === undefined) {
            await tx
              .objectStore("key-value")
              .put("", "active-user-collection-username");
          }
        },
      });

export const emoteCollectionsIdb = openEmoteCollectionsIdb().then(
  (idb) =>
    new EmoteCollections(
      new GlobalEmoteCollections(idb),
      new UsersEmoteCollections(idb),
      new KeyValueEmoteCollections(idb),
    ),
);

export async function addGlobalCollection(collection: IGlobalEmoteCollection) {
  return (await emoteCollectionsIdb).global.addCollection(collection);
}

export async function loadMissingGlobalCollections(
  missingSources: AvailableEmoteSource[],
) {
  const [collections] = await tupleSettledPromises<IGlobalEmoteCollection>(
    missingSources.map((source) => getGlobalCollection(source)),
  );
  const { addGlobalCollection } = await import(
    "~/client-only/IndexedDB/emote-collections"
  );
  await Promise.all(
    collections.map((collection) => addGlobalCollection(collection)),
  );
  return collections;
}

export async function refreshGlobalCollection(
  collection: IGlobalEmoteCollection,
) {
  return (await emoteCollectionsIdb).global.refreshCollection(collection);
}

export async function getAllGlobalCollections() {
  return (await emoteCollectionsIdb).global.getAllCollections();
}
