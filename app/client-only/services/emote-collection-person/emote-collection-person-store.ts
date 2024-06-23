import {
  idb,
  type IndexedDBUserEmoteCollection,
} from "~/client-only/IndexedDB";
import type { UsersCollectionsStore } from "~/client-only/IndexedDB/emote-collections/UsersCollections";

class EmoteCollectionsPersonStore {
  constructor(
    private readonly idb: typeof import("~/client-only/IndexedDB").idb,
  ) {}

  #withStore<T>(callback: (store: UsersCollectionsStore) => T) {
    return this.idb.collections.then((database) => callback(database.users));
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

  async put(collection: IndexedDBUserEmoteCollection) {
    return await this.#withStore((store) => store.put(collection));
  }

  async delete(login: TwitchUserLogin) {
    return await this.#withStore((store) => store.delete(login));
  }
}

export const store = new EmoteCollectionsPersonStore(idb);
