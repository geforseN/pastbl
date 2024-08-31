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
