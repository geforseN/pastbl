import type { IDBPDatabase } from "idb";
import type { PastasSchema } from "..";

export class PastasSharedStore {
  constructor(private readonly idb: IDBPDatabase<PastasSchema>) {}

  async movePastaFromListToBin(pasta: OmegaPasta) {
    const tx = this.idb.transaction(["list", "bin"], "readwrite");
    return await Promise.all([
      tx.objectStore("list").delete(pasta.id),
      tx.objectStore("bin").put(pasta),
      tx.done,
    ]);
  }

  async movePastaFromBinToList(pasta: OmegaPasta) {
    const tx = this.idb.transaction(["bin", "list"], "readwrite");
    return await Promise.all([
      tx.objectStore("bin").delete(pasta.id),
      tx.objectStore("list").put(pasta),
      tx.done,
    ]);
  }
}
