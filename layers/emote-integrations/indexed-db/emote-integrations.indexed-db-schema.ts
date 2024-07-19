import type { DBSchema } from "idb";
import type { PersonsEmoteCollectionsIndexedDBSchema } from "$/emote-integrations/persons-emote-collections/person-emote-collections.indexed-db-schema";
import type { GlobalEmoteIntegrationsIndexedDBSchema } from "../global-emote-integrations/utils/global-emote-integrations.indexed-db-schema";

export interface EmoteIntegrationsIndexedDBSchema
  extends DBSchema,
    PersonsEmoteCollectionsIndexedDBSchema,
    GlobalEmoteIntegrationsIndexedDBSchema {}
