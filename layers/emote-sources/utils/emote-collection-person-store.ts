import { idb } from "~~/layers/indexed-db/utils";
import type { TPersonEmoteCollection } from "~/integrations/abstract/PersonEmoteCollection";

class EmoteCollectionsPersonStore {
  constructor(
    private readonly idb: typeof import("~~/layers/indexed-db/utils").idb,
  ) {}

  #withStore<T>(callback: (store: UsersCollectionsStore) => T) {
    return this.idb.collections.then((store) => callback(store.users));
  }

  async get(login: TwitchUserLogin) {
    return await this.#withStore((store) => store.get(login));
  }

  async getAllLogins() {
    if (import.meta.server) {
      return [];
    }
    return await this.#withStore((store) => store.getAllLogins());
  }

  async getAll() {
    if (import.meta.server) {
      return [];
    }
    return await this.#withStore((store) => store.getAll());
  }

  async put(collection: TPersonEmoteCollection.SettledIndexedDB) {
    return await this.#withStore((store) => store.put(collection));
  }

  async delete(login: TwitchUserLogin) {
    return await this.#withStore((store) => store.delete(login));
  }
}

export const store = new EmoteCollectionsPersonStore(idb);
