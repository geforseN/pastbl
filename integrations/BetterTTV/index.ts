import { BetterTTVApi } from "./api";
import type { IBetterTTVEmote } from "./entity/BetterTTVEmote";
import { createBTTVGlobalCollection } from "./entity/createBTTVGlobalCollection";
import { createBTTVUserIntegration } from "./entity/createBTTVUserIntegration";

import type { BetterTTVGlobalCollection } from "./entity/BetterTTVGlobalCollection";
import type { BetterTTVUserIntegration } from "./entity/BetterTTVUserIntegration";
import type { IBetterTTVSet } from "./entity/BetterTTVSet";

function getBTTVEmoteTitle(emote: IBetterTTVEmote) {
  return `${emote.token} emote from BetterTTV`;
}

export function BTTVEmoteString(emote: IBetterTTVEmote) {
  return `<img src="${emote.url}" alt="${getBTTVEmoteTitle(
    emote,
  )}" loading="lazy">`;
}

export function BTTVWrappedEmoteString(emote: IBetterTTVEmote) {
  return `<span class="inline-block" title="${getBTTVEmoteTitle(
    emote,
  )}">${BTTVEmoteString(emote)}</span>`;
}

export async function makeBTTVUserIntegration(
  twitchId: number,
  twitchLogin: Lowercase<string>,
) {
  const bttvUser = await BetterTTVApi.getUserByTwitchId(twitchId, twitchLogin);
  const user = {
    ...bttvUser,
    twitch: { login: twitchLogin },
  };
  return createBTTVUserIntegration(user);
}

export const BetterTTV = {
  giveGlobalCollection: createBTTVGlobalCollection,
  giveUserIntegration: makeBTTVUserIntegration,
};

export type IBetterTTV = {
  Set: IBetterTTVSet;
  Emote: IBetterTTVEmote;
  Global: {
    Collection: BetterTTVGlobalCollection;
  };
  User: {
    Integration: BetterTTVUserIntegration;
  };
};
export type { BetterTTVGlobalCollection } from "./entity/BetterTTVGlobalCollection";
export type { BetterTTVUserIntegration } from "./entity/BetterTTVUserIntegration";
export type { IBetterTTVSet } from "./entity/BetterTTVSet";
export type { IBetterTTVEmote } from "./entity/BetterTTVEmote";
