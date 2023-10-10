import type {
  __BTTV__GlobalEmote__,
  __BTTV__UserEmote__,
} from "./BetterTTV.api";
import {
  createStorageReader,
  createStorageWriter,
} from "../../utils/storage.client";

export class BetterTTVEmote {
  id;
  url;
  chatName;
  isAnimated;
  isModifier;

  constructor(bttvEmote: __BTTV__GlobalEmote__ | __BTTV__UserEmote__) {
    this.id = bttvEmote.id;
    this.url = `//cdn.betterttv.net/emote/${this.id}`;
    this.chatName = bttvEmote.code;
    this.isAnimated = bttvEmote.animated;
    this.isModifier = bttvEmote.modifier ?? false;
  }
}

export type BttvEmoteCollection = { emotes: BetterTTVEmote[] };

const BTTV_EMOTE_SET_STORAGE_PREFIX = "bttv::emote-sets::" as const;

export const getBttvEmoteCollectionFromStorage =
  createStorageReader<BttvEmoteCollection>(BTTV_EMOTE_SET_STORAGE_PREFIX);

export const setBttvEmoteCollectionToStorage =
  createStorageWriter<BttvEmoteCollection>(BTTV_EMOTE_SET_STORAGE_PREFIX);
