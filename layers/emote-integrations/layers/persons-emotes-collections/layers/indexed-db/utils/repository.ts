import type { PersonsEmotesIndexedDBStore } from "$persons-emotes-collections/layers/emotes/utils/indexed-db-store";
import type { PersonsEmotesCollectionsIndexedDBTransactions } from "$persons-emotes-collections/layers/indexed-db/utils/transactions-store";
import type { PersonsEmoteCollectionsIndexedDBStore } from "$persons-emotes-collections/layers/indexed-db/utils/store";

export class PersonsEmoteCollectionsIndexedDBRepository
implements
    IPersonsEmoteCollectionsRepository<TPersonEmoteCollection.SettledIndexedDB> {
  constructor(
    private readonly rawCollectionsStore: PersonsEmoteCollectionsIndexedDBStore,
    private readonly emotesStore: PersonsEmotesIndexedDBStore,
    private readonly transactions: PersonsEmotesCollectionsIndexedDBTransactions,
  ) {}

  async get(login: TwitchUserLogin) {
    const rawCollection = await this.getRaw(login);
    const integrations
      = await new PersonIndexedDBEmoteCollectionIntegrationsRepopulate(
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
    const { rawCollection, emotes }
      = new PersonIndexedDBEmoteCollectionDepopulation(collection).execute();
    await this.transactions.put(rawCollection, emotes);
  }
}
