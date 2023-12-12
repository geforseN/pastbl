import type { IDBPDatabase } from "idb";
import type { EmoteCollectionsSchema, IndexedDBUserCollection } from "..";

export class KeyValueEmoteCollections {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly idb: IDBPDatabase<EmoteCollectionsSchema>) {}

  setActiveUserCollection(
    value: IndexedDBUserCollection["twitch"]["username"] | "",
  ) {
    return this.idb.put("key-value", value, "active-user-collection-username");
  }

  getActiveUserCollection() {
    return this.idb.get("key-value", "active-user-collection-username");
  }
}
