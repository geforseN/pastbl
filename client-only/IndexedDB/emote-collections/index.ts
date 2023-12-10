import { openDB } from "idb";
import { GlobalEmoteCollections } from "./GlobalEmoteCollections";
import { UsersEmoteCollections } from "./UsersEmoteCollections";
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
  ) {}
}

const openEmoteCollectionsIdb = async () =>
  (typeof window !== "undefined" || {}) &&
  openDB<EmoteCollectionsSchema>("emote-collections", 4, {
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
          .put(null, "active-user-collection-username");
      }
    },
  });

export const emoteCollectionsIdb = openEmoteCollectionsIdb().then(
  (idb) =>
    new EmoteCollections(
      new GlobalEmoteCollections(idb),
      new UsersEmoteCollections(idb),
    ),
);

export async function addGlobalCollection(collection: IGlobalEmoteCollection) {
  const { idb } = await import("~/client-only/IndexedDB");
  const { global } = await idb.emoteCollections;
  return await global.addCollection(collection);
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
  const { idb } = await import("~/client-only/IndexedDB");
  const emoteCollections = await idb.emoteCollections;
  const newIdbCollection =
    await emoteCollections.global.refreshCollection(collection);
  return newIdbCollection;
}

export async function getAllGlobalCollections() {
  const emoteCollections = await import("~/client-only/IndexedDB").then(
    ({ idb }) => idb.emoteCollections,
  );
  return emoteCollections.global.getAllCollections();
}
