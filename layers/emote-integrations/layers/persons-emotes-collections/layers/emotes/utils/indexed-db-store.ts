import type { IEmote, EmoteId } from "../../../../../shared/abstract/types";
import { assert } from "../../../../../../../app/utils/assert";
import type { EmoteSource } from "../../../../emote-sources/utils/external";
import type { WithEmoteIntegrationsIndexedDB } from "../../../../indexed-db/utils/with";

export class PersonsEmotesIndexedDBStore {
  constructor(private readonly withDatabase: WithEmoteIntegrationsIndexedDB) {}

  get transaction() {
    return this.withDatabase((database) =>
      database.transaction("persons-emotes"),
    );
  }

  get(emoteEntry: [source: EmoteSource, emoteId: EmoteId]) {
    return this.withDatabase(async (database) => {
      const emote = await database.get("persons-emotes", emoteEntry);
      assert.ok(emote);
      return emote;
    });
  }

  put(emote: IEmote) {
    return this.withDatabase((database) =>
      database.put("persons-emotes", emote),
    );
  }

  delete(emoteEntry: [source: EmoteSource, emoteId: EmoteId]) {
    return this.withDatabase((database) =>
      database.delete("persons-emotes", emoteEntry),
    );
  }
}
