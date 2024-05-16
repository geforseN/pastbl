import { idb } from "~/client-only/IndexedDB";

export const pastasService = {
  async getAll() {
    if (process.server) {
      return [];
    }
    const pastasIdb = await idb.pastas;
    return await pastasIdb.list.getAll();
  },
  async moveFromListToBin(pasta: IDBMegaPasta) {
    const pastasIdb = await idb.pastas;
    await pastasIdb.shared.movePastaFromListToBin(pasta);
  },
  async moveFromBinToList(pasta: IDBMegaPasta) {
    const pastasIdb = await idb.pastas;
    await pastasIdb.shared.movePastaFromBinToList(pasta);
  },
  async add(pasta: MegaPasta) {
    const pastasIdb = await idb.pastas;
    const pastaId = await pastasIdb.list.add(pasta);
    const idbPasta: IDBMegaPasta = {
      ...pasta,
      id: pastaId,
    };
    return idbPasta;
  },
  async patchLastCopied(pasta: IDBMegaPasta) {
    const pastasIdb = await idb.pastas;
    const newPasta = {
      ...pasta,
      lastCopiedAt: Date.now(),
    };
    await pastasIdb.list.put(newPasta);
    return newPasta;
  },
  async put(pasta: IDBMegaPasta) {
    const pastasIdb = await idb.pastas;
    await pastasIdb.list.put(pasta);
    return pasta;
  },
};
