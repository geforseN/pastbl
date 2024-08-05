export async function openEmoteIntegrationsIndexedDBDatabase() {
  return await openIndexedDBDatabase<EmoteIntegrationsIndexedDBSchema>({
    name: "emote-integrations",
    version: 3,
    upgrade(database, oldVersion) {
      console.log(oldVersion);
      if (oldVersion < 1) {
        database.createObjectStore("persons-emotes", {
          keyPath: ["source", "id"],
        });
        database.createObjectStore("persons-collections", {
          keyPath: "twitch.login",
        });
        database.createObjectStore("global-integrations", {
          keyPath: "source",
        });
      }
      if (oldVersion < 2) {
        database.deleteObjectStore("persons-collections");
        database.createObjectStore("persons-collections", {
          keyPath: "person.twitch.login",
        });
      }
    },
  });
}
