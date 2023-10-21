import type { BetterTTVEmote as _BetterTTVEmote } from "./BetterTTV.client";
import {
  BTTVSet,
  BTTVEmote,
  getBttvEmoteCollectionFromStorage,
  setBttvEmoteCollectionToStorage,
} from "./BetterTTV.client";
import {
  fetchBetterTTVGlobalEmotes,
  fetchBetterTTVUserById,
} from "./BetterTTV.api";

export type BetterTTVEmote = _BetterTTVEmote;

export function BetterTTVEmoteString(emote: BetterTTVEmote) {
  return `<span class="inline-block" title="${emote.token} emote from BetterTTV"><img src="https:${emote.url}/1x.webp"></span>`;
}

export async function getBttvGlobalEmoteCollection() {
  const emoteCollectionFromStorage =
    getBttvEmoteCollectionFromStorage("global");
  if (emoteCollectionFromStorage) {
    return emoteCollectionFromStorage;
  }
  const emoteCollection = new BTTVSet(
    await fetchBetterTTVGlobalEmotes().then((emotesArray) =>
      emotesArray.map((emote) => new BTTVEmote(emote, "global")),
    ),
  );
  setBttvEmoteCollectionToStorage("global", emoteCollection);
  return emoteCollection;
}

export async function getBttvEmoteCollectionByUserId(userId: string) {
  const emoteCollectionFromLocalStorage =
    getBttvEmoteCollectionFromStorage(userId);
  if (emoteCollectionFromLocalStorage) {
    return emoteCollectionFromLocalStorage;
  }
  const emoteCollection = new BTTVSet(
    await fetchBetterTTVUserById(userId).then((data) => {
      return [
        ...data.channelEmotes.map((emote) => new BTTVEmote(emote, "channel")),
        ...data.sharedEmotes.map((emote) => new BTTVEmote(emote, "shared")),
      ];
    }),
  );

  setBttvEmoteCollectionToStorage(userId, emoteCollection);
  return emoteCollection;
}
