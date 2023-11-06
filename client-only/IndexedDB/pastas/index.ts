import {
  openDB,
  type DBSchema,
  type IDBPObjectStore,
  type IDBPDatabase,
} from "idb";

export interface PastasSchema extends DBSchema {
  list: {
    key: IDBMegaPasta["id"];
    value: MegaPasta /* NOTE: actually it is IDBMegaPasta, but we use MegaPasta because of TypeScript yell */;
    indexes: {
      byLength: IDBMegaPasta["length"];
      byCreatedAt: IDBMegaPasta["createdAt"];
      byText: IDBMegaPasta["text"];
      byTags: IDBMegaPasta["tags"];
      byValidTokens: IDBMegaPasta["validTokens"];
    };
  };
}

export async function getLastPastasInCount(
  store: IDBPObjectStore<PastasSchema, ["list"], "list", "readonly">,
  countToGet: number,
) {
  const allPastaCount = await store.count();
  const indexToStart =
    allPastaCount > countToGet ? allPastaCount - countToGet : 0;
  return await store.getAll(IDBKeyRange.lowerBound(indexToStart, true));
}

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

  addPasta(pasta: MegaPasta): Promise<IDBMegaPasta["id"]> {
    return this.idb.transaction("list", "readwrite").store.add(pasta);
  }

  removePastaById(id: IDBMegaPasta["id"]) {
    return this.idb.transaction("list", "readwrite").store.delete(id);
  }
}

export const pastasIdb = new PastasStore(
  await openDB<PastasSchema>("pastas", 1, {
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
  }),
);
