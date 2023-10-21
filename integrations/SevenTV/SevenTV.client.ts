import {
  createStorageReader,
  createStorageWriter,
} from "~/client-only/storage";
import type { BaseEmote, EmoteSet } from "..";
import type {
  __SevenTV__EmoteSetFromApi__,
  __SevenTV__UserSetEmote__,
  __SevenTV__UserData__,
} from "./SevenTV.api";

class SevenTV {
  shouldLog = false;

  getEmoteTemplateString(emote: SevenTVEmoteT) {
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

export class SevenTVEmote implements SevenTVEmoteT {
  id;
  url;
  token;
  source;
  isAnimated;
  isModifier;
  isListed;
  isZeroWidth;
  tags;

  constructor(seventvEmote: __SevenTV__UserSetEmote__) {
    this.id = seventvEmote.id;
    this.url = `//cdn.7tv.app/emote/${this.id}` as const;
    this.width = seventvEmote.data.host.files[1].width;
    this.token = seventvEmote.name;
    this.isAnimated = seventvEmote.data.animated;
    this.isModifier = seventvEmote.flags !== 0;
    this.isZeroWidth = seventvEmote.flags === 1;
    this.isListed = seventvEmote.data.listed;
    this.source = "SevenTV" as const;
    this.tags = seventvEmote.data.tags;
  }
}

interface SevenTVEmoteT extends BaseEmote {
  url: `//cdn.7tv.app/emote/${string}`;
  source: "SevenTV";
  originalName?: string;
  tags?: string[];
}

interface SevenTVSetT extends EmoteSet {
  emotes: SevenTVEmoteT[];
  source: "SevenTV";
  name: string;
  capacity: number;
  id: string;
}

export class SevenTVSet implements SevenTVSetT {
  updatedAt;
  source;
  emotes;
  name;
  capacity;
  id;

  constructor(
    fetchedCollection: __SevenTV__EmoteSetFromApi__,
    to7TVEmoteCallback: (value: __SevenTV__UserSetEmote__) => SevenTVEmoteT,
  ) {
    this.id = fetchedCollection.id;
    this.name = fetchedCollection.name;
    // FIXME: think about this.emotes set
    // ? should i throw or use empty array so no throw ?
    // if (!fetchedCollection.emotes) {
    //   throw new Error("SevenTV API did not send any emote");
    // }
    this.emotes = (fetchedCollection.emotes || []).map(to7TVEmoteCallback);
    this.source = "SevenTV" as const;
    this.updatedAt = Date.now();
    this.capacity = fetchedCollection.capacity;
  }
}

const COLLECTION_STORAGE_PREFIX = "7tv::emote-sets::" as const;

export const getSevenTVEmoteCollectionFromStorage =
  createStorageReader<SevenTVSetT>(COLLECTION_STORAGE_PREFIX);

export const setSevenTVEmoteCollectionToStorage =
  createStorageWriter<SevenTVSetT>(COLLECTION_STORAGE_PREFIX);

export class SevenTVCollection {
  name;
  updatedAt;
  sets;

  constructor(sets: SevenTVSet[]) {
    this.name = "SevenTV";
    this.updatedAt = Date.now();
    this.sets = sets;
  }
}
