import type { DBSchema } from "idb";
import type { TPersonEmoteCollection } from "../../_/utils/types";

export interface PersonsEmoteCollectionsIndexedDBSchema
  extends DBSchema,
    PersonsEmotesIndexedDBSchema {
  "persons-collections": {
    key: TwitchUserLogin;
    value: TPersonEmoteCollection.SettledIndexedDB;
  };
}
