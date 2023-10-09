import { parse, stringify } from "zipson";

type __BTTV__GlobalEmote = {
  id: string;
  code: string;
  imageType: "png" | "webp" | "gif";
  animated: boolean;
  modifier: boolean;
  hight?: number;
  width?: number;
  userId?: string;
  userName?: string;
  userDisplayName?: string;
  userProviderId?: string;
};

type __BTTV__UserEmote__ = {
  animated: boolean;
  approvalStatus: string;
  code: string;
  createdAt: ReturnType<Date["toISOString"]>;
  global: boolean;
  id: string;
  imageType: "png" | "webp" | "gif";
  live: boolean;
  sharing: boolean;
  updatedAt: ReturnType<Date["toISOString"]>;
  userId: string;
};

type __BTTV__UserData__ = {
  bots: [];
  channelEmotes: __BTTV__UserEmote__[]; // NOTE: type can be wrong
  displayName: string;
  id: string;
  name: string;
  providerId: string;
  sharedEmotes: __BTTV__UserEmote__[]; // NOTE: type can be wrong
};

class BetterTTVEmote {
  id;
  url;
  chatName;
  isAnimated;
  isModifier;

  constructor(bttvEmote: __BTTV__GlobalEmote | __BTTV__UserEmote__) {
    this.id = bttvEmote.id;
    this.url = `https://cdn.betterttv.net/emote/${this.id}/1x.webp`;
    this.chatName = bttvEmote.code;
    this.isAnimated = bttvEmote.animated;
    this.isModifier = bttvEmote.modifier ?? false;
  }
}

const BTTV_EMOTE_SET_STORAGE_PREFIX = "bttv::emote-sets::" as const;

type BttvEmoteSet = { emotes: BetterTTVEmote[] };

function getBttvEmoteSetFromStorage(key: string, storage = localStorage) {
  return parse(
    storage.getItem(`${BTTV_EMOTE_SET_STORAGE_PREFIX}${key}`) ?? "",
  ) as BttvEmoteSet | "";
}

function setBttvEmoteSetToStorage(key: string, bttvEmoteSet: BttvEmoteSet) {
  localStorage.setItem(
    `${BTTV_EMOTE_SET_STORAGE_PREFIX}${key}`,
    stringify(bttvEmoteSet),
  );
}

async function getBetterTTVEmotesSet(
  key: string,
  fetchEmotesFromBttvApi: (key: string) => Promise<BetterTTVEmote[]>,
) {
  const bttvGlobalEmotesFromLocalStorage = getBttvEmoteSetFromStorage(key);
  if (bttvGlobalEmotesFromLocalStorage) {
    return bttvGlobalEmotesFromLocalStorage;
  }
  const bttvGlobalEmotesSet = {
    emotes: await fetchEmotesFromBttvApi(key),
  };
  setBttvEmoteSetToStorage(key, bttvGlobalEmotesSet);
  return bttvGlobalEmotesSet;
}

async function getBetterTTVUserEmotesSet(key: string) {
  return getBetterTTVEmotesSet(key, fetchBetterTTVUserEmotes);
}

// NOTE: result of fetch includes modifier emote (e.g. c!, h!, l!) which are not yet supported
async function fetchBetterTTVGlobalEmotes(): Promise<BetterTTVEmote[]> {
  return fetch("https://api.betterttv.net/3/cached/emotes/global")
    .then((response) => {
      return response.json();
    })
    .then((emotesArray: __BTTV__GlobalEmote[]) =>
      emotesArray.map((emote) => new BetterTTVEmote(emote)),
    );
}

async function fetchBetterTTVUserEmotes(
  userId: string,
): Promise<BetterTTVEmote[]> {
  return fetch(`https://api.betterttv.net/3/users/${userId}`)
    .then((response) => {
      return response.json();
    })
    .then((data: __BTTV__UserData__) => {
      return [
        ...data.channelEmotes.map((emote) => new BetterTTVEmote(emote)),
        ...data.sharedEmotes.map((emote) => new BetterTTVEmote(emote)),
      ];
    });
}

export const getBetterTTVGlobalEmoteSet = async () =>
  getBetterTTVEmotesSet("global", fetchBetterTTVGlobalEmotes);

export const getBetterTTVUzyEmotesSet = async () =>
  getBetterTTVUserEmotesSet("550ad384a607044d1a3dd29b");

export function BetterTTVEmoteString(emote: BetterTTVEmote) {
  return String.raw`
    <span 
      class="inline-block" 
      title="${emote.chatName} emote from BetterTTV" 
    >
      <img src="${emote.url}">
    </span>
  `;
}
