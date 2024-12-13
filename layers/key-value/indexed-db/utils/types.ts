import type { AppIndexedDBSchema } from "../../../../app/utils/app.indexed-db-open";
import type { WithIndexedDBDatabase } from "../../../indexed-db/utils/indexed-db.with";

export type WithAppIndexedDB = WithIndexedDBDatabase<AppIndexedDBSchema>;
