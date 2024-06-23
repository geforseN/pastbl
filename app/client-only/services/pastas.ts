import { idb } from "~/client-only/IndexedDB";

export const pastasService = {
  async getAll() {
    if (import.meta.server) {
      return [];
    }
    const pastasIdb = await idb.pastas;
    return await pastasIdb.list.getAll();
  },
  async moveFromListToBin(pasta: OmegaPasta) {
    const pastasIdb = await idb.pastas;
    await pastasIdb.shared.movePastaFromListToBin(pasta);
  },
  async moveFromBinToList(pasta: OmegaPasta) {
    const pastasIdb = await idb.pastas;
    await pastasIdb.shared.movePastaFromBinToList(pasta);
  },
  async add(pasta: MegaPasta) {
    const pastasIdb = await idb.pastas;
    const pastaId = await pastasIdb.list.add(pasta);
    const idbPasta: OmegaPasta = {
      ...pasta,
      id: pastaId,
    };
    return idbPasta;
  },
  async patchLastCopied(pasta: OmegaPasta) {
    const pastasIdb = await idb.pastas;
    const newPasta = {
      ...pasta,
      lastCopiedAt: Date.now(),
    };
    await pastasIdb.list.put(newPasta);
    return newPasta;
  },
  async put(pasta: OmegaPasta) {
    const pastasIdb = await idb.pastas;
    await pastasIdb.list.put(pasta);
    return pasta;
  },
};
