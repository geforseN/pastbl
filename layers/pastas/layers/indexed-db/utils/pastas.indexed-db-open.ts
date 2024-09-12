export async function openPastasIndexedDB() {
  return await openIndexedDBDatabase<PastasIndexedDBSchema>({
    name: "pastas",
    version: 7,
    upgrade(database, _oldVersion, _newVersion, transaction) {
      if (!database.objectStoreNames.contains("list")) {
        database.createObjectStore("list", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      const pastasStore = transaction.objectStore("list");
      for (const name of pastasStore.indexNames) {
        pastasStore.deleteIndex(name);
      }
      if (!database.objectStoreNames.contains("bin")) {
        database.createObjectStore("bin", {
          keyPath: "id",
        });
      }
    },
  });
}
