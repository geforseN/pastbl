import type { DBSchema } from "idb";
import type { PersonsEmotesIndexedDBSchema } from "$/emote-integrations/persons-emote-collections/persons-emotes/persons-emotes.indexed-db-schema";
import type { TPersonEmoteCollection } from "~~/layers/emote-integrations/persons-emote-collections/PersonEmoteCollection";

export interface PersonsEmoteCollectionsIndexedDBSchema
  extends DBSchema,
    PersonsEmotesIndexedDBSchema {
  "persons-collections": {
    key: TwitchUserLogin;
    value: TPersonEmoteCollection.SettledIndexedDB;
  };
}
