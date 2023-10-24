import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Emote, EmoteCollection, EmoteSet } from "~/integrations";

interface LocalPastasDB extends DBSchema {
  pastas: {
    key: number;
    value: any;
  };
  archive: {
    key: number;
    value: any;
  };
  redacted: {
    key: number;
    value: any;
  };
}

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
    key: string /* twitch nickname */;
    value: Profile;
  };
  emotes: {
    key: [Emote["id"], Emote["source"]];
    value: Emote & { updatedAt: number };
    indexes: {
      byId: Emote["id"];
      bySource: "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch";
      byToken: Emote["token"];
    };
  };
}

export async function openUserEmoteCollectionsDB() {
  return openDB<UsersEmoteCollectionsDB>("user-emote-collections", 1, {
    upgrade(database) {
      const usersStore = database.createObjectStore("profiles", {
        keyPath: "twitch.nickname",
      });
      const emotesStore = database.createObjectStore("emotes", {
        keyPath: ["id", "source"],
      });
      emotesStore.createIndex("bySource", "source", { unique: false });
      emotesStore.createIndex("byId", "id", { unique: false });
      emotesStore.createIndex("byToken", "token", { unique: false });
    },
  });
}

// TODO: maybe add here updatedAt instead of entity
function mapSet(emoteSet: EmoteSet) {
  if (!emoteSet.emotes) {
    throw new Error(
      "Emote set does not have emotes, can not add id to IndexedDB collection",
    );
  }
  const { emotes, ...setToSave } = {
    ...emoteSet,
    emoteIds: emoteSet.emotes.map((emote) => emote.id),
  } satisfies EmoteSet & { emoteIds: Emote["id"][] };

  return { ...setToSave };
}

function mapEmote(emote: Emote) {
  return {
    ...emote,
    updatedAt: Date.now(),
  };
}

export function getMappedEmotesFromIdb(
  profile: Profile,
  db: IDBPDatabase<UsersEmoteCollectionsDB>,
) {
  return Object.entries(profile.collections).reduce(
    async (record, [key, collection]) => {
      const emotes = await db.getAllFromIndex(
        "emotes",
        "bySource",
        key as "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch",
      );
      record[key as "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch"] =
        emotes.filter((emote) =>
          collection.sets.some((set) => set.emoteIds.includes(emote.id)),
        );
      return record;
    },
    {} as Record<
      "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch",
      (Emote & { updatedAt: number })[]
    >,
  );
}
