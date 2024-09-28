import type { DBSchema } from "idb";

export interface EmoteIntegrationsIndexedDBSchema
  extends DBSchema,
  PersonsEmoteCollectionsIndexedDBSchema,
  GlobalEmotesIntegrationsIndexedDBSchema {}
