import { type IDBPDatabase, openDB } from "idb";
import {
  type EmotesSchema,
  type IndexedDBUserCollection,
} from "~/client-only/IndexedDB";
import {
  type EmoteCollectionsRecord,
  type IUserEmoteCollection,
  populateUserEmoteCollection,
} from "~/integrations";

class Emotes {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly db: IDBPDatabase<EmotesSchema>) {}

  putEmotesOfUserCollection(collection: IUserEmoteCollection) {
    const emotes = Object.values(collection.collections).flatMap((collection) =>
      collection.sets.flatMap((set) => toRaw(set.emotes)),
    );
    return Promise.all(emotes.map((emote) => this.db.put("emotes", emote)));
  }

  get emotesTransaction() {
    return this.db.transaction("emotes");
  }

  async populateUserCollectionWithEmotes(
    userIdbCollection: IndexedDBUserCollection,
  ) {
    const emoteIdbStore = this.db.transaction("emotes").store;
    const emoteCollections = await Promise.all(
      Object.values(userIdbCollection.collections).map((idbCollection) =>
        populateUserEmoteCollection(idbCollection, (emoteId) =>
          emoteIdbStore.get([emoteId, idbCollection.source]),
        ),
      ),
    );
    const emoteCollectionsRecord = groupBy(
      emoteCollections,
      (collection) => collection.source,
    ) as EmoteCollectionsRecord;
    return { ...userIdbCollection, collections: emoteCollectionsRecord };
  }
}

const openEmotesIdb = openDB<EmotesSchema>("emotes", 1, {
  upgrade(database) {
    if (!database.objectStoreNames.contains("emotes")) {
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
    }
  },
});

export const emotesIdb = openEmotesIdb.then((idb) => new Emotes(idb));
