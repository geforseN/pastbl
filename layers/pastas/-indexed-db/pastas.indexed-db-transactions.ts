import type { WithPastasIndexedDB } from "./pastas.indexed-db-types";

export class PastasIndexedDBTransactions {
  constructor(private readonly withDatabase: WithPastasIndexedDB) {}

  get #readwriteListAndBin() {
    return this.withDatabase((database) =>
      database.transaction(["list", "bin"], "readwrite"),
    );
  }

  async movePastaFromListToBin(pasta: OmegaPasta) {
    const transaction = await this.#readwriteListAndBin;
    await Promise.all([
      transaction.objectStore("list").delete(pasta.id),
      transaction.objectStore("bin").put(pasta),
      transaction.done,
    ]);
  }

  async movePastaFromBinToList(pasta: OmegaPasta) {
    const transaction = await this.#readwriteListAndBin;
    await Promise.all([
      transaction.objectStore("bin").delete(pasta.id),
      transaction.objectStore("list").put(pasta),
      transaction.done,
    ]);
  }
}
