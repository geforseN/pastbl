import type { BetterTTVEmoteFromAPI } from "./BetterTTV.api";

import {
  createStorageReader,
  createStorageWriter,
} from "../../client-only/storage";
import { BaseEmote, EmoteSet } from "..";

export interface BetterTTVEmote extends BaseEmote {
  url: `//cdn.betterttv.net/emote/${string}`;
  source: "BetterTTV";
  type: "shared" | "channel" | "global";
}
export class BTTVEmote implements BetterTTVEmote {
  id: BetterTTVEmote["id"];
  url: BetterTTVEmote["url"];
  token: BetterTTVEmote["token"];
  isAnimated: BetterTTVEmote["isAnimated"];
  isModifier: BetterTTVEmote["isModifier"];
  isListed: BetterTTVEmote["isListed"];
  source: BetterTTVEmote["source"];
  type: BetterTTVEmote["type"];
  isZeroWidth: BetterTTVEmote["isZeroWidth"];

  constructor(bttvEmote: BetterTTVEmoteFromAPI, type: BetterTTVEmote["type"]) {
    this.id = bttvEmote.id;
    this.url = `//cdn.betterttv.net/emote/${this.id}`;
    this.token = bttvEmote.code;
    this.isAnimated = bttvEmote.animated;
    this.isModifier = "modifier" in bttvEmote ? bttvEmote.modifier : false;
    this.isListed = true;
    this.isZeroWidth = false;
    this.source = "BetterTTV";
    this.type = type;
  }
}

// TODO add more properties if needed
interface BetterTTVEmoteSet extends EmoteSet<BetterTTVEmote> {
  source: "BetterTTV";
}

export class BTTVSet implements BetterTTVEmoteSet {
  updatedAt;
  source;
  emotes;
  name;
  id;

  constructor(
    bttvSetData: { name: string; emotes: BetterTTVEmoteFromAPI[]; id: string },
    toBTTVEmoteCallback: (value: BetterTTVEmoteFromAPI) => BTTVEmote,
  ) {
    this.id = bttvSetData.id;
    this.name = bttvSetData.name;
    this.emotes = bttvSetData.emotes.map(toBTTVEmoteCallback);
    this.source = "BetterTTV" as const;
    this.updatedAt = Date.now();
  }
}
const COLLECTION_STORAGE_PREFIX = "bttv::emote-sets::" as const;

export const getBttvEmoteCollectionFromStorage =
  createStorageReader<BetterTTVEmoteSet>(COLLECTION_STORAGE_PREFIX);

export const setBttvEmoteCollectionToStorage =
  createStorageWriter<BetterTTVEmoteSet>(COLLECTION_STORAGE_PREFIX);

export class BTTVCollection {
  name;
  updatedAt;
  sets;

  constructor(sets: BTTVSet[]) {
    this.name = "BetterTTV";
    this.updatedAt = Date.now();
    this.sets = sets;
  }
}
