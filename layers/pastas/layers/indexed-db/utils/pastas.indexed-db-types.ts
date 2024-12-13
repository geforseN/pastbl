import type { IDBPDatabase } from "idb";
import type { WithIndexedDBDatabase } from "../../../../indexed-db/utils/indexed-db";
import type { PastasIndexedDBSchema } from "./pastas.indexed-db-schema.ts";

export type PastasIndexedDBDatabase = IDBPDatabase<PastasIndexedDBSchema>;

export type WithPastasIndexedDB = WithIndexedDBDatabase<PastasIndexedDBSchema>;
