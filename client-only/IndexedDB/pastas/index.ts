import { openDB, type OpenDBCallbacks } from "idb";
import type { PastasSchema } from "..";
import { PastasList } from "./PastasList";
import { PastasShared } from "./PastasShared";

class Pastas {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public readonly list: PastasList,
    public readonly shared: PastasShared,
  ) {}
}

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

function openPastasIdb(upgrade: OpenDBCallbacks<PastasSchema>["upgrade"]) {
  return openDB<PastasSchema>("pastas", 2, { upgrade });
}

export const pastasIdb = openPastasIdb(openPastasIdbUpgrade).then(
  (idb) => new Pastas(new PastasList(idb), new PastasShared(idb)),
);
