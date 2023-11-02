import {
  openDB,
  type DBSchema,
  type IDBPDatabase,
  type IDBPObjectStore,
} from "idb";
import type {
  EmoteIDBCollection,
  IUserProfile,
} from "./IndexedDB/UserProfileCollections";
import type { Emote } from "~/integrations";
import { EmoteCollection } from "~/integrations/EmoteCollection";

export interface UsersEmoteCollectionsDB extends DBSchema {
  profiles: {
    key: IUserProfile["twitch"]["username"];
    value: IUserProfile;
  };
  emotes: {
    key: [Emote["id"], Emote["source"]];
    value: Emote & { updatedAt: number };
    indexes: {
      byId: Emote["id"];
      bySource: "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch";
      byToken: Emote["token"];
      byTags: string[];
    };
  };
  // NOTE: emoteIds and usedEmotes are in schema, no emotes in schema
  // activeProfile:
}

export function openUserEmoteCollectionsDB() {
  return openDB<UsersEmoteCollectionsDB>("user-emote-collections", 1, {
    upgrade(database) {
      database.createObjectStore("profiles", {
        keyPath: "twitch.username",
      });
      const emotesStore = database.createObjectStore("emotes", {
        keyPath: ["id", "source"],
      });
      emotesStore.createIndex("bySource", "source", { unique: false });
      emotesStore.createIndex("byId", "id", { unique: false });
      emotesStore.createIndex("byToken", "token", { unique: false });
      // NOTE: tags only exist in 7TV emotes
      emotesStore.createIndex("byTags", "tags", {
        unique: false,
        multiEntry: true,
      });
    },
  });
}

export function putUserEmotesToDB(
  userEmotes: Emote[],
  db: IDBPDatabase<UsersEmoteCollectionsDB>,
) {
  const emoteStore = db
    .transaction("emotes", "readwrite")
    .objectStore("emotes");
  return Promise.all(
    userEmotes.map((emote) =>
      emoteStore.put({ ...emote, updatedAt: Date.now() }),
    ),
  );
}

export function putUserProfileToDB(
  profile: IUserProfile,
  db: IDBPDatabase<UsersEmoteCollectionsDB>,
) {
  const profileStore = db
    .transaction("profiles", "readwrite")
    .objectStore("profiles");
  return profileStore.put(profile);
}

export function getProperUserCollectionFromIDB(
  idbCollectionsRecord: Record<
    "BetterTTV" | "SevenTV" | "FrankerFaceZ",
    EmoteIDBCollection
  >,
  emoteIDBStore: IDBPObjectStore<
    UsersEmoteCollectionsDB,
    ["emotes"],
    "emotes",
    "readonly"
  >,
) {
  return Promise.all(
    Object.values(idbCollectionsRecord).map((idbCollection) =>
      EmoteCollection.fromIDBCollection(idbCollection, (emoteId) =>
        emoteIDBStore.get([emoteId, idbCollection.source]),
      ),
    ),
  );
}
