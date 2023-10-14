import {
  createStorageReader,
  createStorageWriter,
} from "~/client-only/storage";
import type { BaseEmote, EmoteCollection } from "..";
import type {
  __SevenTV__EmoteCollection__,
  __SevenTV__UserCollectionEmote__,
  __SevenTV__UserData__,
} from "./SevenTV.api";

class SevenTV {
  shouldLog = false;

  getEmoteTemplateString(emote: SevenTvEmote) {
    return String.raw`
    <span
      class="inline-block"
      title="${emote.token} emote from SevenTV ${
        !emote.originalName ? "" : `(aka ${emote.originalName})`
      }"
    >
      <img src="https:${emote.url}/1x.webp">
    </span>
  `;
  }
}

export const sevenTV = new SevenTV();

export class SevenTVEmoteImplementation implements SevenTvEmote {
  id: SevenTvEmote["id"];
  url: SevenTvEmote["url"];
  token: SevenTvEmote["token"];
  source: SevenTvEmote["source"];
  isAnimated: SevenTvEmote["isAnimated"];
  isModifier: SevenTvEmote["isModifier"];
  isListed: SevenTvEmote["isListed"];
  isZeroWidth: SevenTvEmote["isZeroWidth"];
  tags;

  constructor(seventvEmote: __SevenTV__UserCollectionEmote__) {
    this.id = seventvEmote.id;
    this.url = `//cdn.7tv.app/emote/${this.id}`;
    this.token = seventvEmote.name;
    this.isAnimated = seventvEmote.data.animated;
    this.isModifier = seventvEmote.flags !== 0;
    this.isZeroWidth = seventvEmote.flags === 1;
    this.isListed = seventvEmote.data.listed;
    this.source = "SevenTV";
    this.tags = seventvEmote.data.tags;
  }
}

interface SevenTvEmote extends BaseEmote {
  url: `//cdn.7tv.app/emote/${string}`;
  source: "SevenTV";
  originalName?: string;
  tags?: string[];
}

interface SevenTVCollection extends EmoteCollection {
  emotes: SevenTvEmote[];
  source: "SevenTV";
  name: string;
  capacity: number;
  id: string;
}

export class SevenTVCollectionImplementation implements SevenTVCollection {
  updatedAt: SevenTVCollection["updatedAt"];
  source: SevenTVCollection["source"];
  emotes: SevenTVCollection["emotes"];
  name: SevenTVCollection["name"];
  capacity: SevenTVCollection["capacity"];
  id: SevenTVCollection["id"];

  constructor(
    fetchedCollection: __SevenTV__EmoteCollection__,
    SevenTVEmote = SevenTVEmoteImplementation,
  ) {
    this.emotes = (fetchedCollection.emotes || []).map(
      (emote) => new SevenTVEmote(emote),
    );
    this.source = "SevenTV" as const;
    this.updatedAt = Date.now();
    this.name = fetchedCollection.name;
    this.capacity = fetchedCollection.capacity;
    this.id = fetchedCollection.id;
  }
}

const COLLECTION_STORAGE_PREFIX = "7tv::emote-sets::" as const;

export const getSevenTVEmoteCollectionFromStorage =
  createStorageReader<SevenTVCollection>(COLLECTION_STORAGE_PREFIX);

export const setSevenTVEmoteCollectionToStorage =
  createStorageWriter<SevenTVCollection>(COLLECTION_STORAGE_PREFIX);

export const a = createStorageReader<{}>("7tv::users");
export const b = createStorageWriter("7tv::users");

class SevenTVUser {
  id: string;
  name: string;
  avatarUrl: string;
  emoteCollections: [];
}

type g = __SevenTV__UserData__;
