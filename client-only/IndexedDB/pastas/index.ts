import { openDB, type IDBPDatabase } from "idb";
import type { PastasSchema } from "..";

class PastasStore {
  idb;

  constructor(idb: IDBPDatabase<PastasSchema>) {
    this.idb = idb;
  }

  async getLastPastasInCount(countToGet: number) {
    const store = this.idb.transaction("list").store;
    const allPastaCount = await store.count();
    const indexToStart =
      allPastaCount > countToGet ? allPastaCount - countToGet : 0;
    return store.getAll(IDBKeyRange.lowerBound(indexToStart, true)) as Promise<
      IDBMegaPasta[]
    >;
  }

  updatePastaLastCopied(pasta: IDBMegaPasta) {
    return this.idb.put("list", {
      ...pasta,
      tags: toRaw(pasta.tags),
      validTokens: toRaw(pasta.validTokens),
      populatedText: undefined,
      lastCopiedAt: Date.now(),
    });
  }

  getAllPastas() {
    return this.idb.transaction("list").store.getAll() as Promise<
      IDBMegaPasta[]
    >;
  }

  addPasta(pasta: MegaPasta): Promise<IDBMegaPasta["id"]> {
    return this.idb.transaction("list", "readwrite").store.add(pasta);
  }

  removePastaById(id: IDBMegaPasta["id"]) {
    return this.idb.transaction("list", "readwrite").store.delete(id);
  }
}

function openPastasDB() {
  return openDB<PastasSchema>("pastas", 1, {
    upgrade(database, _oldVersion, _newVersion, _transaction) {
      const pastasStore = database.createObjectStore("list", {
        keyPath: "id",
        autoIncrement: true,
      });
      pastasStore.createIndex("byLength", "length", { unique: false });
      pastasStore.createIndex("byCreatedAt", "createdAt", { unique: true });
      pastasStore.createIndex("byTags", "tags", {
        unique: false,
        multiEntry: true,
      });
      pastasStore.createIndex("byText", "text", { unique: true });
      pastasStore.createIndex("byValidTokens", "validTokens", {
        unique: false,
        multiEntry: true,
      });
    },
  });
}

export const pastasIdb = new PastasStore(await openPastasDB());
