import { openDB } from "idb";
import type { DBSchema, IDBPDatabase, OpenDBCallbacks } from "idb";

export function openIdb<T extends DBSchema>(
  name: string,
  version: number,
  upgrade: OpenDBCallbacks<T>["upgrade"],
) {
  if (process.server) {
    return Promise.resolve({} as IDBPDatabase<T>);
  }
  return openDB<T>(name, version, { upgrade });
}
