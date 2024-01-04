import type { OpenDBCallbacks } from "idb";
import type { PastasSchema } from "~/client-only/IndexedDB";
import { PastasListStore } from "~/client-only/IndexedDB/pastas/PastasList";
import { PastasSharedStore } from "~/client-only/IndexedDB/pastas/PastasShared";

const openPastasIdbUpgrade: OpenDBCallbacks<PastasSchema>["upgrade"] = (
  database,
  _oldVersion,
  _newVersion,
  _transaction,
) => {
  if (!database.objectStoreNames.contains("list")) {
    const pastasStore = database.createObjectStore("list", {
      keyPath: "id",
      autoIncrement: true,
    });
    pastasStore.createIndex("byLength", "length", { unique: false });
    pastasStore.createIndex("byCreatedAt", "createdAt", {
      unique: true,
    });
    pastasStore.createIndex("byTags", "tags", {
      unique: false,
      multiEntry: true,
    });
    pastasStore.createIndex("byText", "text", { unique: true });
    pastasStore.createIndex("byValidTokens", "validTokens", {
      unique: false,
      multiEntry: true,
    });
  }
  if (!database.objectStoreNames.contains("bin")) {
    database.createObjectStore("bin", {
      keyPath: "id",
    });
  }
};

class PastasStore {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public readonly list: PastasListStore,
    public readonly shared: PastasSharedStore,
  ) {}
}

export const pastasIdb = import("~/client-only/IndexedDB")
  .then(({ openIdb }) =>
    openIdb<PastasSchema>("pastas", 2, openPastasIdbUpgrade),
  )
  .then(
    (idb) =>
      new PastasStore(new PastasListStore(idb), new PastasSharedStore(idb)),
  );
