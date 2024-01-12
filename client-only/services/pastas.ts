import { idb } from "../IndexedDB";

export const pastasService = {
  async getAll() {
    if (typeof window === "undefined") {
      return [];
    }
    const pastasIdb = await idb.pastas;
    return await pastasIdb.list.getAllPastas();
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
    return pastasIdb.list.addPasta(pasta);
  },
  async updateLastCopied(pasta: IDBMegaPasta) {
    const pastasIdb = await idb.pastas;
    await pastasIdb.list.patchLastCopied(pasta);
  },
};
