import type { TPersonEmoteCollection } from "../../_/utils/types";
import type { PersonsEmotesIndexedDBStore } from "$/emote-integrations/persons-emotes-collections/emotes/utils/indexed-db-store";
import type { PersonsEmotesCollectionsIndexedDBTransactions } from "$/emote-integrations/persons-emotes-collections/indexed-db/utils/transactions-store.ts";
import type { PersonsEmoteCollectionsIndexedDBStore } from "$/emote-integrations/persons-emotes-collections/indexed-db/utils/store.ts";

export class PersonsEmoteCollectionsIndexedDBRepository
  implements
    IPersonsEmoteCollectionsRepository<TPersonEmoteCollection.SettledIndexedDB>
{
  constructor(
    private readonly rawCollectionsStore: PersonsEmoteCollectionsIndexedDBStore,
    private readonly emotesStore: PersonsEmotesIndexedDBStore,
    private readonly transactions: PersonsEmotesCollectionsIndexedDBTransactions,
  ) {}

  async get(login: TwitchUserLogin) {
    const rawCollection = await this.getRaw(login);
    const integrations =
      await new PersonIndexedDBEmoteCollectionIntegrationsRepopulate(
        rawCollection.integrations,
        this.emotesStore,
      ).execute();
    return <IPersonEmoteCollection>{
      formedAt: rawCollection.formedAt,
      integrations,
      person: rawCollection.person,
    };
  }

  async getRaw(login: TwitchUserLogin) {
    return await this.rawCollectionsStore.get(login);
  }

  async getAllRaw() {
    return await this.rawCollectionsStore.getAll();
  }

  async getAllLogins() {
    return await this.rawCollectionsStore.getAllLogins();
  }

  async delete(login: TwitchUserLogin) {
    const [collection, otherCollections] = await Promise.all([
      this.getRaw(login),
      this.rawCollectionsStore.getAllRawExcept(login),
    ]);
    const integrations = new PersonIndexedDBEmoteCollectionDeletePreparation(
      collection,
      otherCollections,
    ).execute();
    await this.transactions.delete(login, integrations);
  }

  async put(collection: IPersonEmoteCollection) {
    const { rawCollection, emotes } =
      new PersonIndexedDBEmoteCollectionDepopulation(collection).execute();
    await this.transactions.put(rawCollection, emotes);
  }
}
