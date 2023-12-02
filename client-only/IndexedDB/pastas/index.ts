import { openDB, type IDBPDatabase } from "idb";
import type { PastasSchema } from "..";

class PastasStore {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly idb: IDBPDatabase<PastasSchema>) {}

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

  addPastaToBin(pasta: IDBMegaPasta) {
    return this.idb
      .transaction("bin", "readwrite")
      .objectStore("bin")
      .add(pasta);
  }

  removePastaFromBinById(id: IDBMegaPasta["id"]) {
    return this.idb
      .transaction("bin", "readwrite")
      .objectStore("bin")
      .delete(id);
  }
}

function openPastasIdb() {
  return openDB<PastasSchema>("pastas", 2, {
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
      database.createObjectStore("bin", {
        keyPath: "id",
      });
    },
  });
}

export const pastasIdb = openPastasIdb().then((idb) => new PastasStore(idb));
