import { idb } from "../IndexedDB";

export const collectionsKeyValuesService = {
  activeUserCollection: {
    username: {
      async update(username?: Lowercase<string>) {
        if (typeof window === "undefined") {
          return "";
        }
        const collectionIdb = await idb.collections;
        const isInitialExecution = typeof username === "undefined";
        if (isInitialExecution) {
          const username =
            await collectionIdb.kv.activeUserCollection.username.get();
          return username ?? "";
        }
        await collectionIdb.kv.activeUserCollection.username.put(username);
        return username;
      },
    },
  },
};
