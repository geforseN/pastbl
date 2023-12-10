import { defineStore } from "pinia";

export const useUserCollectionsStore = defineStore("user-collections", () => {
  const activeUserCollectionUsername = useAsyncState(
    async (value?: string) => {
      const { idb } = await import("~/client-only/IndexedDB");
      const emoteCollectionsIdb = await idb.emoteCollections;
      if (typeof value === "undefined") {
        return (await emoteCollectionsIdb.kv.getActiveUserCollection()) ?? "";
      }
      const username = value.toLowerCase() as Lowercase<string>;
      await emoteCollectionsIdb.kv.setActiveUserCollection(username);
      return username;
    },
    "",
    { shallow: true },
  );
  const usernamesToSelect = useAsyncState(
    async () => {
      const { idb } = await import("~/client-only/IndexedDB");
      const emoteCollectionsIdb = await idb.emoteCollections;
      return emoteCollectionsIdb.users.getAllCollectionsUsernames();
    },
    [],
    { shallow: true },
  );

  return {
    activeUserCollectionUsername,
    usernamesToSelect,
  };
});
