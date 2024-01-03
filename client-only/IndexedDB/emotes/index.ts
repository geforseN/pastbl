import { type IDBPDatabase, openDB, type OpenDBCallbacks } from "idb";
import { type EmotesSchema } from "~/client-only/IndexedDB";
import { type IEmote } from "~/integrations";

const openEmotesIdbUpgrade: OpenDBCallbacks<EmotesSchema>["upgrade"] = (
  database,
) => {
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
};

function openEmotesIdb(upgrade: OpenDBCallbacks<EmotesSchema>["upgrade"]) {
  if (typeof window === "undefined") {
    return Promise.resolve({} as IDBPDatabase<EmotesSchema>);
  }
  return openDB<EmotesSchema>("emotes", 1, { upgrade });
}

class EmotesStore {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly db: IDBPDatabase<EmotesSchema>) {}

  put(emotes: IEmote[]) {
    return Promise.all(emotes.map((emote) => this.db.put("emotes", emote)));
  }

  get emotesTransaction() {
    return this.db.transaction("emotes");
  }
}

export const emotesIdb = openEmotesIdb(openEmotesIdbUpgrade).then(
  (idb) => new EmotesStore(idb),
);
