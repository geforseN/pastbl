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

interface UsersEmoteCollectionsDB extends DBSchema {
  users: {
    key: string /* twitch nickname */;
    value: {
      twitchNickname: string;
      twitchId: number;
      updatedAt: number;
      collectionIndexes: number[];
      info: Record<string, any>;
    };
  };
  collections: {
    key: [EmoteCollection["name"], EmoteCollection["source"]];
    value: Omit<EmoteCollection, "sets"> & {
      setIds: EmoteSet["id"][];
    };
    indexes: {
      byTwitchNicknameOwner: EmoteCollection["name"];
      bySource: "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch";
    };
  };
  sets: {
    key: [EmoteSet["id"], EmoteSet["source"]];
    value: Omit<EmoteSet, "emotes"> & {
      // NOTE: there is probability, that equal emote id can be found in different sources
      emoteIds: string[];
      initialIndex: number;
    };
    indexes: {
      // FIXME: remove me or add to set prop => ownerTwitchNickname;
      // FIXME: byOwnerTwitchNickname: string;
      bySource: "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch";
      byId: EmoteSet["id"];
    };
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
      const usersStore = database.createObjectStore("users", {
        keyPath: "twitchNickname",
      });
      const collectionsStore = database.createObjectStore("collections", {
        keyPath: ["name", "source"],
      });
      collectionsStore.createIndex("bySource", "source", { unique: false });
      collectionsStore.createIndex("byTwitchNicknameOwner", "name");
      const setsStore = database.createObjectStore("sets", {
        keyPath: ["id", "source"],
      });
      setsStore.createIndex("byId", "id", { unique: false });
      setsStore.createIndex("bySource", "source", { unique: false });
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
function mapCollection(collection: EmoteCollection) {
  if (!collection.sets) {
    throw new Error(
      "Emote set does not have emotes, can not add id to IndexedDB collection",
    );
  }
  const { ...setToSave } = {
    ...collection,
    setIds: collection.sets.map((set) => set.id),
  } satisfies EmoteCollection & {
    setIds: EmoteSet["id"][];
  };

  return { ...setToSave };
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

//

async function populatePastas(pastas: MegaPasta[], db: IDBPDatabase<PastaDB>) {
  const pastasList = db.transaction("list", "readwrite").store;
  await Promise.all(pastas.map((pasta) => pastasList.put(toRaw(pasta))));
}

function asd() {
  openDB<PastaDB>("pastas", 1, {
    upgrade(db) {
      const pastaList = db.createObjectStore("list", { autoIncrement: true });
      pastaList.createIndex("byLength", "length");
      pastaList.createIndex("byCreatedAt", "createdAt");
      pastaList.createIndex("byText", "text");
      pastaList.createIndex(
        "byTags",
        "tags",
        /* NOTE: недавно добавлен */ { multiEntry: true },
      );
    },
  });
}

interface PastaDB extends DBSchema {
  list: {
    key: number;
    value: MegaPasta;
    indexes: {
      byCreatedAt: string;
      byText: string;
      byLength: number;
      byTags: string[];
    };
  };
}
