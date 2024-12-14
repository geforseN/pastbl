import type { MegaPasta, OmegaPasta } from "../../layers/chat-pasta/utils/pasta";
import type { IPastasRepository } from "../abstract.ts";

export class PastasService {
  constructor(private readonly repository: IPastasRepository) {}

  async getAll() {
    if (import.meta.server) {
      return [];
    }
    return await this.repository.getAll();
  }

  async moveFromListToBin(pasta: OmegaPasta) {
    await this.repository.moveFromListToBin(pasta);
  }

  async moveFromBinToList(pasta: OmegaPasta) {
    await this.repository.moveFromBinToList(pasta);
  }

  async add(pasta: MegaPasta) {
    const pastaId = await this.repository.add(pasta);
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
    await this.repository.put(newPasta);
    return newPasta;
  }

  async put(pasta: OmegaPasta) {
    await this.repository.put(pasta);
  }
}
