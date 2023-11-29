import { openDB, type IDBPDatabase } from "idb";
import { GlobalEmoteCollections } from "./GlobalEmoteCollections";
import { UsersEmoteCollections } from "./UsersEmoteCollections";
import { type EmoteCollectionsSchema } from "~/client-only/IndexedDB";

class EmoteCollections {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public readonly global: GlobalEmoteCollections,
    public readonly users: UsersEmoteCollections,
  ) {}
}

const openEmoteCollectionsIdb = openDB<EmoteCollectionsSchema>(
  "emote-collections",
  3,
  {
    upgrade(database) {
      database.createObjectStore("users", {
        keyPath: "twitch.username",
      });
      database.createObjectStore("global", {
        keyPath: "source",
      });
    },
  },
);

export const emoteCollectionsIdb = openEmoteCollectionsIdb.then(
  (idb) =>
    new EmoteCollections(
      new GlobalEmoteCollections(idb),
      new UsersEmoteCollections(idb),
    ),
);
