import type { IDBPDatabase } from "idb";
import type { CollectionsSchema, IndexedDBUserEmoteCollection } from "..";

class ActiveUserCollection {
  // eslint-disable-next-line no-useless-constructor
  constructor(public readonly username: ActiveUserCollectionUsername) {}
}

class ActiveUserCollectionUsername {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly idb: IDBPDatabase<CollectionsSchema>) {}

  put(value: IndexedDBUserEmoteCollection["twitch"]["username"] | "") {
    return this.idb.put("key-value", value, "active-user-collection-username");
  }

  get() {
    return this.idb.get("key-value", "active-user-collection-username");
  }
}

export class CollectionsKeyValueStore {
  activeUserCollection: { username: ActiveUserCollectionUsername };

  constructor(idb: IDBPDatabase<CollectionsSchema>) {
    this.activeUserCollection = new ActiveUserCollection(
      new ActiveUserCollectionUsername(idb),
    );
  }
}
