import type { IPastasStorage } from "./pastas.types";

export class PastasService {
  constructor(private readonly storage: IPastasStorage) {}

  async getAll() {
    if (import.meta.server) {
      return [];
    }
    return await this.storage.getAll();
  }

  async moveFromListToBin(pasta: OmegaPasta) {
    await this.storage.moveFromListToBin(pasta);
  }

  async moveFromBinToList(pasta: OmegaPasta) {
    await this.storage.moveFromBinToList(pasta);
  }

  async add(pasta: MegaPasta) {
    const pastaId = await this.storage.add(pasta);
    const idbPasta: OmegaPasta = {
      ...pasta,
      id: pastaId,
    };
    return idbPasta;
  }

  async patchLastCopied(pasta: OmegaPasta) {
    const newPasta = {
      ...pasta,
      lastCopiedAt: Date.now(),
    };
    await this.storage.put(newPasta);
    return newPasta;
  }

  async put(pasta: OmegaPasta) {
    await this.storage.put(pasta);
  }
}
