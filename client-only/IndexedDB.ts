import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Emote, EmoteCollection, EmoteSet } from "~/integrations";

type Profile = {
  twitch: {
    nickname: string;
    id: string;
  };
  updatedAt: number;
  info: Record<string, any>;
  collections: Record<
    "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch",
    Omit<EmoteCollection, "sets"> & {
      sets: (Omit<EmoteSet, "emotes"> & {
        emoteIds: Emote["id"][];
      })[];
    }
  >;
};

interface UsersEmoteCollectionsDB extends DBSchema {
  profiles: {
    key: string;
    value: Profile;
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
}

export function openUserEmoteCollectionsDB() {
  return openDB<UsersEmoteCollectionsDB>("user-emote-collections", 1, {
    upgrade(database) {
      database.createObjectStore("profiles", {
        keyPath: "twitch.nickname",
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

export function addUserEmotesToDB(
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

export function addUserProfileToDB(db: IDBPDatabase<UsersEmoteCollectionsDB>) {
  const profileStore = db
    .transaction("profiles", "readwrite")
    .objectStore("profiles");
  console.log({ profileStore, TODO: "go make me work" });
}
