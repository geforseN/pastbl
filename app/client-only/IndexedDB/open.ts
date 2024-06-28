import { openDB } from "idb";
import type { DBSchema, IDBPDatabase, OpenDBCallbacks } from "idb";

export async function openIdb<T extends DBSchema>(
  name: string,
  version: number,
  upgrade: OpenDBCallbacks<T>["upgrade"],
) {
  if (import.meta.test) {
    await import("fake-indexeddb/auto");
  }
  if (import.meta.server) {
    return {} as IDBPDatabase<T>;
  }
  return await openDB<T>(name, version, { upgrade });
}
