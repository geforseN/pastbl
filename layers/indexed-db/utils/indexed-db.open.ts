import { openDB } from "idb";
import type { DBSchema, IDBPDatabase, OpenDBCallbacks } from "idb";

export async function openIndexedDBDatabase<T extends DBSchema>(
  options: {
    name: string;
    version: number;
    serverStub?: object;
  } & OpenDBCallbacks<T>,
) {
  if (import.meta.env.MODE === "test") {
    // @ts-expect-error types declaration file not found, but it does not matter here
    await import("fake-indexeddb/auto");
  }
  if (import.meta.server) {
    return (options.serverStub ?? {}) as IDBPDatabase<T>;
  }
  return await openDB<T>(options.name, options.version, options);
}
