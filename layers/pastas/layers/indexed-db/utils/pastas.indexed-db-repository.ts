import type { OmegaPasta, MegaPasta } from "../../chat-pasta/utils/pasta";
import type { IPastasRepository } from "../../../utils/abstract";
import type { PastasListIndexedDBStore } from "./pastas.indexed-db-store.list.ts";
import type { PastasIndexedDBTransactions } from "./pastas.indexed-db-transactions.ts";

export class PastasIndexedDBRepository implements IPastasRepository {
  constructor(
    private readonly list: PastasListIndexedDBStore,
    private readonly transactions: PastasIndexedDBTransactions,
  ) {}

  async add(pasta: MegaPasta) {
    return await this.list.add(pasta);
  }

  async put(pasta: OmegaPasta) {
    await this.list.put(pasta);
  }

  async getAll() {
    return await this.list.getAll();
  }

  async moveFromBinToList(pasta: OmegaPasta) {
    return await this.transactions.movePastaFromBinToList(pasta);
  }

  async moveFromListToBin(pasta: OmegaPasta) {
    return await this.transactions.movePastaFromListToBin(pasta);
  }
}
