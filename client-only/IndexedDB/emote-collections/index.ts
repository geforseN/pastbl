import { openDB, type IDBPDatabase } from "idb";
import { GlobalEmoteCollections } from "./GlobalEmoteCollections";
import { UsersEmoteCollections } from "./UsersEmoteCollections";
import { type EmoteCollectionsSchema } from "~/client-only/IndexedDB";

class EmoteCollections {
  db;
  global;
  users;

  constructor(db: IDBPDatabase<EmoteCollectionsSchema>) {
    this.db = db;
    this.global = new GlobalEmoteCollections(db);
    this.users = new UsersEmoteCollections(db);
  }
}

export const emoteCollectionsIdb = new EmoteCollections(
  await openDB<EmoteCollectionsSchema>("emote-collections", 3, {
    upgrade(database) {
      database.createObjectStore("users", {
        keyPath: "twitch.username",
      });
      database.createObjectStore("global", {
        keyPath: "source",
      });
    },
  }),
);
