import type { DBSchema } from "idb";

export interface PersonsEmoteCollectionsIndexedDBSchema
  extends DBSchema,
    PersonsEmotesIndexedDBSchema {
  "persons-collections": {
    key: TwitchUserLogin;
    value: TPersonEmoteCollection.SettledIndexedDB;
  };
}
