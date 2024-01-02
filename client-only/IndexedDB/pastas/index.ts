import { openDB, type IDBPDatabase } from "idb";
import type { PastasSchema } from "..";

class PastasShared {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly idb: IDBPDatabase<PastasSchema>) {}

  async movePastaFromListToBin(pasta: IDBMegaPasta) {
    const tx = this.idb.transaction(["list", "bin"], "readwrite");
    return await Promise.all([
      tx.objectStore("list").delete(pasta.id),
      tx.objectStore("bin").put(pasta),
      tx.done,
    ]);
  }

  async movePastaFromBinToList(pasta: IDBMegaPasta) {
    const tx = this.idb.transaction(["bin", "list"], "readwrite");
    return await Promise.all([
      tx.objectStore("bin").delete(pasta.id),
      tx.objectStore("list").put(pasta),
      tx.done,
    ]);
  }
}

class PastasList {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly idb: IDBPDatabase<PastasSchema>) {}

  updatePastaLastCopied(pasta: IDBMegaPasta) {
    return this.idb.put("list", {
      ...pasta,
      lastCopiedAt: Date.now(),
    });
  }

  getAllPastas() {
    return this.idb.transaction("list").store.getAll() as Promise<
      IDBMegaPasta[]
    >;
  }

  async addPasta(pasta: MegaPasta): Promise<IDBMegaPasta> {
    const pastaId = await this.idb
      .transaction("list", "readwrite")
      .store.add(pasta);
    return {
      ...pasta,
      id: pastaId,
    };
  }
}

class Pastas {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public readonly list: PastasList,
    public readonly shared: PastasShared,
  ) {}
}

function openPastasIdb() {
  return openDB<PastasSchema>("pastas", 2, {
    upgrade(database, _oldVersion, _newVersion, _transaction) {
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
    },
  });
}

export const pastasIdb = openPastasIdb().then(
  (idb) => new Pastas(new PastasList(idb), new PastasShared(idb)),
);
