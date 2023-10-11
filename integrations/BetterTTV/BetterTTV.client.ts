import type {
  __BTTV__GlobalEmote__,
  __BTTV__UserEmote__,
} from "./BetterTTV.api";

import {
  createStorageReader,
  createStorageWriter,
} from "../../client-only/storage";

export class BetterTTVEmoteImplementation implements BetterTTVEmote {
  id: BetterTTVEmote["id"];
  url: BetterTTVEmote["url"];
  chatName: BetterTTVEmote["chatName"];
  isAnimated: BetterTTVEmote["isAnimated"];
  isModifier: BetterTTVEmote["isModifier"];

  constructor(bttvEmote: __BTTV__GlobalEmote__ | __BTTV__UserEmote__) {
    this.id = bttvEmote.id;
    this.url = `//cdn.betterttv.net/emote/${this.id}`;
    this.chatName = bttvEmote.code;
    this.isAnimated = bttvEmote.animated;
    this.isModifier = "modifier" in bttvEmote ? bttvEmote.modifier : false;
  }
}

export interface BetterTTVEmote {
  id: string;
  url: `//cdn.betterttv.net/emote/${string}`;
  chatName: string;
  isAnimated: boolean;
  isModifier: boolean;
}

export type BttvEmoteCollection = { emotes: BetterTTVEmote[] };

const BTTV_EMOTE_SET_STORAGE_PREFIX = "bttv::emote-sets::" as const;

export const getBttvEmoteCollectionFromStorage =
  createStorageReader<BttvEmoteCollection>(BTTV_EMOTE_SET_STORAGE_PREFIX);

export const setBttvEmoteCollectionToStorage =
  createStorageWriter<BttvEmoteCollection>(BTTV_EMOTE_SET_STORAGE_PREFIX);
