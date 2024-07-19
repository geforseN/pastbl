import type { EmoteIntegrationsIndexedDBSchema } from "./emote-integrations.indexed-db-schema";

export async function openEmoteIntegrationsIndexedDBDatabase() {
  return await openIndexedDBDatabase<EmoteIntegrationsIndexedDBSchema>({
    name: "emote-integrations",
    version: 1,
    upgrade(database, oldVersion) {
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
    },
  });
}
