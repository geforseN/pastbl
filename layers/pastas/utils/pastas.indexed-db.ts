import type { OpenDBCallbacks } from "idb";
import type { PastasSchema } from "~/client-only/IndexedDB";
import { PastasListStore } from "~~/layers/pastas/utils/PastasList";
import { PastasSharedStore } from "~~/layers/pastas/utils/PastasShared";
import { openIdb } from "~/client-only/IndexedDB/open";

const openPastasIdbUpgrade: OpenDBCallbacks<PastasSchema>["upgrade"] = (
  database,
  _oldVersion,
  _newVersion,
  transaction,
) => {
  if (!database.objectStoreNames.contains("list")) {
    database.createObjectStore("list", {
      keyPath: "id",
      autoIncrement: true,
    });
  }
  const pastasStore = transaction.objectStore("list");
  for (const name of pastasStore.indexNames) {
    pastasStore.deleteIndex(name);
  }
  if (!database.objectStoreNames.contains("bin")) {
    database.createObjectStore("bin", {
      keyPath: "id",
    });
  }
};

class PastasStore {
  constructor(
    public readonly list: PastasListStore,
    public readonly shared: PastasSharedStore,
  ) {}
}

export const pastasIdb = openIdb<PastasSchema>(
  "pastas",
  7,
  openPastasIdbUpgrade,
).then(
  (idb) =>
    new PastasStore(new PastasListStore(idb), new PastasSharedStore(idb)),
);
