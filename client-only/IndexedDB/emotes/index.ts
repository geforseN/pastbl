import { type IDBPDatabase, openDB } from "idb";
import {
  prepareUserEmotesForIDB,
  type EmotesSchema,
} from "~/client-only/IndexedDB";
import type { IUserEmoteCollection } from "~/integrations";

class Emotes {
  db;

  constructor(db: IDBPDatabase<EmotesSchema>) {
    this.db = db;
  }

  putEmotesOfUserCollection(collection: IUserEmoteCollection) {
    const emotes = prepareUserEmotesForIDB(collection);
    return Promise.all(emotes.map((emote) => this.db.put("emotes", emote)));
  }
}

export const emotesIdb = new Emotes(
  await openDB<EmotesSchema>("emotes", 1, {
    upgrade(database) {
      const emotesStore = database.createObjectStore("emotes", {
        keyPath: ["id", "source"],
      });
      emotesStore.createIndex("bySource", "source", { unique: false });
      emotesStore.createIndex("byId", "id", { unique: false });
      emotesStore.createIndex("byToken", "token", { unique: false });
      // NOTE: tags only exist in 7TV emotes (as i know)
      emotesStore.createIndex("byTags", "tags", {
        unique: false,
        multiEntry: true,
      });
    },
  }),
);
