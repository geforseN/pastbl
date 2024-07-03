import { idb } from "~~/layers/indexed-db/utils";

function withDatabase<T>(
  callback: (database: Awaited<typeof idb.pastas>) => T,
) {
  return idb.pastas.then((database) => callback(database));
}

export const pastasService = {
  async getAll() {
    if (import.meta.server) {
      return [];
    }
    return await withDatabase((database) => database.list.getAll());
  },
  async moveFromListToBin(pasta: OmegaPasta) {
    await withDatabase((database) =>
      database.shared.movePastaFromListToBin(pasta),
    );
  },
  async moveFromBinToList(pasta: OmegaPasta) {
    await withDatabase((database) =>
      database.shared.movePastaFromBinToList(pasta),
    );
  },
  async add(pasta: MegaPasta) {
    const pastaId = await withDatabase((database) => database.list.add(pasta));
    const idbPasta: OmegaPasta = {
      ...pasta,
      id: pastaId,
    };
    return idbPasta;
  },
  async patchLastCopied(pasta: OmegaPasta) {
    const newPasta = {
      ...pasta,
      lastCopiedAt: Date.now(),
    };
    await withDatabase((database) => database.list.put(newPasta));
    return newPasta;
  },
  async put(pasta: OmegaPasta) {
    await withDatabase((database) => database.list.put(pasta));
  },
};
