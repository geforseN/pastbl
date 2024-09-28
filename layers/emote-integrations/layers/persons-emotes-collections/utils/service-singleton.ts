export const personsEmotesCollectionsService
  = new PersonsEmotesCollectionsService(
    new PersonsEmoteCollectionsIndexedDBRepository(
      new PersonsEmoteCollectionsIndexedDBStore(withEmoteIntegrationsIndexedDB),
      new PersonsEmotesIndexedDBStore(withEmoteIntegrationsIndexedDB),
      new PersonsEmotesCollectionsIndexedDBTransactions(
        withEmoteIntegrationsIndexedDB,
      ),
    ),
    new PersonsEmotesCollectionsApi(
      $fetch.create({ baseURL: "/api/v1/persons-emotes-collections" }),
    ),
  );
