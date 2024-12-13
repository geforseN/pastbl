import type { AppIndexedDBSchema } from "../../../../app/utils/app-db-open";
import type { WithIndexedDBDatabase } from "../../../indexed-db/utils/indexed-db";

export type WithAppIndexedDB = WithIndexedDBDatabase<AppIndexedDBSchema>;
