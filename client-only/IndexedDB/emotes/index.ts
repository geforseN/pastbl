import type { IDBPDatabase, OpenDBCallbacks } from "idb";
import type { EmotesSchema } from "~/client-only/IndexedDB";
import type { EmoteSource, IEmote } from "~/integrations";

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
class EmotesStore {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly db: IDBPDatabase<EmotesSchema>) {}

  // options: {onNotSingle: (emotes: IEmote[]) => }

  put(emotes: IEmote[]) {
    return Promise.all(emotes.map((emote) => this.db.put("emotes", emote)));
  }

  getWithSource(source: EmoteSource) {
    return (emoteId: string) => {
      return this.db.get("emotes", [emoteId, source]);
    };
  }

  deleteWithSource(source: EmoteSource) {
    return (emoteId: string) => {
      return this.db.delete("emotes", [emoteId, source]);
    };
  }

  deleteManyWithSource(source: EmoteSource) {
    return (emoteIds: string[]) => {
      return Promise.all(
        emoteIds.map((emoteId) => this.db.delete("emotes", [emoteId, source])),
      );
    };
  }

  get emotesTransaction() {
    return this.db.transaction("emotes");
  }
}

export const emotesIdb = import("~/client-only/IndexedDB")
  .then(({ openIdb }) =>
    openIdb<EmotesSchema>("emotes", 1, openEmotesIdbUpgrade),
  )
  .then((idb) => new EmotesStore(idb));
