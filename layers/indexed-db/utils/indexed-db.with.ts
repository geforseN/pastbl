import type { DBSchema, IDBPDatabase } from "idb";

export interface WithIndexedDBDatabase<S extends DBSchema> {
  <T>(callback: (database: IDBPDatabase<S>) => MaybePromise<T>): Promise<T>;
}

export function withIndexedDBDatabase<S extends DBSchema>(
  indexedDBDatabasePromise: Promise<IDBPDatabase<S>>,
): WithIndexedDBDatabase<S> {
  return async function <T>(
    action: (database: IDBPDatabase<S>) => MaybePromise<T>,
  ) {
    const database = await indexedDBDatabasePromise;
    return action(database);
  };
}
