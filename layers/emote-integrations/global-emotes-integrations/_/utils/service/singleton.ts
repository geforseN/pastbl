export const globalEmotesIntegrationsService = new GlobalEmotesIntegrationService(
  new GlobalEmotesIntegrationsIndexedDBRepository(
    new GlobalEmotesIntegrationsIndexedDBStore(withEmoteIntegrationsIndexedDB),
  ),
  new GlobalEmotesIntegrationsAPI(
    $fetch.create({ baseURL: "/api/v1" }),
  ),
);
