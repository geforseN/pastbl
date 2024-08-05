import type { TPersonEmoteCollection } from "../../_/utils/types";

export class PersonsEmotesCollectionsIndexedDBTransactions {
  constructor(private readonly withDatabase: WithEmoteIntegrationsIndexedDB) {}

  get #readwriteTransaction() {
    return this.withDatabase((database) =>
      database.transaction(
        ["persons-collections", "persons-emotes"],
        "readwrite",
      ),
    );
  }

  async delete(
    login: TwitchUserLogin,
    integrations: { source: EmoteSource; emotesIds: string[] }[],
  ) {
    const transaction = await this.#readwriteTransaction;
    const emotesStore = transaction.objectStore("persons-emotes");
    await Promise.all([
      transaction.objectStore("persons-collections").delete(login),
      Promise.all(
        integrations.map(({ source, emotesIds }) =>
          Promise.all(
            emotesIds.map((emoteId) => emotesStore.delete([source, emoteId])),
          ),
        ),
      ),
      transaction.done,
    ]);
  }

  async put(
    collection: TPersonEmoteCollection.SettledIndexedDB,
    emotes: IEmote[],
  ) {
    const transaction = await this.#readwriteTransaction;
    const emotesStore = transaction.objectStore("persons-emotes");
    await Promise.all([
      transaction.objectStore("persons-collections").put(collection),
      Promise.all(emotes.map((emote) => emotesStore.put(emote))),
      transaction.done,
    ]);
  }
}
