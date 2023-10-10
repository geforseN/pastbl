import type { BetterTTVEmote } from "./BetterTTV";
import {
  getBttvEmoteCollectionFromStorage,
  setBttvEmoteCollectionToStorage,
} from "./BetterTTV";
import {
  fetchBetterTTVGlobalEmotes,
  fetchBetterTTVUserEmotes,
} from "./BetterTTV.api";

export function BetterTTVEmoteString(emote: BetterTTVEmote) {
  return `<span class="inline-block" title="${emote.chatName} emote from BetterTTV">
    <img src="https:${emote.url}/1x.webp">
  </span>`;
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
    return emoteCollectionFromLocalStorage;
  }
  const emoteCollectionFromFetch = {
    emotes: await fetchEmotesFromBttvApi(key),
  };
  setBttvEmoteCollectionToStorage(key, emoteCollectionFromFetch);
  return emoteCollectionFromFetch;
}
