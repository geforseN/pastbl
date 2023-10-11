import type { BetterTTVEmote as _BetterTTVEmote } from "./BetterTTV.client";
import {
  getBttvEmoteCollectionFromStorage,
  setBttvEmoteCollectionToStorage,
} from "./BetterTTV.client";
import {
  fetchBetterTTVGlobalEmotes,
  fetchBetterTTVUserEmotes,
} from "./BetterTTV.api";

export type BetterTTVEmote = _BetterTTVEmote;

export function BetterTTVEmoteString(emote: BetterTTVEmote) {
  return `<span class="inline-block" title="${emote.chatName} emote from BetterTTV"><img src="https:${emote.url}/1x.webp"></span>`;
}

export async function getBttvGlobalEmoteCollection() {
  return getBetterTTVEmotesSet("global", fetchBetterTTVGlobalEmotes);
}

export async function getBttvEmoteCollectionByUserId(userId: string) {
  return getBetterTTVEmotesSet(userId, fetchBetterTTVUserEmotes);
}

async function getBetterTTVEmotesSet<
  AsyncFetchFunc extends (...args: any[]) => Promise<BetterTTVEmote[]>,
>(key: string, fetchEmotesFromBttvApi: AsyncFetchFunc) {
  const emoteCollectionFromLocalStorage =
    getBttvEmoteCollectionFromStorage(key);
  if (emoteCollectionFromLocalStorage) {
    // TODO: here we can map over emoteCollectionFromLocalStorage.emotes => new BetterTTVEmote,
    // so we can use methods from prototype (but for now there no methods, class is dumb)
    return emoteCollectionFromLocalStorage;
  }
  const emoteCollectionFromFetch = {
    emotes: await fetchEmotesFromBttvApi(key),
  };
  setBttvEmoteCollectionToStorage(key, emoteCollectionFromFetch);
  return emoteCollectionFromFetch;
}
