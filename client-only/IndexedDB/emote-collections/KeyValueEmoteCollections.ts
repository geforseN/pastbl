import type { IDBPDatabase } from "idb";
import type { EmoteCollectionsSchema, IndexedDBUserEmoteCollection } from "..";

export class KeyValueEmoteCollections {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly idb: IDBPDatabase<EmoteCollectionsSchema>) {}

  setActiveUserCollection(
    value: IndexedDBUserEmoteCollection["twitch"]["username"] | "",
  ) {
    return this.idb.put("key-value", value, "active-user-collection-username");
  }

  getActiveUserCollection() {
    return this.idb.get("key-value", "active-user-collection-username");
  }
}
