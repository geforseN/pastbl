import { type IDBPDatabase, openDB } from "idb";
import {
  type EmotesSchema,
  type IndexedDBUserCollection,
} from "~/client-only/IndexedDB";
import type {
  EmoteCollectionsRecord,
  IUserEmoteCollection,
} from "~/integrations";
import { UserEmoteCollection } from "~/integrations/UserEmoteCollection";

class Emotes {
  db;

  constructor(db: IDBPDatabase<EmotesSchema>) {
    this.db = db;
  }

  putEmotesOfUserCollection(collection: IUserEmoteCollection) {
    const emotes = Object.values(collection.collections).flatMap((collection) =>
      collection.sets.flatMap((set) => toRaw(set.emotes)),
    );
    return Promise.all(emotes.map((emote) => this.db.put("emotes", emote)));
  }

  async populateUserCollectionWithEmotes(collection: IndexedDBUserCollection) {
    const emoteStore = this.db.transaction("emotes").store;
    const collectionsArray = await Promise.all(
      Object.values(collection.collections).map((idbCollection) =>
        UserEmoteCollection.fromIDBCollection(idbCollection, (emoteId) =>
          emoteStore.get([emoteId, idbCollection.source]),
        ),
      ),
    );
    const collections = groupBy(
      collectionsArray,
      (collection) => collection.source,
    ) as EmoteCollectionsRecord;
    return { ...collection, collections };
  }
}

const openEmotesIdb = openDB<EmotesSchema>("emotes", 1, {
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
});

export const emotesIdb = openEmotesIdb.then((idb) => new Emotes(idb));
