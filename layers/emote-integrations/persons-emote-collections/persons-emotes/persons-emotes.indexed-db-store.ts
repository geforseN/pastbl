import type { IDBPDatabase } from "idb";
import type { IndexedDBEmoteIntegrationsSchema } from "../emote-integrations/emote-integrations.indexed-db";
import type { EmoteId } from "~/brands";
import type { IEmote } from "../emote-integrations/base";

export class PersonsEmotesIndexedDBStore {
  constructor(
    private readonly database: IDBPDatabase<IndexedDBEmoteIntegrationsSchema>,
  ) {}

  get transaction() {
    return this.database.transaction("persons-emotes");
  }

  get(source: EmoteSource, emoteId: EmoteId) {
    return this.database.get("persons-emotes", [source, emoteId]);
  }

  put(emote: IEmote) {
    return this.database.put("persons-emotes", emote);
  }

  delete(source: EmoteSource, emoteId: EmoteId) {
    return this.database.delete("persons-emotes", [source, emoteId]);
  }
}
