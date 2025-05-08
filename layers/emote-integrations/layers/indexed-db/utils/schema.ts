import type { DBSchema } from "idb";
import type { GlobalEmotesIntegrationsIndexedDBSchema } from "../../global-emotes-integrations/utils/indexed-db/schema";
import type { PersonsEmoteCollectionsIndexedDBSchema } from "../../persons-emotes-collections/layers/indexed-db/utils/schema";

export interface EmoteIntegrationsIndexedDBSchema
  extends DBSchema,
  PersonsEmoteCollectionsIndexedDBSchema,
  GlobalEmotesIntegrationsIndexedDBSchema {}
