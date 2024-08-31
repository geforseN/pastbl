import type { DBSchema } from "idb";
import type { TPersonEmoteCollection } from "$persons-emotes-collections";

export interface PersonsEmoteCollectionsIndexedDBSchema
  extends DBSchema,
    PersonsEmotesIndexedDBSchema {
  "persons-collections": {
    key: TwitchUserLogin;
    value: TPersonEmoteCollection.SettledIndexedDB;
  };
}
