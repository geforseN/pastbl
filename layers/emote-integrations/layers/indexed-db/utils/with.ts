export type WithEmoteIntegrationsIndexedDB =
  WithIndexedDBDatabase<EmoteIntegrationsIndexedDBSchema>;

const emoteIntegrationsIndexedDBPromise
  = openEmoteIntegrationsIndexedDBDatabase();

export const withEmoteIntegrationsIndexedDB = withIndexedDBDatabase(
  emoteIntegrationsIndexedDBPromise,
);
