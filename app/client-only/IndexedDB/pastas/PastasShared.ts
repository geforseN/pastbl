import type { IDBPDatabase } from "idb";
import type { PastasSchema } from "..";

export class PastasSharedStore {
  constructor(private readonly idb: IDBPDatabase<PastasSchema>) {}

  async movePastaFromListToBin(pasta: OmegaPasta) {
    const transaction = this.idb.transaction(["list", "bin"], "readwrite");
    return await Promise.all([
      transaction.objectStore("list").delete(pasta.id),
      transaction.objectStore("bin").put(pasta),
      transaction.done,
    ]);
  }

  async movePastaFromBinToList(pasta: OmegaPasta) {
    const transaction = this.idb.transaction(["bin", "list"], "readwrite");
    return await Promise.all([
      transaction.objectStore("bin").delete(pasta.id),
      transaction.objectStore("list").put(pasta),
      transaction.done,
    ]);
  }
}
