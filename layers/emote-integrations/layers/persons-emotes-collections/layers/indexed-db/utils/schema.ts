import type { DBSchema } from "idb";
import { SettledIndexedDB } from "../../../shared/types/namespace";
import type * as TPersonEmoteCollection from "../../../shared/types/namespace";
import type { PersonsEmotesIndexedDBSchema } from "../../emotes/utils/indexed-db-schema";

export interface PersonsEmoteCollectionsIndexedDBSchema
  extends DBSchema,
  PersonsEmotesIndexedDBSchema {
  "persons-collections": {
    key: TwitchUserLogin;
    value: TPersonEmoteCollection.SettledIndexedDB;
  };
}
