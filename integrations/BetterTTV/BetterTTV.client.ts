import type { BetterTTVEmoteFromAPI } from "./BetterTTV.api";

import {
  createStorageReader,
  createStorageWriter,
} from "../../client-only/storage";
import { BaseEmote, EmoteCollection } from "..";

export class BetterTTVEmoteImplementation implements BetterTTVEmote {
  id: BetterTTVEmote["id"];
  url: BetterTTVEmote["url"];
  token: BetterTTVEmote["token"];
  isAnimated: BetterTTVEmote["isAnimated"];
  isModifier: BetterTTVEmote["isModifier"];
  isListed: BetterTTVEmote["isListed"];
  source: BetterTTVEmote["source"];
  type: BetterTTVEmote["type"];

  constructor(bttvEmote: BetterTTVEmoteFromAPI, type: BetterTTVEmote["type"]) {
    this.id = bttvEmote.id;
    this.url = `//cdn.betterttv.net/emote/${this.id}`;
    this.token = bttvEmote.code;
    this.isAnimated = bttvEmote.animated;
    this.isModifier = "modifier" in bttvEmote ? bttvEmote.modifier : false;
    this.isListed = true;
    this.source = "BetterTTV";
    this.type = type;
  }
}

export interface BetterTTVEmote extends BaseEmote {
  url: `//cdn.betterttv.net/emote/${string}`;
  source: "BetterTTV";
  type: "shared" | "channel" | "global";
}

// TODO add more
interface BttvEmoteCollection extends EmoteCollection {
  emotes: BetterTTVEmote[];
  source: "BetterTTV";
}

export class BetterTTVCollectionImplementation implements BttvEmoteCollection {
  updatedAt: BttvEmoteCollection["updatedAt"];
  source: BttvEmoteCollection["source"];
  emotes: BttvEmoteCollection["emotes"];

  constructor(emotes: BetterTTVEmote[]) {
    this.emotes = emotes;
    this.source = "BetterTTV" as const;
    this.updatedAt = Date.now();
  }
}
const BTTV_EMOTE_SET_STORAGE_PREFIX = "bttv::emote-sets::" as const;

export const getBttvEmoteCollectionFromStorage =
  createStorageReader<BttvEmoteCollection>(BTTV_EMOTE_SET_STORAGE_PREFIX);

export const setBttvEmoteCollectionToStorage =
  createStorageWriter<BttvEmoteCollection>(BTTV_EMOTE_SET_STORAGE_PREFIX);
